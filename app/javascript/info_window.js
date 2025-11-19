console.log("infoWindowが呼ばれました");

export function openInfoWindow(marker, facilityName, facilityAddress) {
  // <template>からInfoWindowのコンテンツを作成
  // cloneNode(false) → 要素自体だけコピー（中身の子要素はコピーしない）
  // cloneNode(true) → 要素 とその子要素すべて を再帰的にコピー
  const template = document.getElementById('info-window-template');
  const content = template.content.cloneNode(true);

  //動的な値を埋め込む
  content.querySelector('.info-window-facility-name').textContent = facilityName;

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
        window.routeStart = marker.getPosition ? marker.getPosition() : marker.position;
  
        const uiStart = document.getElementById("startPoint"); 
        if (uiStart) {
          uiStart.textContent = facilityName || "選択した場所";
        }
        infoWindow.close();
      });
    }

    // 出発/到着地の設定があるときのみ
    if (window.routeDestination) {
      console.log("relayPointボタンを表示します");
      if (relay_point_btn) {
        relay_point_btn.parentElement.style.display = 'list-item'; // ボタンを表示
        relay_point_btn.addEventListener("click", () => {
          // window.relayPointsが配列でなければ初期化
          if (!Array.isArray(window.relayPoints)) {
            window.relayPoints = [];
          }
          // 新しい中継点（位置情報と名前）を配列に追加
          window.relayPoints.push({
            position: marker.getPosition ? marker.getPosition() : marker.position,
            name: facilityName || "選択した場所"
          });

          // UIを再描画
          renderRelayPoints();
          infoWindow.close();
        });
      } 
    } else {
      if (relay_point_btn) {
        relay_point_btn.parentElement.style.display = 'none';
      }
    }

    if (destination_btn) {
      destination_btn.addEventListener("click", function() {
        window.routeDestination = marker.getPosition ? marker.getPosition() : marker.position;
  
        const uiDest = document.getElementById("destinationPoint");
        if (uiDest) {
          uiDest.textContent = facilityName || "選択した場所";
        }
        infoWindow.close();
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
        // URLのクエリパラメータを作成
        const params = new URLSearchParams({
          'location[address]': facilityAddress,
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
  container.innerHTML = '';
  // 保持しているすべての中継点を描画
  window.relayPoints.forEach((relayPoint, index) => {
    const relayPointElement = createRelayPointElement(relayPoint, index);
    container.appendChild(relayPointElement);
  });
  console.log("renderRelayPoints終了です");
}

// 中継点要素をひな形から生成するヘルパー関数
export function createRelayPointElement(relayPoint, index) {
  const template = document.getElementById('relay-point-template');
  const clone = template.content.cloneNode(true);
  const itemDiv = clone.querySelector('.relay-point-item');

  // 動的な値を設定
  itemDiv.dataset.index = index;
  clone.querySelector('.relay-point-name').textContent = relayPoint.name;

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
  const removeBtn = clone.querySelector('.remove-relay-point-btn');
  removeBtn.dataset.index = index;

  removeBtn.addEventListener('click', (e) => {
    const indexToRemove = parseInt(e.currentTarget.dataset.index, 10);
    // 配列から該当する中継点を削除
    window.relayPoints.splice(indexToRemove, 1);
    // UIを再描画
    renderRelayPoints();
  });

  return itemDiv;
}

// ルートが描画されたら、中継点UIも再描画する
// これにより、ページ読み込み後やルート再検索時にもUIが正しく表示される
document.addEventListener('routeDrawn', () => {
  if (Array.isArray(window.relayPoints) && window.relayPoints.length > 0) {
    renderRelayPoints();
  }
});