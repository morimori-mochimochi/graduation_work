console.log("application.jsを読み込みます");

import Splide from "@splidejs/splide"
import "./barba"
import "./maps_ready"
import "./map"
import "./set_marker"
import "./search_box"
import "./search_parking"
import "./current_position"
import "./car_route"
import "./walk_route"
import "./navigation"
import "./current_pos"
import "./geocode_address"

console.log("DOMContentLoaded読み込み直前");

await window.mapApiLoaded;

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  
  // splide初期化
  const el = document.querySelector('#splide');
  if (el) {
    new Splide(el, {
      type: 'loop',
      autoplay: true,
      interval: 3000,
      pauseOnHover: true,
      arrows: true,
      pagination: true
    }).mount();
  }

  const mapDiv = document.getElementById("map");
  console.log("mapDiv取得:", mapDiv);

  if (mapDiv && !mapDiv.dataset.mapInitialized) {
    console.log("initMap呼び出し直前に到達");
    initMap(mapDiv);
    mapDiv.dataset.mapInitialized = "true";
    initMarkerEvents();
    initSearchBox();
    highlightMarker();
    getCurrentPosition();
    walkRouteBtn();
    clearSearchMarkersOnRouteDraw() 
    initCurrentPosBtn()
  } else {
    console.warn("mapDivが存在しないか、既に初期化済みです");
  }
});

