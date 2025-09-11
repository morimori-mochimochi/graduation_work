console.log("current_positionの読み込みが完了しました");

async function drawRoute(){
  console.log("drawRoute開始")
  await window.mapApiLoaded;

  const currentPos = await new Promise ((resolve) => {
    if (window.currentPos) {
    console.log("現在地の取得が完了しました", window.currentPos);
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
    console.log("現在地の取得が完了しました");
  });

  // #DirectionsAPIで使うオブジェクトの生成
  // #directionsServiceは出発地、目的地、移動手段等をリクエストとして送信すると、GoogleのDirectionsAPIに問い合わせを行うクラス
  const directionsService = new google.maps.DirectionsService();
  // #取得したルートをマップに表示
  // #DirectionsRendererは検索したルートをマップに描画するクラス
  const directionsRenderer = new google.maps.DirectionsRenderer();
  // #どのマップにルートを描画するかを指定
  directionsRenderer.setMap(window.map);

  console.log("ルート描画の準備ができました");

  directionsService.route(
    {
      origin: currentPos,
      destination: "小倉駅",
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
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

document.addEventListener("DOMContentLoaded", () => {
  const drawRouteBtn = document.getElementById("drawRoute");
  if (drawRouteBtn) {
    drawRouteBtn.addEventListener("click", drawRoute);
  }else{
    console.warn("drawRouteボタンが存在しません");
  }
  console.log("drawRouteBtn: ", drawRouteBtn);
});
