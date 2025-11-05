console.log("navigation.jsを始めます");

import { fetchCurrentPos } from "./current_pos";

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

const directionsService = new google.maps.DirectionsService();

export function stopNavigation() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    console.log("ナビゲーションを停止しました");
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
    console.log("到着メッセージを表示しました");
  })
}

async function reroute(currentLatLng, destination, travelMode) {
  console.log("リルート処理を開始します: ", currentLatLng, destination);

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

      console.log("💮リルート完了。新ルートが描画された。");
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
      console.log("リルートクールダウン終了");
    }, REROUTE_COOLDOWN_MS);
  }
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
  console.log("★ startNavigation開始:", directionsResult);

  // 最初のルート情報から目的地と移動手段を取得
  const route_info = directionsResult.route[0];
  // 最終目的地のLatLngオブジェクト
  const originalDestination = route_info.legs[route_info.legs.length - 1].end_location;
  // 元ルートの移動手段
  const travelMode = directionsResult.request.travelMode;

  // DirectionsRendererを初期化し、ルートを描画する
  if (!window.directionsRenderer) {
    window.directionsRenderer = new google.maps.DirectionsRenderer({
      //suppressMarkers: true, //ナビ中の始点、終点のマーカーを非表示にする
      preserveViewport: true, //ルート描画中に地図の表示領域を維持する
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
      const currentPos = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

      // {lat:35.6,lng:139.7}このような座標を
      // new google.maps.LatLng(35.6, 139.7)このような
      // GoogleMapsが理解できるLatLngオブジェクトに変換
      const currentLatLng = new google.maps.LatLng(currentPos);

       // 最初の一回はマーカーを作成。それ以降はそれを更新
      if (!currentMarker) {
        currentMarker = new google.maps.Marker({
          position: currentPos,
          map: window.map,
          title: "現在地",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: "#00F",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFF"
          }
        });
      }else{
        currentMarker.setPosition(currentPos);
      }  
      // #マップを追従
      window.map.panTo(currentPos);

      // リルートが発生したときにroutePathを更新
      // sessionStorageから最新のルート情報を再取得
      const updateDirections = JSON.parse(sessionStorage.getItem("directionsResult"));
      if (updatedDirections) {
        routePath = updatedDirections.route[0].overview_path;
      }

      // 現在地がルートポリライン上にあるかチェック
      // isLocationOnEdge関数は指定された地点がポリラインから指定した50m以内にあるか判定する公式メソッド
      const isNearRoute = google.maps.geometry.poly.isLocationOnEdge(
        currentLatLng,
        new google.maps.Polyline({ path: routePath }), // ルート全体のポリライン
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
        console.log("リルート処理のため、ステップ進行をスキップします");
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
          console.log("次のステップへ進みます:", steps[stepIndex].instructions);
        }else{
          //　最終目的地に到着
          console.log("目的地に到着しました。ナビを終了します。");
          stopNavigation();
          showArrivalMessage();
        }
      }
    },           
    (err) => {
      console.error("位置情報の取得に失敗しました: ", err);
      stopNavigation();
    },
    // GPSを使って今現在の正確な位置情報をとってくるようにする
    { enableHighAccuracy: true, maximumAge: 0 }
  );
};
