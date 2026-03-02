import { fetchCurrentPos } from "./current_pos"
import { initSetTime } from "./set_arrival_time";
import { initResetRouteBtn } from "./reset_route";

function isValidLatLng(point) {
  return point && typeof point.lat === 'function' && typeof point.lng === 'function';
}
// export: この関数を他のファイルでも使えるように公開する、の意味
// async: この関数は非同期処理を行います、の意味。
// awaitを使って処理を一時待機できる
export async function walkDrawRoute() {
  // 既存の徒歩ルート描画をクリア
  // この関数は drawRouteBtn からのみ呼ばれる想定のため、ここでクリア処理を行う
  if (window.walkRouteRenderer) {
    window.walkRouteRenderer.setMap(null);
    window.walkRouteRenderer = null;
  }

  // 既存の徒歩アイコンマーカーをクリア
  if (window.walkIconMarker) {
    window.walkIconMarker.setMap(null);
    window.walkIconMarker = null;
  }

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

  // この徒歩ルート専用のDirectionsRendererを生成
  const walkRenderer = new google.maps.DirectionsRenderer({
    map: window.map,
  });

  // 新しいデータ構造から徒歩ルートの経由地リストを作成
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

  return new Promise((resolve, reject) => {
    directionsService.route(request,
      (response, status) => {
        try {
          if (status === "OK"){
            walkRenderer.setDirections(response);
            window.walkRouteRenderer = walkRenderer; // リセット処理などのためにグローバルにも保存
            // DirectionsResultはDirectionsServiceから返ってきた検索結果本体。ただのオブジェクトで、ルートの全情報が格納されている
            window.routeData.travel_mode = 'WALKING';

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
            }

            // 呼び出し元で制御するため、ここでは保存せず結果とレンダラーを返す
            resolve({ status: status, response: response, renderer: walkRenderer });
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
      initSetTime();
    }
  });
}

initRouteContent();
initResetRouteBtn();
  
// システムテストから呼び出せるように、関数をグローバルスコープに公開する
window.walkDrawRoute = walkDrawRoute;