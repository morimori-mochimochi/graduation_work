import barba from "@barba/core";
import Splide from "@splidejs/splide";
import { initMap } from "map";
import { initMarkerEvents } from "set_marker";
import { highlightMarker} from "search_box";
import { initSearchBox } from "search_box";
import { searchParking } from "search_parking";
import { getCurrentPosition } from "current_position";
import { walkDrawRoute } from "walk_route";
import { carDrawRoute } from "car_route";
import { naviBtn } from "navigation";
import { walkRouteBtn } from "walk_route";
import { carRouteBtn } from "car_route";

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
          return new Promise(resolve => {
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
            if (mapDiv && !mapDiv.dataset.mapInitialized) {
              initMap(mapDiv);
              mapDiv.dataset.mapInitialized = "true";
              initMarkerEvents();
              initSearchBox();
              searchParking();
              getCurrentPosition();
              walkRouteBtn();
              carRouteBtn();
              naviBtn();
              console.log("highlightMarkerの型:", highlightMarker);
            }
          });
        }
      }
    ]
  });
});