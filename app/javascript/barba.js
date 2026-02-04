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
import { initInfoWindow } from "./info_window";
import { initResetRouteBtn } from "./reset_route";
import { initSaveRoute } from "./save_route";
import { initMoveNavi } from "./move_navi";
import { initDrawSavedRoute } from "./draw_saved_route";
import { initCalendar } from "./calendar_initializer.js"; // 新しいファイルからインポート


// ページ初期化のための共通関数
function initializePage(container) {
  // Splideの初期化
  const el = container.querySelector('#splide');
  if (el && !el.classList.contains('is-initialized')) {
    new Splide(el, {
      type: 'loop',
      lazyLoad: 'nearby', // 表示されるスライドの近くの画像だけを読み込む
      autoplay: true,
      interval: 3000,
      pauseOnHover: true,
      arrows: true,
      pagination: true,
      height: '380px', // 高さを指定しないとlazyLoadがうまく動かないことがある
    }).mount();
  }
  
  // カレンダーの初期化
  initCalendar(container);

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
      initInfoWindow();
      initResetRouteBtn();
      initSaveRoute(container);
    }

    // 保存済みルート詳細ページ用の初期化
    initMoveNavi(container);

    // 保存済みルートの描画
    initDrawSavedRoute(container);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  barba.init({
    transitions: [
      {
        name: 'slide-left',
        sync: true,
        async once({ next }) {
          await window.mapApiLoaded; // Google Maps APIの読み込みを待つ
          initializePage(next.container);
        },
        leave({ current }) {
          return new Promise(resolve => {
            // 遷移中は絶対配置にして重なり合うようにする
            current.container.style.position = 'absolute';
            current.container.style.top = '0';
            current.container.style.left = '0';
            current.container.style.width = '100%';

            document.body.style.backgroundColor = '#FDF8F4';
            current.container.style.transform = 'translateX(0)';
            current.container.style.transition = 'transform 1s ease, opacity 1s ease';
            requestAnimationFrame(() => {
              current.container.style.transform = 'translateX(-100%)';
              current.container.style.opacity = '0';
            });
            setTimeout(resolve, 1000);
          });
        },
        enter({ next }) {
          return new Promise(resolve => {
            // 遷移中は絶対配置にして重なり合うようにする
            next.container.style.position = 'absolute';
            next.container.style.top = '0';
            next.container.style.left = '0';
            next.container.style.width = '100%';

            document.body.style.backgroundColor = '#FFEFE2';
            next.container.style.transform = 'translateX(100%)';
            next.container.style.transition = 'transform 1s ease, opacity 1s ease';
            next.container.style.opacity = '1';
            requestAnimationFrame(() => {
              next.container.style.transform = 'translateX(0)';
            });
            setTimeout(resolve, 1000);
          });
        },
        async afterEnter({ next }) {
          // 遷移完了後にスタイルをリセット
          next.container.style.position = '';
          next.container.style.top = '';
          next.container.style.left = '';
          next.container.style.width = '';

          await window.mapApiLoaded; // APIの読み込みを待つ
          initializePage(next.container);
        },
      }
    ]
  });
});

// Turbo Drive での遷移時（ログアウト時など）にも初期化を実行
document.addEventListener('turbo:load', () => {
  initializePage(document.body);
});

export  default barba;
