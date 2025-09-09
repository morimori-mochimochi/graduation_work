import Splide from "@splidejs/splide";
import barba from "@barba/core";

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

  // barba.js初期化
  barba.init ({
    transitions: [
      {
        enter({ next }) {
        },
      },
    ],
  });
});

