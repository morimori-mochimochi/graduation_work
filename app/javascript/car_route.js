import { fetchCurrentPos } from "./current_pos"

export async function carDrawRoute(start, destination) { // Promiseを返すasync関数として定義
  await window.mapApiLoaded;

  const originPos = start || window.routeStart || await fetchCurrentPos();
  const finalDestination = destination || window.routeDestination;

  if (!finalDestination) {
    const errorMessage = "目的地を選択してください";
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  const directionsService = new google.maps.DirectionsService();
  if (!window.directionsRenderer) {
    window.directionsRenderer = new google.maps.DirectionsRenderer({
      map: window.map
    });
  } else {
    // 既存のルートをクリア
    window.directionsRenderer.setMap(null);
  }
  window.directionsRenderer.setMap(window.map);

  const waypoints = [];
  // 駐車場が設定されていれば経由地として追加
  if (window.routeParking) {
    waypoints.push ({
      location: window.routeParking,
      stopover: true
    });
  }

  const request = {
    origin: originPos,
    destination: finalDestination,
    travelMode: google.maps.TravelMode.DRIVING,
    waypoints: waypoints,
    optimizeWaypoints: true
  };

  return new Promise ((resolve, reject) => {
    directionsService.route(request, (response, status) => {
      if (status != "OK") {
        console.error("Directions エラー:", status, response);
        alert("ルートの取得に失敗しました: " + status);
        reject(status);
        return;
      }
      window.directionsRenderer.setDirections(response);
      window.directionsResult = response;
      sessionStorage.setItem("directionsResult", JSON.stringify(response));
      resolve("OK");
    });
  });
}
export function carRouteBtn() {
  const carDrawRouteBtn = document.getElementById("carDrawRoute");

  if (carDrawRouteBtn) {
    carDrawRouteBtn.addEventListener("click", async() => {
      try {
        await carDrawRoute();
      } catch (err) {
        console.error("carDrawRoute faild:", err); //コード中で発生したエラーをログに記録する
      }
    });
  }else{
  console.warn("carDrawRouteボタンが存在しません");
  };
}

window.carDrawRoute = carDrawRoute;