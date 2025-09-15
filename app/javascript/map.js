await window.mapApiLoaded;

export function initMap(mapDiv) {
  console.log("initMap呼び出し直前", !!window.google?.maps, mapDiv);

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
