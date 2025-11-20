console.log("set_marker module loaded");
import { openInfoWindow } from './info_window.js';

export async function initMarkerEvents() {
  console.log("マーカーイベントが発火しました");

  // 新しいデータ構造をグローバルに初期化
  window.routeData = {
    start: { point: null, name: null },
    waypoints: [], // { mainPoint: { point, name }, parkingLot: { point, name } }
    destination: {
      mainPoint: { point: null, name: "目的地" },
      parkingLot: null
    }
  };

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

  // #マップクリックでマーカー配置
  google.maps.event.addListener(window.map, "click", (event) => {
    // Googleマップの既存POIマーカークリックかどうか判定
    console.log("このマーカーがクリックされました:", selectedMarker);
    
    if (!event.placeId) {
      console.log("マップがクリックされました");
    
    // #既存のマーカーを削除
      if (selectedMarker) {
        selectedMarker.setMap(null);
        if (window.activeInfoWindow) {
          window.activeInfoWindow.close();
        }
      }

    // #新しいマーカーを配置
      selectedMarker = new google.maps.marker.AdvancedMarkerElement({
        position: event.latLng,
        map: map,
        title: "選択地点"
      });

      // 地点情報を取得して情報ウィンドウを開く
      fetchPlaceDetails(event.latLng, (place) => {
        openInfoWindow(selectedMarker, place);
      });
    }
  });
};

// クリックした場所の住所を取得
async function fetchPlaceDetails(latLng, callback) {
  const geocoder = new google.maps.Geocoder();
  // まず住所を取得
  const geoResults = await geocoder.geocode({ location: latLng });
  const address = (geoResults.results && geoResults.results[0]) ? geoResults.results[0].formatted_address : "住所不明";
  // 施設名ではなく住所を常に表示するため、nameにもaddressを渡す
  callback({ name: address, address, point: latLng });
}
