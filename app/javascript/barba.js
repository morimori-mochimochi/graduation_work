import * as barbaModule from "@barba/core";

const barba = barbaModule.default;

console.log(barba);

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
          // ページにmapが含まれる時initMapを呼ぶ
          const mapDiv = next.container.querySelector('#map');
          if (mapDiv && window.initMap) {
            console.log("Barba遷移後にinitMapを呼び出します");
            window.initMap(mapDiv);
          }
        }
      }
    ]
  });
});