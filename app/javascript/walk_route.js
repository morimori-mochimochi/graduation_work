export async function walkDrawRoute(){
  await window.mapApiLoaded;

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

  console.log("route呼び出し直前:", window.routeStart, routeDestination);
  directionsService.route(
    {
      origin: window.routeStart || currentPos,
      destination: routeDestination,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
    },
    (response, status) => {
      console.log("routeコールバック呼ばれた", status);
      if (status === "OK"){
        directionsRenderer.setDirections(response);
        // # DirectionsResultはDirectionsServiceから返ってきた検索結果本体。ただのオブジェクトで、ルートの全情報が格納されている
        console.log("directionsResult設定前:", response);
        window.directionsResult = response;
        console.log("window.directionsResult:", window.directionsResult);
      } else {
        alert("ルートの取得に失敗しました: " + status);
      }
    }
  )
};

export function walkRouteBtn() {
  const walkDrawRouteBtn = document.getElementById("walkDrawRoute");
  console.log("walkDrawRouteBtn(直接取得):", walkDrawRouteBtn);
    
  if (walkDrawRouteBtn) {
    walkDrawRouteBtn.addEventListener("click", walkDrawRoute);
    console.log("walkDrawRouteボタンにイベント登録完了");
  }else{
    console.warn("walkDrawRouteボタンが存在しません");
  }
}