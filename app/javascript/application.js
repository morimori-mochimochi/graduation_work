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
});

