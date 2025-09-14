// 地図生成後に「読み込み完了」を通知するためにinitMapをラップ
// Google Maps API callback. ここでマップを生成しmapsreadyを解決
export function initMap(mapDiv) {
  const gmap = new google.maps.Map(mapDiv, {
    center: { lat: 35.6812, lng: 139.7671 },
    zoom: 15,
    mapId: "56e6f7b7602076fe1ca74db5"
  });

  // callbackとして参照されるようにグローバルへ登録
  window.map = gmap;
}

// Google Maps APIがcallback=initMapしたときに参照できるように
window.initMap = initMap;
