import { fetchCurrentPos } from "./current_pos"


export async function carDrawRoute(){
  await window.mapApiLoaded;

  console.log("routeDestination:", window.routeDestination);
  console.log("routeParking:", window.routeParking);

  const currentPos = await fetchCurrentPos();

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
  
  if (
    window.routeParking && 
    typeof window.routeParking.lat === "function" &&
    typeof window.routeParking.lng === "function" &&
    window.routeDestination
  ) { 
    // promiseベースでルート検索を行うヘルパー関数
    const routePromise = (request) => {
      return new Promise((resolve, reject) => {
        directionsService.route(request, (response, status) => {
          if (status === "OK") {
            resolve(response);
          } else {
            reject(status);
          }
        });
      }); 
    };

    //非同期処理で二つのルートを順番に取得・統合する
    (async () => {
      try {
        // 1.出発点から駐車場(車)
        const response1 = await routePromise({
          origin: window.routeStart || currentPos,
          destination: window.routeParking,
          travelMode: google.maps.TravelMode.DRIVING
        });
        
        const renderer1 = new google.maps.DirectionsRenderer({
          map: window.map,
          polylineOptions: { strokeColor: "green" } 
        }); 
        renderer1.setDirections(response1);

         //2,駐車場→目的地(徒歩)
        console.log("徒歩ルートを検索します");
        const response2 = await routePromise ({
          origin: window.routeParking,
          destination: window.routeDestination,
          travelMode: google.maps.TravelMode.WALKING
        });

        const renderer2 = new google.maps.DirectionsRenderer({
          map: window.map,
          polylineOptions: { strokeColor: "blue" } //徒歩ルートは青
        });
        renderer2.setDirections(response2);

        // 3,2つのルート結果を一つに結合する
        const combinedResponse = response1;
        const carLeg = response1.routes[0].legs[0];
        const walkLeg = response2.routes[0].legs[0];

        //2番目の経路（徒歩）を最初のルートに追加
        combinedResponse.routes[0].legs.push(walkLeg);

        //距離と時間を合算
        carLeg.distance.value += walkLeg.distance.value;
        carLeg.duration.value += walkLeg.duration.value;

        //結合したルートを保存
        window.directionsResult = combinedResponse;
        sessionStorage.setItem("directionsResult", JSON.stringify(combinedResponse));

        console.log("結合されたルート:", combinedResponse);

      } catch (error) {
        alert("ルートの取得に失敗しました:" + error);
      }
    })();
  } else if (window.routeDestination){
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
          sessionStorage.setItem("directionsResult", JSON.stringify(response));
        } else {
          alert("ルートの取得に失敗しました: " + status);
        }
      }
    );
  }else{
    alert("目的地を設定してください");
  }
};

export function carRouteBtn() {
  const carDrawRouteBtn = document.getElementById("carDrawRoute");

  if (carDrawRouteBtn) {
    carDrawRouteBtn.addEventListener("click",  () => {
      carDrawRoute();
      console.log("sessionStorage:", sessionStorage)
    });
  }else{
  console.warn("carDrawRouteボタンが存在しません");
  };
}