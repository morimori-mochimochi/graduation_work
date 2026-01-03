await window.mapApiLoaded;

export function initMap(mapDiv) {
  const gmap = new google.maps.Map(mapDiv, {
    center: fetchCurrentPos(),
    zoom: 15,
    mapId: "56e6f7b7602076fe1ca74db5"
  });

  // callbackとして参照されるようにグローバルへ登録
  window.map = gmap;
}

