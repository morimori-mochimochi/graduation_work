export async function carDrawRoute(){
  await window.mapApiLoaded;

  const currentPos = await new Promise ((resolve) => {
    if (window.currentPos) {
      resolve(window.currentPos);
    } else {
      const check = setInterval(() => {
        if (window.currentPos) {
          clearInterval(check);
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
  
  if (window.routeParking) {
    //1,駐車場がある場合　出発地→駐車場（車)
    directionsService.route(
      {
        origin: window.routeStart || currentPos,
        destination: window.routeParking,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === "OK"){
          const renderer1 = new google.maps.DirectionsRenderer({
            map: window.map,
            polylineOptions: { strokeColor: "blue" } //車ルートは青
          });
          renderer1.setDirections(response);
        } else {
          alert("出発地→駐車場のルート取得に失敗しました: " + status);
        }
      }
    );

    //2,駐車場→目的地(徒歩)
    directionsService.route(
      {
        origin: routeParking,
        destination: window.routeDestination,
        travelMode: google.maps.TravelMode.WALKING
      },
      (response, status) => {
        if (status === "OK") {
          const renderer2 = new google.maps.DirectionsRenderer({
            map: window.map,
            polylineOptions: { strokeColor: "green" } //徒歩ルートは緑
          });
          renderer2.setDirections(response);
        }else{
          alert("駐車場→目的地のルート取得に失敗しました: " + status);
        }
      }
    );
  }else{
    //駐車場がない場合
    directionsService.route(
      {
        origin: window.routeStart || currentPos,
        destination: window.routeDestination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
          window.directionsResult = response;
        } else {
          alert("ルートの取得に失敗しました: " + status);
        }
      }
    );
  }
};

export function carRouteBtn() {
  const carDrawRouteBtn = document.getElementById("carDrawRoute");

  if (carDrawRouteBtn) {
    carDrawRouteBtn.addEventListener("click", carDrawRoute);
  }else{
  console.warn("carDrawRouteボタンが存在しません");
  }
  console.log("carDrawRouteBtn: ", carDrawRouteBtn);
}