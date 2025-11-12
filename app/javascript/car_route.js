import { fetchCurrentPos } from "./current_pos"

export async function carDrawRoute(start, destination) { // Promiseを返すasync関数として定義
  await window.mapApiLoaded;

  console.log("routeDestination:", window.routeDestination);
  console.log("routeParking:", window.routeParking);

  const originPos = start || window.routeStart || await fetchCurrentPos();

  // 既存のルート描画をクリア
  if (window.drivingRouteRenderer) window.drivingRouteRenderer.setMap(null);
  if (window.walkingRouteRenderer) window.walkingRouteRenderer.setMap(null);
  if (window.directionsRenderer) window.directionsRenderer.setMap(null);


  const directionsService = new google.maps.DirectionsService();
  if (!window.directionsRenderer) {
    window.directionsRenderer = new google.maps.DirectionsRenderer();
  }
  window.directionsRenderer.setMap(window.map);

  const routePromise = (request) => {
    return new Promise((resolve, reject) => {
      directionsService.route(request, (response, status) => {
        if (status === "OK") {
          resolve(response);
        } else {
          reject(`Directions request failed due to ${status}`);
        }
      });
    });
  };

  // 駐車場経由ルート
  const finalDestination = destination || window.routeDestination;

  if (
    window.routeParking &&
    typeof window.routeParking.lat === "function" &&
    typeof window.routeParking.lng === "function" &&
    finalDestination
  ) {
    try {
      const drivingRequest = {
        origin: originPos,
        destination: window.routeParking,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      };

      // 中継地点が存在する場合、リクエストに追加
      if (window.relayPoint) {
        drivingRequest.waypoints = [{ location: window.relayPoint, stopover: true }];
      }

      // 1.出発点から駐車場(車)
      const response1 = await routePromise(drivingRequest);

      window.drivingRouteRenderer = new google.maps.DirectionsRenderer({
        map: window.map,
        polylineOptions: { strokeColor: "green" }
      });
      window.drivingRouteRenderer.setDirections(response1);

      // 2.駐車場→目的地(徒歩)
      console.log("徒歩ルートを検索します");
      const response2 = await routePromise({
        origin: window.routeParking,
        destination: finalDestination,
        travelMode: google.maps.TravelMode.WALKING
      });
      window.walkingRouteRenderer = new google.maps.DirectionsRenderer({
        map: window.map,
        polylineOptions: { strokeColor: "blue" } //徒歩ルートは青
      });
      window.walkingRouteRenderer.setDirections(response2);

      // 3. 2つのルート結果を一つに結合する
      const combinedResponse = response1;
      const carLeg = response1.routes[0].legs[0];
      const walkLeg = response2.routes[0].legs[0];
      combinedResponse.routes[0].legs.push(walkLeg); // 2番目の経路（徒歩）を最初のルートに追加
      carLeg.distance.value += walkLeg.distance.value; // 距離と時間を合算
      carLeg.duration.value += walkLeg.duration.value;

      // ナビゲーション用に結合したルートを保存
      window.directionsResult = combinedResponse;
      sessionStorage.setItem("directionsResult", JSON.stringify(combinedResponse));
      console.log("結合されたルート:", combinedResponse);

      // 駐車場までのルートをナビゲーションのメインルートとして保存
      // sessionStorage.setItem("directionsResult", JSON.stringify(response1));
      return "OK"; // 成功したことを示す
    } catch (error) {
      alert("ルートの取得に失敗しました:" + error);
      throw error; // エラーを再スローして呼び出し元でcatchできるようにする
    }
  // 駐車場がない場合（通常の車ルート）
  } else if (finalDestination) {
    try {
      const request = {
        origin: originPos,
        destination: finalDestination,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      };

      // 中継地点が存在する場合、リクエストに追加
      if (window.relayPoint) {
        request.waypoints = [{ location: window.relayPoint, stopover: true }];
      }

      const response = await routePromise(request);
      if (!window.directionsRenderer) {
        window.directionsRenderer = new google.maps.DirectionsRenderer();
      }
      window.directionsRenderer.setDirections(response);
      window.directionsResult = response;
      sessionStorage.setItem("directionsResult", JSON.stringify(response));
      return "OK";
    } catch (error) {
      alert("ルートの取得に失敗しました: " + error);
      throw error; //catch(error) { throw error; } は→「下の階で鳴った警報をそのまま上に伝える」（伝達）
    }
  } else {
    const errorMessage ="目的地を設定してください"
    alert(errorMessage);
    throw new Error(errorMessage); //throw new Error(...) は→「自分で警報を鳴らす」（新しい警報）
  }
};

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