import { renderRelayPoints } from './info_window.js';

export function resetRoute() {
  console.trace("resetRoute が呼び出されました"); // トレースログを追加
  console.log("ルート情報をリセットします。");

  // 1. グローバルなルートデータを初期化
  if (window.routeData) {
    window.routeData.start = { point: null, name: null };
    window.routeData.waypoints = [];
    window.routeData.destination = {
      mainPoint: { point: null, name: "目的地" },
      parkingLot: null
    };
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
    const resultContainer = document.getElementById("resultContainer");
    if (resultContainer) resultContainer.innerHTML = '';
  }

  // 5. UI表示をリセット
  const startPointEl = document.getElementById('startPoint');
  if (startPointEl) startPointEl.textContent = '出発地';

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
  console.log("ルートリセットを開始します");
  const btn = document.getElementById("resetRouteBtn");

  if (btn) {
    console.log("リセットボタンが見つかりました:", btn);

    // イベントの重複登録を防ぐためのチェック
    if (btn.dataset.resetEventAttached) {
      console.log("リセットボタンのイベントは既に登録済みです。");
      return;
    }
    btn.dataset.resetEventAttached = 'true';

    btn.addEventListener("click", () => {
      console.log("リセットボタンがクリックされました。");
      resetRoute();
    });
    console.log("リセットボタンにクリックイベントを登録しました。");
  } else {
    console.warn("リセットボタン(#resetRouteBtn)が見つかりませんでした。");
  }
}