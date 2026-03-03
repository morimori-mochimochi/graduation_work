import { fetchCurrentPos } from "./current_pos"
import { initSetTime } from "./set_arrival_time";
import { initResetRouteBtn } from "./reset_route";

function isValidLatLng(point) {
  return point && typeof point.lat === 'function' && typeof point.lng === 'function';
}

// ルート検索成功時の処理をまとめるヘルパー関数
function handleSuccessfulRoute(response, walkRenderer) {
  walkRenderer.setDirections(response);
  window.walkRouteRenderer = walkRenderer; // グローバルに保存
  window.routeData.travel_mode = 'WALKING';

  const route = response.routes[0];
  if (!route || !route.legs || route.legs.length === 0) {
    console.error("ルート情報が不正です:", response);
    throw new Error("取得したルート情報が不正です。");
  }

  // 総距離と総所要時間を計算
  let totalDistance = 0;
  let totalDuration = 0;
  route.legs.forEach(leg => {
    totalDistance += leg.distance.value;
    totalDuration += leg.duration.value;
  });

  // 徒歩アイコンを作成して表示
  const walkIcon = {
    // Google Material Icons "directions_walk"
    path: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7',
    fillColor: '#4285F4', // 徒歩ルートの色(blue)に合わせる
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: 'white',
    rotation: 0,
    scale: 1.3,
    anchor: new google.maps.Point(12, 12),
  };

  window.walkIconMarker = new google.maps.Marker({
    position: route.legs[0].start_location,
    map: window.map,
    icon: walkIcon,
    title: '徒歩ルート',
    zIndex: 100
  });

  // 計算結果をグローバルなルート情報に保存
  window.routeData.total_distance = totalDistance;
  window.routeData.total_duration = totalDuration;

  // 呼び出し元に結果を返す
  return { status: "OK", response: response, renderer: walkRenderer };
}

// export: この関数を他のファイルでも使えるように公開する、の意味
// async: この関数は非同期処理を行います、の意味。
// awaitを使って処理を一時待機できる
export async function walkDrawRoute() {
  if (window.walkRouteRenderer) {
    window.walkRouteRenderer.setMap(null);
    window.walkRouteRenderer = null;
  }

  // 既存の徒歩アイコンマーカーをクリア
  if (window.walkIconMarker) {
    window.walkIconMarker.setMap(null);
    window.walkIconMarker = null;
  }

  sessionStorage.removeItem("directionsResult");

  // APIの読み込みを待つ
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

  const directionsService = new google.maps.DirectionsService();
  const waypoints = [];
  window.routeData.waypoints.forEach(wp => {
    // 徒歩ルートなので、駐車場の有無に関わらず本来の地点(mainPoint)を経由地とする
    // 明示的に駐車場情報を無視して予期せぬ挙動を予防
    const location = wp.mainPoint?.point;
    if (location && isValidLatLng(location)) {
      waypoints.push({
        location: location,
        // stopover: trueは経由地で立ち寄ることを意味する
        // falseにすると通過点として扱われ、その地点を通過するだけになる
        stopover: true
      });
    }
  });

  const request = {
    origin: originPos,
    destination: finalDestination,
    travelMode: google.maps.TravelMode.WALKING,
    waypoints: waypoints,
    optimizeWaypoints: true // ウェイポイントの順序を最適化
  };

  try {
    const response = await directionsService.route(request);
    // この徒歩ルート専用のDirectionsRendererを生成
    const walkRenderer = new google.maps.DirectionsRenderer({
      map: window.map,
    });
    // 成功時の処理をヘルパー関数に委譲
    return handleSuccessfulRoute(response, walkRenderer);
  } catch (error) {
    // Google Maps APIからのエラー(status付き)と、その他のエラーを区別
    // Directions APIのエラーは `code` プロパティにステータスが入る
    const status = error.code || 'UNKNOWN_ERROR';
    alert("ルートの検索に失敗しました。");
    console.error("ルートの検索に失敗しました:", status, error);
    // エラーを呼び出し元に伝播させる
    throw error;
  }
};

function initRouteContent() {
  document.addEventListener('routeDrawn', (event) => {
    if (event.detail.status === 'OK') {
      initSetTime();
    }
  });
}

initRouteContent();
initResetRouteBtn();
  
// システムテストから呼び出せるように、関数をグローバルスコープに公開する
window.walkDrawRoute = walkDrawRoute;