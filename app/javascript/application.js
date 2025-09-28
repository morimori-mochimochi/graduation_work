debugger;

console.log("🚩 application.js 実行開始", window.directionsResult);
console.log("🚩 [DEBUG] application.js 実行タイミング", performance.now());

import Splide from "@splidejs/splide";
import "./barba";
import "./maps_ready";
import "./map";
import { initMarkerEvents } from "./set_marker";
import { initSearchBox, clearSearchMarkersOnRouteDraw } from "./search_box";
import { searchParking } from "./search_parking";
import { carRouteBtn } from "./car_route";
import { walkRouteBtn } from "./walk_route";
import { startNavigation } from "./navigation";
import { initCurrentPosBtn, fetchCurrentPos } from "./current_pos";
import "./geocode_address"

console.log("DOMContentLoaded読み込み直前");

await window.mapApiLoaded;

console.log("await終了");

// 初期化
function init() {
  console.log("readyState at addEventListener:", document.readyState); 
  
  // splide初期化
  console.log("splideチェック開始");
  const el = document.querySelector('#splide');
  console.log("el取得:", el);
  console.log("Splide型:", typeof Splide);

  if (el && typeof Splide !== 'undefined') {
    try{
      new Splide(el, {
        type: 'loop',
        autoplay: true,
        interval: 3000,
        pauseOnHover: true,
        arrows: true,
        pagination: true
      }).mount();
    } catch (e) {
      console.log("Splide initialization skipped: ", e);
    }
  }

  console.log("splide終了");

  // map初期化
  const initMapIds = ['map', 'naviMap', 'carNaviMap'];

  initMapIds.forEach(id => {
    const mapDiv = document.getElementById(id);
    if (mapDiv && !mapDiv.dataset.mapInitialized) {
      console.log(`initMap呼び出し: #${id}`);
      initMap(mapDiv);
      mapDiv.dataset.mapInitialized = "true";

      // IDごとの追加処理
      if (id === 'map') {
        initMarkerEvents();
        initSearchBox();
        searchParking();
        walkRouteBtn();
        carRouteBtn();
        clearSearchMarkersOnRouteDraw() 
        initCurrentPosBtn()
      } else if (id === 'naviMap'){
        fetchCurrentPos();
        startNavigation();
      } else if (id === 'carNaviMap') {
        fetchCurrentPos();
        startNavigation();
      } else {
        console.warn("mapDivが存在しないか、既に初期化済みです");
      }
    }
  })
  // 現在地取得ボタン
  console.log("現在地ボタン初期化チェック");
  if (document.getElementById("currentPosBtn") || document.getElementById("currentPosBtnCar")) {
    initCurrentPosBtn(["currentPosBtn", "currentPosBtnCar"]);
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}





