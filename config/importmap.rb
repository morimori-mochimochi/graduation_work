# Pin npm packages by running ./bin/importmap

pin "application"
pin "@barba/core", to: "https://cdn.jsdelivr.net/npm/@barba/core@2.9.7/dist/barba.mjs"
pin "barba", to: "barba.js"
pin "@splidejs/splide", to: "https://ga.jspm.io/npm:@splidejs/splide@4.1.4/dist/js/splide.min.js"

pin "maps_ready", to: "maps_ready.js"
pin "map", to: "map.js"
pin "set_marker", to: "set_marker.js"
pin "search_box", to: "search_box.js"
pin "geocode_address", to: "geocode_address.js"
pin "search_parking", to: "search_parking.js"
pin "current_position", to: "current_position.js"
pin "car_route", to: "car_route.js"
pin "walk_route", to: "walk_route.js"
pin "navigation", to: "navigation.js"
pin "current_pos", to: "current_pos.js"