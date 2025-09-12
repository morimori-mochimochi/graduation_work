console.log("set_marker module loaded");

export async function initMarkerEvents() {
  console.log("マーカーイベントが発火しました");

  // マップ生成完了まで待機
  await window.mapApiLoaded;
    
  // #生成済みマップを取得
  const map = window.map;
  console.log("生成済みマップを取得しました");

  if (!map) {
    console.warn("地図が読み込まれていません");
    return;
  }

  // #マーカーが無い、という初期状態を作る
  let selectedMarker = null;
  const infoWindow = new google.maps.InfoWindow();
  const geocoder = new google.maps.Geocoder();
  const placesService = new google.maps.places.PlacesService(map); 

  // #マップクリックでマーカー配置
  google.maps.event.addListener(window.map, "click", (event) => {
    // Googleマップの既存POIマーカークリックかどうか判定
    if (!event.placeId) {
      console.log("マーカーが置かれました");
    
    // #既存のマーカーを削除
      if (selectedMarker) {
        selectedMarker.setMap(null);
        infoWindow.close();
      }

    // #新しいマーカーを配置
      selectedMarker = new google.maps.marker.AdvancedMarkerElement({
        position: event.latLng,
        map: map,
        title: "選択地点"
      });
    
    // #検索用に座標を保存
      window.searchCenter = event.latLng;

    // 逆ジオコーディングで住所取得
      geocoder.geocode({ location: event.latLng}, (results, status) => {
        if (status === "OK" && results[0]) {
          let content = `<div><strong>住所: </strong> ${results[0].formatted_address}</div>`;

          // 近隣の施設名を検索
          placesService.nearbySearch(
            {
              location: event.latLng,
              radius: 30, //半径30m以内
            },
            (places, pStatus) => {
              if (pStatus === "OK" && places.length > 0) {
                const place = places[0];
                let content = `
                  <div>
                    <strong>${place.name}</strong><br>
                    ${results[0].formatted_address}<br>
                    <button id="setStart">ここを出発地に設定</button>
                    <button id="setDestination">ここを目的地に設定</button> 
                  </div>
                `;
              
                infoWindow.setContent(content);
                infoWindow.open(map, selectedMarker);

                // InfoWindowがDOMに描画された後にイベントを登録
                google.maps.event.addListenerOnce(infoWindow, "domready", () => {
                  document.getElementById("setStart").addEventListener("click", () => {
                    console.log("出発地に設定: ", event.latLng.toString());
                    window.routeStart = event.latLng; //グローバルに保存

                    const startBtn = document.getElementById("startpoint");
                    if (startBtn) {
                      startBtn.textContent = place.name || results[0].formatted_address;
                    }
                  });
                  
                  document.getElementById("setDestination").addEventListener("click", () => {
                    console.log("到着地に設定: ", event.latLng.toString());
                    window.routeDestination = event.latLng; //グローバルに保存

                    const destinationBtn = document.getElementById("destinationPoint");
                    if (destinationBtn) {
                      destinationBtn.textContent = place.name || results[0].formatted_address;
                    }
                  });
                });
              }else{
                infoWindow.setContent(content);
                infoWindow.open(map, selectedMarker);
              }
            }
          )
        }
      });
    }
  });
};
