console.log("set_marker module loaded");

import { openInfoWindow, renderRelayPoints, createRelayPointElement } from './info_window';

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
  const geocoder = new google.maps.Geocoder();
  const placesService = new google.maps.places.PlacesService(map); 

  // #マップクリックでマーカー配置
  google.maps.event.addListener(window.map, "click", (event) => {
    // Googleマップの既存POIマーカークリックかどうか判定
    console.log("このマーカーがクリックされました:", selectedMarker);
    
    if (!event.placeId) {
      console.log("マーカーが置かれました");
    
    // #既存のマーカーを削除
      if (selectedMarker) {
        selectedMarker.setMap(null);
        if (window.activeInfoWindow) {
          window.activeWindow.close();
        }
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
          const facilityAddress = results[0].formatted_address;

          // 近隣の施設名を検索
          placesService.nearbySearch(
            {
              location: event.latLng,
              radius: 30, //半径30m以内
            },
            (places, pStatus) => {
              let facilityName = "選択地名";
              if (pStatus === "OK" && places.length > 0) {
                facilityName = places[0].name;
              }
              openInfoWindow(selectedMarker, facilityName, facilityAddress);
            }
          )
        }
      });
    }
  });
};
