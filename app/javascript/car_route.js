import { fetchCurrentPos } from "./current_pos"
import { initSetTime } from "./set_arrival_time";
import { initResetRouteBtn } from "./reset_route";
import { walkDrawRoute } from "./walk_route";
import { selectRouteModule } from "./select_route";

function isValidLatLng(point) {
  return point && typeof point.lat === 'function' && typeof point.lng === 'function';
}

// クリック判定用の透明ポリラインを管理する配列
window.routeHitLines = [];

export async function carDrawRoute(map = window.map) {
  // 新しいルートを作成する前に、既存のルート情報をsessionStorageから削除
  sessionStorage.removeItem("directionsResult");

  // 既存の車アイコンマーカーをクリア
  if (window.carIconMarker) {
    window.carIconMarker.setMap(null);
    window.carIconMarker = null;
  }

  await window.mapApiLoaded;

  let originPos;
  if (window.routeData.start && window.routeData.start.point) {
    originPos = window.routeData.start.point;
  } else {
    originPos = await fetchCurrentPos();
    window.routeData.start = { point: originPos, name: "現在地" }; // 現在地をrouteDataに保存
  }
  const finalDestination = window.routeData.destination.mainPoint.point;

  if (!finalDestination || !isValidLatLng(finalDestination)) {
    const errorMessage = "目的地を選択してください";
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  // 既存のルート描画をクリア
  if (window.carRouteRenderers) {
    window.carRouteRenderers.forEach(renderer => renderer.setMap(null));
  }
  window.carRouteRenderers = [];

  const directionsService = new google.maps.DirectionsService();
  
  // 車ルートの経由地リストをアプリケーション側で作成
  const carWaypoints = [];
  
  // 中継点を処理
  window.routeData.waypoints.forEach(wp => {
    // 駐車場が設定されていれば駐車場を、なければ本来の地点を経由地とする
    // これはあったらアクセスする、というエラーを防ぐ書き方
    const location = wp.parkingLot?.point || wp.mainPoint.point;
    if (location && isValidLatLng(location)) {
      carWaypoints.push({
        location: location,
        stopover: true
      });
    }
  });

  // 最終目的地（またはその駐車場）を決定
  const finalCarDestination = window.routeData.destination.parkingLot?.point || finalDestination;

  const request = {
    origin: originPos,
    destination: finalCarDestination,
    waypoints: carWaypoints,
    travelMode: google.maps.TravelMode.DRIVING,
    optimizeWaypoints: false // ユーザーが設定した順序を維持
  };

  try {
    const response = await directionsService.route(request);
    
    // 車ルートを描画
    const carRenderer = new google.maps.DirectionsRenderer({ map: map, polylineOptions: { strokeColor: 'green' } });
    carRenderer.setDirections(response);
    window.carRouteRenderers.push(carRenderer);

    // 車ルートの総距離と総所要時間を計算
    const route = response.routes[0];
    if (route && route.legs && route.legs.length > 0) {
      let totalDistance = 0;
      let totalDuration = 0;

      route.legs.forEach(leg => {
        totalDistance += leg.distance.value; // 距離をメートルで加算
        totalDuration += leg.duration.value; // 所要時間を秒で加算
      });

      // 車ルートであることを示すアイコンを始点に表示
      const carIcon = {
        // --- アイコンのパターン（お好みでコメントアウトを切り替えてください） ---
        // パターン1: 標準的な車（正面）
        path: 'M18.92 6.01C18.72 5.42 18.15 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z' +
              'M6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 13 17.5 13s1.5.67 1.5 1.5S18.33 16 17.5 16z' +
              'M5 11l1.5-4.5h11L19 11H5z',

        // パターン2: トラック（少し大きめで目立つ）
        // path: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',

        // パターン3: 横向きのセダン（スタイリッシュ）
        // path: 'M17.5,10c-0.83,0-1.5,0.67-1.5,1.5S16.67,13,17.5,13S19,12.33,19,11.5S18.33,10,17.5,10z M6.5,10 C5.67,10,5,10.67,5,11.5S5.67,13,6.5,13S8,12.33,8,11.5S7.33,10,6.5,10z M21,10h-1l-2-5c-0.27-0.67-0.93-1.11-1.65-1.11H7.65 c-0.72,0-1.38,0.44-1.65,1.11l-2,5H3c-1.1,0-2,0.9-2,2v5c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-1h16v1c0,0.55,0.45,1,1,1h1 c0.55,0,1-0.45,1-1v-5C23,10.9,22.1,10,21,10z M6,6h12l1.6,4H4.4L6,6z',

        fillColor: '#4CAF50', // ルートの色(green)に合わせる
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: 'white',
        rotation: 0,
        scale: 1.3,
        anchor: new google.maps.Point(12, 12),
      };

      window.carIconMarker = new google.maps.Marker({
        position: route.legs[0].start_location, // 実際のルート開始地点に配置
        map: map,
        icon: carIcon,
        title: '車ルート',
        zIndex: 100 // 他のマーカーより手前に表示
      });

      // 計算結果をグローバルなルート情報に保存
      window.routeData.total_distance = totalDistance;
      window.routeData.total_duration = totalDuration;
    }

    // 駐車場から目的地までの徒歩ルートを別途描画
    const walkingRoutes = [];
    // 中継点の徒歩ルート
    window.routeData.waypoints.forEach(wp => {
      if (wp.parkingLot?.point && wp.mainPoint?.point) {
        walkingRoutes.push({ origin: wp.parkingLot.point, destination: wp.mainPoint.point });
      }
    });
    // 最終目的地の徒歩ルート
    if (window.routeData.destination.parkingLot?.point) {
      walkingRoutes.push({ origin: window.routeData.destination.parkingLot.point, destination: finalDestination });
    }

    // 各徒歩ルートを非同期で取得して描画
    // Promise.allを使って全ての非同期処理の完了を待つ
    await Promise.all(walkingRoutes.map(async (walk) => {
      try {
        const walkResponse = await directionsService.route({ ...walk, travelMode: 'WALKING' });
        const walkRenderer = new google.maps.DirectionsRenderer({ map: map, preserveViewport: true, polylineOptions: { strokeColor: 'blue', strokeOpacity: 0.7, strokeWeight: 5 } });
        walkRenderer.setDirections(walkResponse);
        window.carRouteRenderers.push(walkRenderer);
      } catch (e) {
        console.warn("駐車場からの徒歩ルート取得に失敗しました:", e);
      }
    }));

    // 呼び出し元で制御するため、ここでは保存せず結果とレンダラーを返す
    return { status: "OK", response: response, renderers: window.carRouteRenderers };
    
  } catch (error) {
    console.error("ルートの取得に失敗しました:", error);
    alert("ルートの取得に失敗しました: " + (error.message || error));
    throw error;
  }
}
export function drawRouteBtn() {
  const drawRouteBtn = document.getElementById("drawRoute");

  if (drawRouteBtn) {
    drawRouteBtn.addEventListener("click", async() => {
      // 連打防止：処理中はボタンを無効化し、テキストを変更
      // disabledプロパティ: クリックに無反応になる
      drawRouteBtn.disabled = true;
      const originalText = drawRouteBtn.innerHTML;
      drawRouteBtn.textContent = "検索中...";

      try {
        // 既存のクリック判定用ラインを削除
        if (window.routeHitLines) {
          window.routeHitLines.forEach(line => line.setMap(null));
        }
        window.routeHitLines = [];

        const [carResult, walkResult] = await Promise.all([
          carDrawRoute(window.map).catch(e => { 
            console.error("carDrawRoute failed:", e);
            return null; 
          }),
          walkDrawRoute().catch(e => { 
            console.error("walkDrawRoute failed:", e);
            return null; 
          })
        ]);

        // どちらかのルート検索が成功した場合に、初回描画完了イベントを発火
        const successfulResult = (carResult && carResult.status === 'OK') ? carResult : walkResult;
        if (successfulResult && successfulResult.status === 'OK') {
          // sessionStorageへの保存は selectRouteModule 内で行われるため、ここではイベント発火のみ行う
          const event = new CustomEvent('routeDrawn', { detail: { status: 'OK' } });
          document.dispatchEvent(event);
        }

        selectRouteModule(carResult, walkResult);

      } catch (err) {
        console.error("Unexpected error:", err);
        // carDrawRoute内部でalertが出ている場合もあるが、予期せぬエラーに備える
      } finally {
        // 成功・失敗に関わらず、処理終了後にボタンを必ず元の状態に戻す
        drawRouteBtn.disabled = false;
        drawRouteBtn.innerHTML = originalText;
      }
    });
  }else{
  console.warn("drawRouteボタンが存在しません");
  }
}

function initRouteContent() {
  document.addEventListener('routeDrawn', (event) => {
    if (event.detail.status === 'OK') {
      initSetTime();
    }
  });
}

// イベントリスナーを初期化時に一度だけ登録する
initRouteContent();
initResetRouteBtn();

window.carDrawRoute = carDrawRoute;