import { renderRelayPoints } from './info_window.js';

export function resetRoute() {
  console.log("ルート情報をリセットします");

  // グローバルなルートデータを初期化
  if (window.routeData) {
    window.routeData.start = { point: null, name: null};
    window.routeData.waypoints = [];
    window.routeData.destination = {
      mainPoint: { point: null, name: "目的地"},
      parkingLot: null
    };
  }

  // セッションストレージからルート情報を削除
  sessionStorage.removeItem("directionsResult");
  window.directinsResult = null;

  // 地図上のルートをクリア
  // 徒歩用
  if (window.directionsRender) {
    window.directionsRendere.serMap(null);
  }

  // 車用
  if (window.directionsRenderer) {
    window.directionsRenderers.forEach(renderer => renderer.setMap(null));
    window.carRouteRenderers = [];
  }

  // UI表示をリセット
  const startPointEl = document.getElementById("startPoint");
  const destinationPointEl = document.getElementById("destinationPoint");

  if(startPointEl) startPointEl.textContent = '出発地';
  if (destinationPointEl) destinationPointEl.textContent = '目的地';

  // 中継点UIをクリア（再描画)
  renderRelayPoints();

  // 時刻設定をセット
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
  const btn = document.getElementById("resetRouteBtn");
  if (btn) {
    btn.addEventListener("click", resetRoute);
  }
}