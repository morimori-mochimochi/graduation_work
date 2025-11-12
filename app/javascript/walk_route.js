import { fetchCurrentPos } from "./current_pos"

export async function walkDrawRoute(start, destination){
  console.log("ルートを作ります");
  await window.mapApiLoaded;
  console.log("await終了");

  // 引数でstartが渡されていない場合のみ、現在地を取得する
  const originPos = start || window.routeStart || await fetchCurrentPos();
  const finalDestination = destination || window.routeDestination;

  // #DirectionsAPIで使うオブジェクトの生成
  // #directionsServiceは出発地、目的地、移動手段等をリクエストとして送信すると、GoogleのDirectionsAPIに問い合わせを行うクラス
  const directionsService = new google.maps.DirectionsService();
  // #取得したルートをマップに表示
  // #DirectionsRendererは検索したルートをマップに描画するクラス
  if (!window.directionsRenderer) {
    window.directionsRenderer = new google.maps.DirectionsRenderer();
  }

  // #どのマップにルートを描画するかを指定
  window.directionsRenderer.setMap(window.map);

  const request = {
    origin: originPos,
    destination: finalDestination,
    travelMode: google.maps.TravelMode.WALKING,
    optimizeWaypoints: true, // ウェイポイントの順序を最適化
  };

  // 中継地点が存在する場合、リクエストに追加
  if (window.relayPoint) {
    request.waypoints = [{
      location: window.relayPoint,
      stopover: true // 立ち寄り地点として設定
    }];
  }

  return new Promise((resolve, reject) => {
    directionsService.route(request,
      (response, status) => {
        if (status !== "OK") {
          console.error("Directionsエラー:", status, response);
        }
        if (status === "OK"){
          window.directionsRenderer.setDirections(response);
          console.log("★ directionsService OK", response);
          // # DirectionsResultはDirectionsServiceから返ってきた検索結果本体。ただのオブジェクトで、ルートの全情報が格納されている
          window.directionsResult = response;

          // ルート情報から所要時間を取得して表示
          const route = response.routes[0];
          if (route && route.legs && route.legs.length > 0) {
            const duration = route.legs[0].duration;
            console.log(`所要時間: ${duration.text} (${duration.value}秒)`);
          }

          sessionStorage.setItem("directionsResult", JSON.stringify(response));
          console.log("★ window.directionsResult set", window.directionsResult);
          resolve(status);
        } else {
          console.error("ルートの取得に失敗しました: " + status);
          reject(status);
        }
      }
    );
  });
};

export function walkRouteBtn() {
  const walkDrawRouteBtn = document.getElementById("walkDrawRoute");
    
  if (walkDrawRouteBtn) {
    walkDrawRouteBtn.addEventListener("click", () => {
      walkDrawRoute(); // 通常のクリック時は引数なしで呼び出す
    });
  }else{
    console.warn("walkDrawRouteボタンが存在しません");
  }
}

// システムテストから呼び出せるように、関数をグローバルスコープに公開する
window.walkDrawRoute = walkDrawRoute;