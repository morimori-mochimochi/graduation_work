console.log("infoWindowが呼ばれました");

export function openInfoWindow(marker, place) {
  // <template>からInfoWindowのコンテンツを作成
  // cloneNode(false) → 要素自体だけコピー（中身の子要素はコピーしない）
  // cloneNode(true) → 要素 とその子要素すべて を再帰的にコピー
  const template = document.getElementById('info-window-template');
  const content = template.content.cloneNode(true);

  //動的な値を埋め込む
  content.querySelector('.info-window-facility-name').textContent = place.name;

  // 既存のInfoWindowを閉じる
  if (window.activeInfoWindow) {
    window.activeInfoWindow.close();
  }

  const infoWindow = new google.maps.InfoWindow({
    content: content
  });

  infoWindow.open(marker.map, marker);
  window.activeInfoWindow = infoWindow;

  //ボタンクリックベントを設定
  google.maps.event.addListenerOnce(infoWindow, "domready", function() {
    const start_btn = document.querySelector(".info-window-set-start");
    const destination_btn = document.querySelector(".info-window-set-destination");
    const relay_point_btn = document.querySelector(".info-window-set-relay-point");
    const route_btn = document.querySelector(".info-window-route-btn");
    const dropdown_menu = document.querySelector(".info-window-dropdown-menu");
    const save_btn = document.querySelector(".info-window-save-location");

    console.log("中継点クリックイベント: ", relay_point_btn);

    if (start_btn) {
      start_btn.addEventListener("click", function() {
        window.routeData.start = { point: place.point, name: place.name };
        document.getElementById('startPoint').textContent = place.name;
        infoWindow.close();
        marker.setMap(null); // マーカーを地図から削除
      });
    }

    // 目的地が設定されているときのみ中継点ボタンを表示
    if (window.routeData.destination.mainPoint.point) {
      console.log("relayPointボタンを表示します");
      if (relay_point_btn) {
        relay_point_btn.parentElement.style.display = 'list-item'; // ボタンを表示
        relay_point_btn.addEventListener("click", () => {
          const newWaypoint = {
            mainPoint: { point: place.point, name: place.name },
            parkingLot: null
          };
          window.routeData.waypoints.push(newWaypoint);

          // UIを再描画
          renderRelayPoints();
          infoWindow.close();
          marker.setMap(null); // マーカーを地図から削除
        });
      } 
    } else {
      if (relay_point_btn) {
        relay_point_btn.parentElement.style.display = 'none';
      }
    }

    if (destination_btn) {
      destination_btn.addEventListener("click", function() {
        window.routeData.destination.mainPoint = { point: place.point, name: place.name };
        document.getElementById('destinationPoint').textContent = place.name;
        infoWindow.close();
        marker.setMap(null); // マーカーを地図から削除
      });
    }

    if (route_btn) {
      route_btn.addEventListener("click", (e) => {
        e.stopPropagation(); // イベントの伝播を停止
        dropdown_menu.hidden = !dropdown_menu.hidden;
      });
    }

    if (save_btn) {
      save_btn.addEventListener("click", function() {
        const position = marker.getPosition ? marker.getPosition() : marker.position;
        const params = new URLSearchParams({
          'location[address]': place.address,
          'location[lat]': position.lat(),
          'location[lng]': position.lng()
        });
  
        // new_location_path にクエリパラメータを付けて遷移
        window.location.href = `/locations/new?${params.toString()}`;
      });
    }
  });
}

// 中継点リストのUIを再描画する関数
export function renderRelayPoints() {
  const container = document.getElementById("relayPointsContainer");
  if (!container) return;

  // コンテナをクリア
  console.log("コンテナをリセットします");
  container.innerHTML = '';
  // routeDataから中継点を描画
  window.routeData.waypoints.forEach((waypoint, index) => {
    const relayPointElement = createRelayPointElement(waypoint, index);
    container.appendChild(relayPointElement);
  });
  console.log("renderRelayPoints終了です");
}

// 中継点要素をひな形から生成するヘルパー関数
export function createRelayPointElement(waypoint, index) {
  const template = document.getElementById('relay-point-template');
  const clone = template.content.cloneNode(true);
  const itemDiv = clone.querySelector('.relay-point-item');

  // 動的な値を設定
  itemDiv.dataset.index = index;
  // templateをクローンして作った中継点UIから.relay-point-nameを探す
  clone.querySelector('.relay-point-name').textContent = waypoint.mainPoint.name;

  // ヘルパー関数でselect要素をセットアップ
  const setupSelect = (selector, id, placeholder) => {
    const selectEl = clone.querySelector(selector);
    selectEl.id = id;
    selectEl.innerHTML = JSON.parse(selectEl.dataset.options);
    selectEl.insertAdjacentHTML('afterbegin', `<option disabled selected>${placeholder}</option>`);
  };

  setupSelect('.relay-hour-select', `relayHour_${index}`, '時');
  setupSelect('.relay-minute-select', `relayMinute_${index}`, '分');

  // 削除ボタンのイベントリスナーを設定
  console.log("削除ボタンを登録します");
  const removeBtn = clone.querySelector('.remove-relay-point-btn');
  removeBtn.dataset.index = index;

  console.log("中継点削除ボタンのイベントリスナー登録を行います");

  removeBtn.addEventListener('click', (e) => {
    const indexToRemove = parseInt(e.currentTarget.dataset.index, 10);
    // waypoints配列から該当する中継点を削除
    window.routeData.waypoints.splice(indexToRemove, 1);
    // UIを再描画
    renderRelayPoints();
    console.log(`中継点 ${indexToRemove} を削除しました`);
  });

  return itemDiv;
}
// 他のファイルから呼び出して使う部品のような関数にaddEventListenerは不安定
// なのでinitにして末尾に入れる
export function initInfoWindow() {
  console.log("initInfoWindowが呼ばれました。イベントリスナーを登録します。");
  // ルートが描画されたら、中継点UIも再描画する
  // これにより、ページ読み込み後やルート再検索時にもUIが正しく表示される
  document.addEventListener('routeDrawn', () => {
    console.log("info_window.jsがrouteDrawnイベントを検知しました。中継点を再描画します。");
    if (Array.isArray(window.routeData.waypoints) && window.routeData.waypoints.length > 0) {
      renderRelayPoints();
    }
  });
}