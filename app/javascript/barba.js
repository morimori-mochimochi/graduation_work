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

// ナビゲーションバーの表示・非表示を制御する関数
function controlNavbarDisplayByContainerSign(container) {
  // ハンバーガーボタンを含む、メニューを表示/非表示にしたい要素のセレクタを取得
  console.log("処理タイミングのせい？");

  const navMenuWrapper = document.getElementById('navbarNav'); 
  const navbarToggler = document.querySelector('.navbar-toggler');

  console.log("navMenuWrapper: ", navMenuWrapper);
  
  if (!navMenuWrapper || !navbarToggler) {
    // そもそもユーザーがサインインしておらず、メニューのHTML自体が存在しない場合は処理を終了
    return;
  }
  
  // 1. 新しいコンテナにサインがあるかチェック
  // HTML側で data-requires-navbar-menu="true" が付与されているかを確認
  const shouldDisplayMenu = container.hasAttribute('data-requires-navbar-menu');
  
  // 2. 表示の切り替え
  console.log("🥸 表示の出し変え");
  if (shouldDisplayMenu) {
    // 表示
    navMenuWrapper.style.display = '';
    navbarToggler.style.display = ''; // ハンバーガーボタンも表示
    console.log("Navbar menu and toggler displayed.");
  } else {
    // 非表示
    navMenuWrapper.style.display = 'none';
    navbarToggler.style.display = 'none'; // ハンバーガーボタンも非表示
    console.log("Navbar menu and toggler hidden.");
  }
}

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
      initMap(mapDiv);
      mapDiv.dataset.mapInitialized = "true";

      if (id === 'map') {
        initMarkerEvents();
        initSearchBox();
        searchParking();
        walkRouteBtn();
        carRouteBtn();
        // clearSearchMarkersOnRouteDraw(); // この関数は定義が見当たらないためコメントアウト
        initCurrentPosBtn();
      } else if (id === 'naviMap' || id === 'carNaviMap') {
        // fetchCurrentPos(); // startNavigation内で呼ばれるなら不要かもしれません
        startNavigation();
      }
    }
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
          await window.mapApiLoaded; // 念のため遷移後もAPI読み込みを待つ
          initializePage(next.container);
          controlNavbarDisplayByContainerSign(next.container);
        }
      }
    ]
  });
});

export  default barba;
