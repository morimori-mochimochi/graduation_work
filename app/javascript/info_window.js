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
  container.innerHTML = '';
  // routeDataから中継点を描画
  window.routeData.waypoints.forEach((waypoint, index) => {
    const relayPointElement = createRelayPointElement(waypoint, index);
    container.appendChild(relayPointElement);
  });

  // UI描画完了を通知するカスタムイベントを発行
  const event = new CustomEvent('relayPointsRendered');
  document.dispatchEvent(event);
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

  // 到着時刻表示用のspanにIDを割り当て、スタイルを適用
  const arrivalTimeEl = clone.querySelector('.relay-arrival-time');
  arrivalTimeEl.id = `relayArrivalTime_${index}`;
  // Tailwind CSSのクラスを追加して見た目を調整
  arrivalTimeEl.classList.add('bg-gray-200', 'text-gray-500', 'px-2', 'py-1', 'rounded', 'text-sm');
  arrivalTimeEl.textContent = '--:--'; // 初期値

  // 出発時刻表示用のspanを動的に生成し、IDを割り当て
  const departureTimeEl = document.createElement('span');
  departureTimeEl.id = `relayDepartureTime_${index}`;
  departureTimeEl.classList.add('text-gray-500', 'text-sm', 'ml-1'); // スタイル調整
  // 到着時刻要素の直後に出発時刻要素を挿入
  arrivalTimeEl.parentNode.insertBefore(departureTimeEl, arrivalTimeEl.nextSibling);

  // 滞在時間設定用のプルダウンにIDを割り当て
  const stayHourEl = clone.querySelector('.stay-hour-select');
  if (stayHourEl) {
    stayHourEl.id = `stayHour_${index}`;
    // data-options 属性から値を取り出して select 要素の中身を生成する処理
    stayHourEl.innerHTML = `<option value="">時</option>${JSON.parse(stayHourEl.dataset.options)}`;
    // 保存された値があれば復元
    stayHourEl.value = waypoint.stayDuration?.hour || '';
  }
  const stayMinuteEl = clone.querySelector('.stay-minute-select');
  if (stayMinuteEl) {
    stayMinuteEl.id = `stayMinute_${index}`;
    stayMinuteEl.innerHTML = `<option value="">分</option>${JSON.parse(stayMinuteEl.dataset.options)}`;
    stayMinuteEl.value = waypoint.stayDuration?.minute || '';
  }

  // 削除ボタンのイベントリスナーを設定
  const removeBtn = clone.querySelector('.remove-relay-point-btn');
  removeBtn.dataset.index = index;

  removeBtn.addEventListener('click', (e) => {
    const indexToRemove = parseInt(e.currentTarget.dataset.index, 10);
    // waypoints配列から該当する中継点を削除
    window.routeData.waypoints.splice(indexToRemove, 1);
    // UIを再描画
    renderRelayPoints();
  });

  return itemDiv;
}
// 他のファイルから呼び出して使う部品のような関数にaddEventListenerは不安定
// なのでinitにして末尾に入れる
export function initInfoWindow() {
  // ルートが描画されたら、中継点UIも再描画する
  // これにより、ページ読み込み後やルート再検索時にもUIが正しく表示される
  document.addEventListener('routeDrawn', () => {
    // 滞在時間プルダウンの変更を監視し、`window.routeData`に保存する
    const relayPointsContainer = document.getElementById('relayPointsContainer');
    // if (e.target.classList.contains(...)):イベントを発生させた要素が、
    // 滞在時間の時、または分のプルダウンかをチェック
    if (relayPointsContainer) {
      relayPointsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('stay-hour-select') || e.target.classList.contains('stay-minute-select')) {
          const item = e.target.closest('.relay-point-item');
          const index = parseInt(item.dataset.index, 10);
          // ルート情報を保持しているwindow.routeData.waypoints配列から対応する中継点のデータオブジェクトを取得
          const waypoint = window.routeData.waypoints[index];
          // 一度も滞在時間が設定されていない場合stayDurationプロパティが存在しないため空オブジェクト{}を作成して初期化
          if (!waypoint.stayDuration) waypoint.stayDuration = {};
          waypoint.stayDuration.hour = item.querySelector('.stay-hour-select').value;
          waypoint.stayDuration.minute = item.querySelector('.stay-minute-select').value;
        }
      });
    }
    // ルートが描画されたら、中継点UIを再描画する。
    // これにより、時刻計算の起点となる relayPointsRendered イベントが発行される。
    renderRelayPoints();
  });
}