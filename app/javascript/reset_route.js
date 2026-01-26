import { renderRelayPoints } from './info_window.js';

let isResetListenerAttached = false;

export function resetRoute() {
  console.trace("resetRoute が呼び出されました"); // トレースログを追加

  // 1. グローバルなルートデータを初期化
  if (window.routeData) {
    window.routeData.start = { point: null, name: null };
    window.routeData.waypoints = [];
    window.routeData.destination = {
      mainPoint: { point: null, name: "目的地" },
      parkingLot: null
    };
    delete window.routeData.total_distance;
    delete window.routeData.total_duration;
  }

  // 2. セッションストレージからルート情報を削除
  sessionStorage.removeItem("directionsResult");
  window.directionsResult = null;

  // 3. 地図上のルート描画をクリア
  // 徒歩ルート用
  if (window.directionsRenderer) {
    window.directionsRenderer.setMap(null);
  }
  // 車ルート用
  if (window.carRouteRenderers) {
    window.carRouteRenderers.forEach(renderer => renderer.setMap(null));
    window.carRouteRenderers = [];
  }

  // 4. 検索結果のマーカー（青いピン）をクリア
  if (window.markers && window.markers.length > 0) {
    window.markers.forEach(marker => marker.setMap(null));
    window.markers = [];
  }
  // 検索結果をクリア
  const resultContainer = document.getElementById("resultContainer");
  if (resultContainer) resultContainer.innerHTML = '';
  // ルート情報をクリア
  const routeContainer = document.getElementById("routeContainer");
  if (routeContainer) routeContainer.innerHTML = '';
  
  // 5. UI表示をリセット
  const startPointEl = document.getElementById('startPoint');
  if (startPointEl) startPointEl.textContent = '現在地';

  const destinationPointEl = document.getElementById("destinationPoint");
  if (destinationPointEl) destinationPointEl.textContent = '目的地';

  // 中継点UIをクリア（再描画）
  renderRelayPoints();

  // 6. 時刻設定をリセット
  const timeElements = [
    "startHour", "startMinute",
    "destinationHour", "destinationMinute"
  ];

  timeElements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      // "時" または "分" を選択状態に戻す
      el.selectedIndex = 0;
    }
  });
}

export function initResetRouteBtn() {
  // イベントリスナーの重複登録を防止
  if (isResetListenerAttached) return;
  isResetListenerAttached = true;

  // イベントデリゲーションを使用
  // documentに対してイベントを設定することで、ボタンがDOM上で置換されても動作し続ける
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#resetRouteBtn");
    if (btn) {
      e.preventDefault(); // ボタンのデフォルト動作を防止
      resetRoute();
    }
  });
}