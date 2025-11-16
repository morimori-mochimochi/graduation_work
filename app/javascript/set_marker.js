console.log("set_marker module loaded");

export async function initMarkerEvents() {
  console.log("マーカーイベントが発火しました");

  // 新しいデータ構造をグローバルに初期化
  window.routeData = {
    start: { point: null, name: "現在地" },
    waypoints: [], // { mainPoint: { point, name }, parkingLot: { point, name } }
    destination: {
      mainPoint: { point: null, name: "目的地" },
      parkingLot: null
    }
  };
  // 古いグローバル変数の後方互換性のため（徐々に廃止）
  window.relayPoints = []; 
  window.routeStart = null;
  window.routeDestination = null;

  // マップ生成完了まで待機
  await window.mapApiLoaded;
    
  // #生成済みマップを取得
  const map = window.map;
  console.log("生成済みマップを取得しました");

  if (!map) {
    console.warn("地図が読み込まれていません");
    return;
  }

  // #マーカーが無い、という初期状態を作る
  let selectedMarker = null;

  // #マップクリックでマーカー配置
  google.maps.event.addListener(window.map, "click", (event) => {
    // Googleマップの既存POIマーカークリックかどうか判定
    console.log("このマーカーがクリックされました:", selectedMarker);
    
    if (!event.placeId) {
      console.log("マップがクリックされました");
    
    // #既存のマーカーを削除
      if (selectedMarker) {
        selectedMarker.setMap(null);
        if (window.activeInfoWindow) {
          window.activeInfoWindow.close();
        }
      }

    // #新しいマーカーを配置
      selectedMarker = new google.maps.marker.AdvancedMarkerElement({
        position: event.latLng,
        map: map,
        title: "選択地点"
      });

      // 地点情報を取得して情報ウィンドウを開く
      fetchPlaceDetails(event.latLng, (place) => {
        openInfoWindow(selectedMarker, place);
      });
    }
  });
};

// クリックした場所の住所を取得
async function fetchPlaceDetails(latLng, callback) {
  const geocoder = new google.maps.Geocoder();
  const placesService = new google.maps.places.PlacesService(window.map);

  // まず住所を取得
  const geoResults = await geocoder.geocode({ location: latLng });
  const address = (geoResults.results && geoResults.results[0]) ? geoResults.results[0].formatted_address : "住所不明";

  // 次に最も近い施設名を取得
  const placesRequest = { location: latLng, radius: 50, rankby: 'distance' };
  const { results: places } = await placesService.nearbySearch(placesRequest);
  const name = (places && places.length > 0) ? places[0].name : address.split(' ')[0]; // 施設がなければ住所の一部

  callback({ name, address, point: latLng });
}

function openInfoWindow(marker, place) {
  if (window.activeInfoWindow) {
    window.activeInfoWindow.close();
  }
  // infowindowが開かれたらクリックした位置の住所を表示して
  // ポイント設置ボタンを表示
  const template = document.getElementById('info-window-template');
  const content = template.content.cloneNode(true);

  content.querySelector('.info-window-facility-name').textContent = place.name;

  const infoWindow = new google.maps.InfoWindow({ content });
  infoWindow.open(marker.map, marker);
  window.activeInfoWindow = infoWindow;

  google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
    const root = infoWindow.content;
    root.querySelector('.info-window-route-btn').addEventListener('click', () => {
      root.querySelector('.info-window-dropdown-menu').hidden = !root.querySelector('.info-window-dropdown-menu').hidden;
    });

    // 出発地に設定
    root.querySelector('.info-window-set-start').addEventListener('click', () => {
      window.routeData.start = { point: place.point, name: place.name };
      document.getElementById('startPoint').textContent = place.name;
      infoWindow.close();
      marker.setMap(null);
    });

    // 目的地に設定
    root.querySelector('.info-window-set-destination').addEventListener('click', () => {
      window.routeData.destination.mainPoint = { point: place.point, name: place.name };
      document.getElementById('destinationPoint').textContent = place.name;
      infoWindow.close();
      marker.setMap(null);
    });

    // 中継地に設定
    root.querySelector('.info-window-set-relay-point').addEventListener('click', () => {
      const newWaypoint = {
        mainPoint: { point: place.point, name: place.name }, // 本来の中継点
        parkingLot: null // そのための駐車場
      };
      window.routeData.waypoints.push(newWaypoint);
      
      createRelayPointElement(place.name);
      infoWindow.close();
      marker.setMap(null);
    });
  });
}

function createRelayPointElement(name) {
  const template = document.getElementById('relay-point-template');
  const container = document.getElementById('relayPointsContainer');
  const clone = template.content.cloneNode(true);

  // relay-point-itemは中継点の時間指定のこと
  const relayPointItem = clone.querySelector('.relay-point-item');
  clone.querySelector('.relay-point-name').textContent = name;

  // 削除ボタンの処理
  clone.querySelector('.remove-relay-point-btn').addEventListener('click', () => {
    const index = Array.from(container.children).indexOf(relayPointItem);
    if (index > -1) {
      window.routeData.waypoints.splice(index, 1);
      window.relayPoints.splice(index, 1); // 古い配列も更新
      container.removeChild(relayPointItem);
    }
  });

  container.appendChild(clone);
}
