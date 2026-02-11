import { fetchCurrentPos } from "./current_pos"
import { initSetTime } from "./set_arrival_time";
import { initRouteInformation } from "./route_information";
import { initResetRouteBtn } from "./reset_route";

function isValidLatLng(point) {
  return point && typeof point.lat === 'function' && typeof point.lng === 'function';
}
// export: この関数を他のファイルでも使えるように公開する、の意味
// async: この関数は非同期処理を行います、の意味。
// awaitを使って処理を一時待機できる
export async function walkDrawRoute() {
  // 新しいルートを作成する前に、既存のルート情報をsessionStorageから削除
  sessionStorage.removeItem("directionsResult");

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

  // #DirectionsAPIで使うオブジェクトの生成
  // #directionsServiceは出発地、目的地、移動手段等をリクエストとして送信すると、GoogleのDirectionsAPIに問い合わせを行うクラス
  const directionsService = new google.maps.DirectionsService();

  // #取得したルートをマップに表示
  // #DirectionsRendererは検索したルートをマップに描画するクラス
  if (!window.directionsRenderer) {
    window.directionsRenderer = new google.maps.DirectionsRenderer({
      map: window.map,
      polylineOptions: {
        strokeColor: 'red',
      }
    });
  } else {
    // #既存のルートをクリア
    window.directionsRenderer.setMap(null);
  }
  // #どのマップにルートを描画するかを指定
  window.directionsRenderer.setMap(window.map);

  // 新しいデータ構造から徒歩ルートの経由地リストを作成
  const waypoints = [];
  window.routeData.waypoints.forEach(wp => {
    // 徒歩ルートなので、駐車場の有無に関わらず本来の地点(mainPoint)を経由地とする
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

  return new Promise((resolve, reject) => {
    directionsService.route(request,
      (response, status) => {
        try {
          if (status === "OK"){
            window.directionsRenderer.setDirections(response);
            // DirectionsResultはDirectionsServiceから返ってきた検索結果本体。ただのオブジェクトで、ルートの全情報が格納されている
            window.routeData.travel_mode = 'WALKING';
            window.directionsResult = response;

            // ルート情報から総距離と総所要時間を計算して表示
            const route = response.routes[0];
            if (!route) {
              console.error("ルートが見つかりませんでした:", response);
              throw new Error("ルートが見つかりませんでした。");
            }
            if (route && route.legs && route.legs.length > 0) {
              let totalDistance = 0;
              let totalDuration = 0;

              route.legs.forEach(leg => {
                totalDistance += leg.distance.value; // 距離をメートルで加算
                totalDuration += leg.duration.value; // 所要時間を秒で加算
              });

              // 計算結果をグローバルなルート情報に保存
              window.routeData.total_distance = totalDistance;
              window.routeData.total_duration = totalDuration;
            }

            // 呼び出し元で制御するため、ここでは保存せず結果とレンダラーを返す
            resolve({ status: status, response: response, renderer: window.directionsRenderer });
          } else {
            console.error("Directions API error:", status, response);
            reject(status);
          }
        } catch (error) {
          alert("ルートの検索に失敗しました: " + error.message);
          console.error("ルート描画処理中にエラーが発生しました:", error);
          reject(error);
        }
      }
    );
  });
};

function initRouteContent() {
  document.addEventListener('routeDrawn', (event) => {
    if (event.detail.status === 'OK') {
      initRouteInformation();
      initSetTime();
    }
  });
}

initRouteContent();
initResetRouteBtn();
  
// システムテストから呼び出せるように、関数をグローバルスコープに公開する
window.walkDrawRoute = walkDrawRoute;