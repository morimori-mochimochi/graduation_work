import { fetchCurrentPos } from "./current_pos"

function isValidLatLng(point) {
  return point && typeof point.lat === 'function' && typeof point.lng === 'function';
}

export async function carDrawRoute() {
  await window.mapApiLoaded;

  // routeDataはルートの出発、到着、中継点
  const originPos = window.routeData.start.point || await fetchCurrentPos();
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
    const carRenderer = new google.maps.DirectionsRenderer({ map: window.map, polylineOptions: { strokeColor: 'green' } });
    carRenderer.setDirections(response);
    window.carRouteRenderers.push(carRenderer);

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
    walkingRoutes.forEach(async (walk) => {
      const walkResponse = await directionsService.route({ ...walk, travelMode: 'WALKING' });
      const walkRenderer = new google.maps.DirectionsRenderer({ map: window.map, preserveViewport: true, polylineOptions: { strokeColor: 'blue', strokeOpacity: 0.7, strokeWeight: 5 } });
      walkRenderer.setDirections(walkResponse);
      window.carRouteRenderers.push(walkRenderer);
    });

    // ナビゲーション用にメインの車ルートを保存
    window.routeData.travel_mode = 'DRIVING';
    window.directionsResult = response;
    sessionStorage.setItem("directionsResult", JSON.stringify(response));
    const event = new CustomEvent('routeDrawn', { detail: { status: 'OK', response: response } });
    document.dispatchEvent(event);
    return "OK";
  } catch (error) {
    console.error("ルートの取得に失敗しました:", error);
    alert("ルートの取得に失敗しました: " + (error.message || error));
    throw error;
  }
}
export function carRouteBtn() {
  const carDrawRouteBtn = document.getElementById("carDrawRoute");

  if (carDrawRouteBtn) {
    carDrawRouteBtn.addEventListener("click", async() => {
      try {
        await carDrawRoute(); 
      } catch (err) {
        console.error("carDrawRoute failed:", err); //コード中で発生したエラーをログに記録する
      }
    });
  }else{
  console.warn("carDrawRouteボタンが存在しません");
  }
}

window.carDrawRoute = carDrawRoute;