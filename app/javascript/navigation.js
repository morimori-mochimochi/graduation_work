import { fetchCurrentPos } from "./current_pos";

// マーカーを滑らかに動かすための変数
let lastMarkerPosition = null;
let animationFrameId = null;

// #現在地マーカー
let currentMarker;
// #watchIdは位置情報の監視プロセスを識別する番号
let watchId;
// #stepIndexはDirectionsResult内の経路をどのステップまで進んだか管理する番号
let stepIndex = 0;

// リルートのクールダウンを管理する変数（連続リロード防止)
// リルート頻発しないように間隔をあける
let isRerouting = false;
const REROUTE_COOLDOWN_MS = 10000;

export function stopNavigation() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  //描画されたルートを消す
  if (window.directionsRenderer) {
    window.directionsRenderer.setMap(null);
  }

  //現在地マーカーを消す
  if (currentMarker) {
    currentMarker.setMap(null);
    currentMarker = null;
  }
  // ナビ停止時はリルートフラグもリセット
  isRerouting = false;

  // アニメーションを停止
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function showArrivalMessage() {
  const ids=["arrivalMessage", "arrivalMessageCar"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    // ふわっとメッセージを表示
    el.classList.remove('hidden');
    setTimeout(() => {
      el.classList.add('opacity-100');
    }, 10);
  })
}

async function reroute(currentLatLng, destination, travelMode) {
  const directionsService = new google.maps.DirectionsService();

  // リルートフラグを立てる
  isRerouting = true;

  const request = {
    origin: currentLatLng, // 現在地を新しい出発地とする
    destination: destination, // 最終目的地
    travelMode: travelMode, // 移動手段（元の設定を再利用）
    unitSystem: google.maps.UnitSystem.METRIC, // メートル記法で
  };

  try {
    const response = await directionsService.route(request);

    if (response.status === google.maps.DirectionsStatus.OK) {
      // 成功した場合、DirectionsResultを更新
      window.directionsRenderer.setDirections(response);

      // ルート情報を更新するためにsessionStorageとナビゲーション内部の状態も更新
      sessionStorage.setItem("directionsResult", JSON.stringify(response));
      // stepIndexをリセットして新たなルートの最初から追跡開始
      stepIndex = 0;

      return true;
    } else {
      console.error("Directions APIからの応答が不正です: ", response.status);
      return false;
    }
  } catch(error) {
    console.error("Directions APIリクエスト中にエラーが発生しました: ", error);
    return false;
  } finally {
    // クールダウン後、フラグを解除
    // 連続リルートを防ぐため、リクエストの結果に関わらず一定時間待つ
    setTimeout(() => {
      isRerouting = false;
    }, REROUTE_COOLDOWN_MS);
  }
}

// マーカーを滑らかに動かすアニメーション関数
function animateMarkerTo(marker, newPosition, duration = 1000) {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  const startPosition = marker.getPosition();
  lastMarkerPosition = newPosition; //次の更新のために最終位置を保存
  const startTime = performance.now();

  // elapseTime: どれくらい時間が経過したか
  // Math.min: JSに組み込まれている数学用オブジェクト
  // 引数として渡された数値の中から最も小さい値を返す
  const animate = (currentTime) => {
    const elapseTime = currentTime - startTime;
    const fraction = Math.min(elapseTime / duration, 1);

    // 線形補間で中間地点を計算
    const lat = startPosition.lat() + (newPosition.lat - startPosition.lat()) * fraction;
    const lng = startPosition.lng() + (newPosition.lng - startPosition.lng()) * fraction;
    const interpolatedPosition = new google.maps.LatLng(lat, lng); //googleMapが理解できる形にして補完地点保存

    marker.setPosition(interpolatedPosition);

    if (fraction < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      animationFrameId = null;
    }
  };
  animationFrameId = requestAnimationFrame(animate);
}

export async function startNavigation() {
  //既存のナビがあれば停止
  stopNavigation();
  stepIndex = 0;
  isRerouting = false; // 再度開始時にフラグをリセット

  // sessionStorageから直接データを取得する
  const storedDirections = sessionStorage.getItem("directionsResult");

  // データがない場合は処理を中断
  if (!storedDirections) {
    alert("ルートが設定されていません");
    return;
  }

  try {
    //まず現在地を取得して地図をそこにズームする
    const initialPos = await fetchCurrentPos();
    if (initialPos) {
      window.map.panTo(initialPos);
      window.map.setZoom(20);
    }
  } catch (error) {
    console.error("初期位置の取得に失敗しました:", error);
  }

  // JSON文字列をオブジェクトに変換
  const directionsResult = JSON.parse(storedDirections);

  // 最初のルート情報から目的地と移動手段を取得
  const route_info = directionsResult.routes[0];
  // 最終目的地のLatLngオブジェクト
  const originalDestination = route_info.legs[route_info.legs.length - 1].end_location;
  // 元ルートの移動手段
  const travelMode = directionsResult.request.travelMode;

  // DirectionsRendererを初期化し、ルートを描画する
  if (!window.directionsRenderer) {
    window.directionsRenderer = new google.maps.DirectionsRenderer({
      //suppressMarkers: true, //ナビ中の始点、終点のマーカーを非表示にする
      preserveViewport: true, //ルート描画中に地図の表示領域を維持する
      polylineOptions: {
        strokeColor: '#4A90E2', //線の色を少し明るく
        strokeOpacity: 0.8, //線の不透明度
        strokeWeight: 6 //線の太さ
      }
    });
  }
  window.directionsRenderer.setMap(window.map);
  window.directionsRenderer.setDirections(directionsResult);

  // 最初のルート情報を取得
  const route = directionsResult.routes[0].legs[0];
  const steps = route.steps;

  // ルート全体のルート情報を取得
  const routePath = directionsResult.routes[0].overview_path; //ポリラインの配列を取得

  // 現在地の追跡開始
  // 常に現在地を監視することでユーザの位置が変わるたびにこの関数が呼ばれる
  watchId = navigator.geolocation.watchPosition(
    (pos) => { // asyncは不要に
      // watchPositionのコールバック引数から直接位置情報を取得
      // coords: coordinates(座標)の略
      const currentPos = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

      // {lat:35.6,lng:139.7}このような座標を
      // new google.maps.LatLng(35.6, 139.7)このような
      // GoogleMapsが理解できるLatLngオブジェクトに変換
      const currentLatLng = new google.maps.LatLng(currentPos);

       // 最初の一回はマーカーを作成。それ以降はそれを更新
      // リルート後の新しいルート情報を保持する変数
      let updated_routePath = routePath;

      if (!currentMarker) {
        currentMarker = new google.maps.Marker({
          position: currentPos,
          map: window.map,
          title: "現在地",
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 8, 
            fillColor: "#00F",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFF"
          }
        });
        lastMarkerPosition = currentPos;
      }else{
        // マーカーを瞬間移動させる代わりにアニメーションさせる
        if (lastMarkerPosition?.lat !== currentPos.lat || lastMarkerPosition?.lng !== currentPos.lng) {
          animateMarkerTo(currentMarker, currentPos);
        }
      }

      // 進行方向が取得できればマーカーを回転させる
      // 停止中は回転させない
      if (pos.coords.heading != null && pos.coords.speed > 0.5) {
        const icon = currentMarker.getIcon();
        icon.rotation = pos.coords.heading;
        currentMarker.setIcon(icon);
      }

      // #マップを追従
      window.map.panTo(currentPos);

      // リルートが発生したときにroutePathを更新
      // sessionStorageから最新のルート情報を再取得
      const updatedDirections = JSON.parse(sessionStorage.getItem("directionsResult"));
      if (updatedDirections) {
        updated_routePath = updatedDirections.routes[0].overview_path;
      }

      // 現在地がルートポリライン上にあるかチェック
      // isLocationOnEdge関数は指定された地点がポリラインから指定した50m以内にあるか判定する公式メソッド
      const isNearRoute = google.maps.geometry.poly.isLocationOnEdge(
        currentLatLng,
        new google.maps.Polyline({ path: updated_routePath }), // ルート全体のポリライン
        50 // 許容範囲(m)
      );

      // ルートから大きく逸脱している & リルート処理中でない場合
      if (!isNearRoute && !isRerouting) {
        console.warn("⚠️ルートから逸脱しました。リルートを開始します");

        // リルートを実行し、ステップ進行ロジックが実行されぬようここでreturn
        reroute(currentLatLng, originalDestination, travelMode);
        return;    
      }

      // リルート処理中の場合は、ステップ進行判定をスキップ
      if (isRerouting) {
        return;
      }

      // 現在地と次のステップの目的地との直線距離を計算
      const nextStep = steps[stepIndex].end_location;
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        currentLatLng,
        nextStep
      );

      // 次のステップに近づいたら進める
      // 現在地~次ステップの距離が30m以下になったら次に移る
      // step.length -1は最後のステップ
      // step++はステップ番号を一つ進める
      if (distance < 30) {
        if (stepIndex < steps.length -1) {
          stepIndex++;
        }else{
          //　最終目的地に到着
          stopNavigation();
          showArrivalMessage();
        }
      }
    },
    (err) => {
    // エラーコードに応じて処理を分析 
    const showErrorMessage = (message, duration = 3000) => {
      const errorEl =document.getElementById('error-message');
      if (!errorEl) return;

      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
      
      // durationミリ秒後にメッセージを消す
      setTimeout(() => {
        errorEl.classList.add('opacity-0');
        // transitionが終わってからhiddenにする
        setTimeout(() => errorEl.classList.add('hidden'), 300);
      }, duration);
      
      console.error(message);
    };
    
    switch (err.code) {
      case err.PERMISSION_DENIED:
        showErrorMessage("位置情報へのアクセスが拒否されました。");
        stopNavigation();
        break; // switch 中断の合図
      case err.POSITION_UNAVAILABLE:
        console.warn("現在地が取得できませんでした。再試行します。");
        //ナビは継続し、次の更新を待つ
        break;
      case err.TIMEOUT:
        console.warn("位置情報の取得がタイムアウトしました。再試行します。");
        // タイムアウトも一時的な場合があるため、ナビは持続
        break;
      }
    },
    // GPSを使って今現在の正確な位置情報をとってくるようにする
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );
};
