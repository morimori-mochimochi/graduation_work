import { getLatLngFromPosition } from "./current_pos"

export async function walkDrawRoute(){
  console.log("ルートを作ります");
  await window.mapApiLoaded;
  console.log("await終了");

  const currentPos = await new Promise ((resolve) => {
    if (window.currentPos) {
      resolve(window.currentPos);
    } else {
      const check = setInterval(() => {
        if (window.currentPos) {
          clearInterval(check);
          console.log("現在地の取得が完了しました", window.currentPos)
          resolve(window.currentPos);
        }
      }, 200);
    }
  });

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
        // # DirectionsResultはDirectionsServiceから返ってきた検索結果本体。ただのオブジェクトで、ルートの全情報が格納されている
        window.directionsResult = response;
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
      console.log("walkRouteBtnが押されました");
    });
  }else{
    console.warn("walkDrawRouteボタンが存在しません");
  }
}