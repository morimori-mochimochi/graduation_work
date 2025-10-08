import { fetchCurrentPos } from "./current_pos"

export async function carDrawRoute(start, destination) { // Promiseを返すasync関数として定義
  await window.mapApiLoaded;

  console.log("routeDestination:", window.routeDestination);
  console.log("routeParking:", window.routeParking);

  const currentPos = start ? null : await fetchCurrentPos(); // startがなければ現在地を取得

  const directionsService = new google.maps.DirectionsService();
  if (!window.directionsRenderer) {
    window.directionsRenderer = new google.maps.DirectionsRenderer();
  }
  window.directionsRenderer.setMap(window.map);

  // promiseベースでルート検索を行うヘルパー関数
  const routePromise = (request) => {
    return new Promise((resolve, reject) => {
      directionsService.route(request, (response, status) => {
        if (status === "OK") {
          resolve(response);
        } else {
          reject(status);
        }
      });
    });
  };

  // 駐車場経由ルート
  if (
    window.routeParking &&
    typeof window.routeParking.lat === "function" &&
    typeof window.routeParking.lng === "function" &&
    (destination || window.routeDestination)
  ) {
    try {
      // 1.出発点から駐車場(車)
      const response1 = await routePromise({
        origin: start || window.routeStart || currentPos,
        destination: window.routeParking,
        travelMode: google.maps.TravelMode.DRIVING
      });
      const renderer1 = new google.maps.DirectionsRenderer({
        map: window.map,
        polylineOptions: { strokeColor: "green" }
      });
      renderer1.setDirections(response1);

      // 2.駐車場→目的地(徒歩)
      console.log("徒歩ルートを検索します");
      const response2 = await routePromise({
        origin: window.routeParking,
        destination: destination || window.routeDestination,
        travelMode: google.maps.TravelMode.WALKING
      });
      const renderer2 = new google.maps.DirectionsRenderer({
        map: window.map,
        polylineOptions: { strokeColor: "blue" } //徒歩ルートは青
      });
      renderer2.setDirections(response2);

      // 3. 2つのルート結果を一つに結合する
      const combinedResponse = response1;
      const carLeg = response1.routes[0].legs[0];
      const walkLeg = response2.routes[0].legs[0];
      combinedResponse.routes[0].legs.push(walkLeg); // 2番目の経路（徒歩）を最初のルートに追加
      carLeg.distance.value += walkLeg.distance.value; // 距離と時間を合算
      carLeg.duration.value += walkLeg.duration.value;

      // 結合したルートを保存
      window.directionsResult = combinedResponse;
      sessionStorage.setItem("directionsResult", JSON.stringify(combinedResponse));
      console.log("結合されたルート:", combinedResponse);
      return "OK"; // 成功したことを示す
    } catch (error) {
      alert("ルートの取得に失敗しました:" + error);
      throw error; // エラーを再スローして呼び出し元でcatchできるようにする
    }
  // 駐車場がない場合（通常の車ルート）
  } else if (destination || window.routeDestination) {
    try {
      const response = await routePromise({
        origin: start || window.routeStart || currentPos,
        destination: destination || window.routeDestination,
        travelMode: google.maps.TravelMode.DRIVING
      });
      window.directionsRenderer.setDirections(response);
      window.directionsResult = response;
      sessionStorage.setItem("directionsResult", JSON.stringify(response));
      return "OK";
    } catch (status) {
      alert("ルートの取得に失敗しました: " + status);
      throw status;
    }
  } else {
    alert("目的地を設定してください");
    throw "No destination"; // エラーをスロー
  }
};

export function carRouteBtn() {
  const carDrawRouteBtn = document.getElementById("carDrawRoute");

  if (carDrawRouteBtn) {
    carDrawRouteBtn.addEventListener("click", () => {
      carDrawRoute().catch(err => console.error("carDrawRoute failed:", err));
      console.log("sessionStorage:", sessionStorage)
    });
  }else{
  console.warn("carDrawRouteボタンが存在しません");
  };
}