import { fetchCurrentPos } from "./current_pos"

function isValidLatLng(point) {
  return point && typeof point.lat === 'function' && typeof point.lng === 'function';
}

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
    window.directionsRenderer = new google.maps.DirectionsRenderer({
      map: window.map
    });
  } else {
    // #既存のルートをクリア
    window.directionsRenderer.setMap(null);
  }
  // #どのマップにルートを描画するかを指定
  window.directionsRenderer.setMap(window.map);

  // waypoints配列を作り、そこに中継点を入れていく
  const waypoints = [];
  // 中継地点が存在する場合、リクエストに追加
  // Array.isArray(): () の中に入っているものが配列かtrue/falseで教えてくれる
  if (Array.isArray(window.relayPoints)) {
    window.relayPoints.forEach(point => {
      // point =>: 配列から取り出した一つ一つの経由地データにpointと名付けて後の処理で使えるように
      if (isValidLatLng(point)) {
        waypoints.push({
          location: point,
          stopover: true // 立ち寄り地点として設定
        });
      }
    });
  }

  const request = {
    origin: originPos,
    destination: finalDestination,
    travelMode: google.maps.TravelMode.WALKING,
    waypoints: waypoints,
    optimizeWaypoints: true // ウェイポイントの順序を最適化
  };

  console.log("requestの中身:", request);

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

          // ルート描画完了のカスタムイベントを発行
          // イベントにデータを含めたいときはdetailに入れるのがルール
          const event = new CustomEvent('routeDrawn', { detail: { status: status, response: response } });
          // 1行目で作ったカスタムイベントを実際に発信する
          document.dispatchEvent(event);
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
      walkDrawRoute(); // eventオブジェクトを渡さないように修正
    });
  }else{
    console.warn("walkDrawRouteボタンが存在しません");
  }
}

// システムテストから呼び出せるように、関数をグローバルスコープに公開する
window.walkDrawRoute = walkDrawRoute;