import barba from "@barba/core";
import Splide from "@splidejs/splide";
import { initMap } from "./map";
import { initMarkerEvents } from "./set_marker";
import { initSearchBox} from "./search_box";
import { searchParking } from "./search_parking";
import { initCurrentPosBtn } from "./current_pos";
import { startNavigation, restoreDirections } from "./navigation";
import { walkRouteBtn } from "./walk_route";
import { carRouteBtn } from "./car_route";

document.addEventListener('DOMContentLoaded', () => {
  console.log("barbaが呼ばれました");

  barba.init({
    transitions: [
      {
        name: 'slide-left',
        once({ next }) {
          next.container.style.opacity = 1;
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
        afterEnter({ next }) {
          console.log("afterEnter前: directionsResult", window.directionsResult);
          console.log("afterEnterが呼ばれました", next.container);

          const el = next.container.querySelector('#splide');
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
          console.log("afterEnter Splideが呼ばれました");

          const mapIds = ['map', 'naviMap', 'carNaviMap'];
          mapIds.forEach(id => {
            const mapDiv = next.container.querySelector(`#${id}`);

            console.log("mapDivチェック:", id, mapDiv);
            console.log("dataset.mapInitialized:", mapDiv?.dataset.mapInitialized);
            console.log("directionsResult 復元:", window.directionsResult); 
            
            if (mapDiv && !mapDiv.dataset.mapInitialized) {
              initMap(mapDiv);
              mapDiv.dataset.mapInitialized = "true";

              if (id === 'map') {
                initMarkerEvents();
                initSearchBox();
                searchParking();
                walkRouteBtn();
                carRouteBtn();
                clearSearchMarkersOnRouteDraw(); 
                initCurrentPosBtn();
              }

              if (id === 'naviMap') {
                fetchCurrentPos();
                startNavigation();
              }

              if (id === 'carNaviMap') {
                fetchCurrentPos();
                startNavigation();
              }
            }
            console.log("afterEnterが終わりました");
          });
          //directionsResultをsessionStorageから復元
          restoreDirections();
          console.log("⚡️afterEnter内directionsResult 復元:", window.directionsResult)

          debugger;
        }
      }
    ]
  });
});