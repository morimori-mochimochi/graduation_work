import { fetchCurrentPos } from "./current_pos"

export async function walkDrawRoute(){
  console.log("ルートを作ります");
  await window.mapApiLoaded;
  console.log("await終了");

  const currentPos = await fetchCurrentPos();

  // #DirectionsAPIで使うオブジェクトの生成
  // #directionsServiceは出発地、目的地、移動手段等をリクエストとして送信すると、GoogleのDirectionsAPIに問い合わせを行うクラス
  const directionsService = new google.maps.DirectionsService();
  // #取得したルートをマップに表示
  // #DirectionsRendererは検索したルートをマップに描画するクラス
  const directionsRenderer = new google.maps.DirectionsRenderer();
  // #どのマップにルートを描画するかを指定

  directionsRenderer.setMap(window.map);

  directionsService.route(
    {
      origin: window.routeStart || currentPos,
      destination: window.routeDestination,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
    },
    (response, status) => {
      if (status === "OK"){
        directionsRenderer.setDirections(response);
        console.log("★ directionsService OK", response);
        // # DirectionsResultはDirectionsServiceから返ってきた検索結果本体。ただのオブジェクトで、ルートの全情報が格納されている
        window.directionsResult = response;
        sessionStorage.setItem("directionsResult", JSON.stringify(response));
        console.log("★ window.directionsResult set", window.directionsResult);
      } else {
        alert("ルートの取得に失敗しました: " + status);
      }
    }
  )
};

export function walkRouteBtn() {
  const walkDrawRouteBtn = document.getElementById("walkDrawRoute");
    
  if (walkDrawRouteBtn) {
    walkDrawRouteBtn.addEventListener("click", () => {
      walkDrawRoute();
    });
  }else{
    console.warn("walkDrawRouteボタンが存在しません");
  }
}