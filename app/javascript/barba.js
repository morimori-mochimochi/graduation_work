import barba from "@barba/core";
import Splide from "@splidejs/splide";
import { initMap } from "./map";
import "./maps_ready";
import "./geocode_address"
import { initMarkerEvents } from "./set_marker";
import { initSearchBox} from "./search_box";
import { searchParking } from "./search_parking";
import { initCurrentPosBtn } from "./current_pos";
import { startNavigation } from "./navigation";
import { walkRouteBtn } from "./walk_route";
import { carRouteBtn } from "./car_route";
import { initSetTime } from "./set_arrival_time";
import { initInfoWindow } from "./info_window";
import { initResetRouteBtn } from "./reset_route";
import { initSaveRoute } from "./save_route";
import { initMoveNavi } from "./move_navi";
import { initDrawSavedRoute } from "./draw_saved_route";
import { initCalendar } from "./calendar_initializer.js"; // 新しいファイルからインポート

// ページ初期化のための共通関数
function initializePage(container) {
  console.log("initializePage called for container:", container);

  // Splideの初期化
  const el = container.querySelector('#splide');
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
  
  // マップ関連の初期化
  const mapIds = ['map', 'naviMap', 'carNaviMap'];
  mapIds.forEach(id => {
    const mapDiv = container.querySelector(`#${id}`);
    if (mapDiv && !mapDiv.dataset.mapInitialized) {
      mapDiv.dataset.mapInitialized = "true";
      initMap(mapDiv);

      if (id === 'map') {
        initMarkerEvents();
        searchParking();
        walkRouteBtn();
        carRouteBtn();
        initCurrentPosBtn();
      } else if (id === 'naviMap' || id === 'carNaviMap') {
        startNavigation();
      }
    }
    // マップの初期化状態に関わらず、毎回実行したい処理
    if (mapDiv && id === 'map') {
      initSearchBox(container);
      initSetTime();
      initInfoWindow();
      initResetRouteBtn();
      initSaveRoute(container);
      initCalendar(container); // コメントアウトを解除
    }

    // 保存済みルート詳細ページ用の初期化
    initMoveNavi(container);

    // 保存済みルートの描画
    initDrawSavedRoute(container);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("barbaが呼ばれました");

  barba.init({
    transitions: [
      {
        name: 'slide-left',
        async once({ next }) {
          await window.mapApiLoaded; // Google Maps APIの読み込みを待つ
          initializePage(next.container);
          console.log("barbaの途中経過1");
        },
        leave({ current }) {
          console.log("directionsResultが消えないか確認: ", window.directionsResult);
          return new Promise(resolve => {
            document.body.style.backgroundColor = '#FDF8F4';
            current.container.style.transform = 'translateX(0)';
            current.container.style.transition = 'transform 1s ease, opacity 1s ease';
            requestAnimationFrame(() => {
              current.container.style.transform = 'translateX(-100%)';
              current.container.style.opacity = '0';
            });
            setTimeout(resolve, 1000);
            console.log("ページ切り替えました");
          });
        },
        enter({ next }) {
          document.body.style.backgroundColor = '#FFEFE2';
          next.container.style.transform = 'translateX(100%)';
          next.container.style.transition = 'transform 1s ease, opacity 1s ease';
          console.log("barbaの途中経過4");
          next.container.style.opacity = '1';
          requestAnimationFrame(() => {
            next.container.style.transform = 'translateX(0)';
            console.log("barbaが完了しました");
          });
        },
        async afterEnter({ next }) {
          await window.mapApiLoaded; // APIの読み込みを待つ
          initializePage(next.container);
          console.log("afterEnter hook: ページ初期化完了");
        },
      }
    ]
  });
});

export  default barba;
