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

  console.log("addListener前のmapの型:", window.map.constructor.name);
  console.log("addListenerの有無: ", typeof window.map.addListener);

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
                const placeId = places[0].place_id;

                //place_idから詳細情報を取得
                placesService.getDetails(
                  {
                    placeId: placeId,
                    fields: ["name", "formatted_address", "types"], //必要な情報だけ取得
                  },
                  (place, dStatus) => {
                    if (dStatus === "OK" && place) {
                      content = `<div><strong>${place.name}</strong><br>${place.formatted_address}</div>`;
                    }
                    infoWindow.setContent(content);
                    infoWindow.open(map, selectedMarker);
                  }
                );
              } else {
                // 周辺に施設が見つからなかったとき
                infoWindow.setContent(content);
                infoWindow.open(map, selectedMarker);
              }
            }
          );
        }
      });
    }
  });
};
