// InfoWindowのインスタンスを作成（１つを使い回す）
let infoWindow;

export function showRouteInfoWindow(latLng) {
  console.log("ルート情報を表示します");

  if (!infoWindow) {
    infoWindow = new google.maps.InfoWindow();
  }

  // クリックされた位置にInfowindowを表示
  const content = createInfoWindowContent();
  infoWindow.setContent(content);
  infoWindow.setPosition(latLng);
  infoWindow.open(window.map);
}

function createInfoWindowContent() {
  // テンプレを取得
  const template = document.getElementById('route-info-template')
  // テンプレの中身を確認
  const clone = template.content.cloneNode(true);

  // データを取得
  const distance = window.routeData.total_distance || 0;
  const duration = window.routeData.total_duration || 0;

  console.log("distance:", distance);
  console.log("duration:", duration);

  // 距離と時間のフォーマット計算
  const distanceKm = (distance / 1000).toFixed(1);

  console.log("distanceKm:", distanceKm);

  const minutes = Math.floor(duration % 3600);
  let timeString = "";
  timeString += `${minutes}分`;

  console.log("timeString:", timeString);

  // モード判定: walk_route.jsではWALKINGをセット
  // そうでない時はDRIVINGと判定
  const isWalking = window.routeData.travel_mode === 'WALKING';

  // 要素を取得
  const modeEl = clone.querySelector('.info-window-mode');
  if (isWalking) {
    modeEl.textContent = "徒歩ルート"
  } else {
    modeEl.textContent = "車ルート"
  }

  const distanceEl = clone.querySelector('.route-total-distance');
  if (distanceEl) distanceEl.textContent = `${distanceKm} km`;

  const durationEl = clone.querySelector('.route-total-duration');
  if (durationEl) durationEl.textContent = timeString;

  const gasEl = clone.querySelector('.gas-consumption');
  if (gasEl) {
    // ガソリン消費量を計算（リッターあたり15kmの時）
    const gasConsumption = (distanceKm / 15).toFixed(2);
    gasEl.textContent = `${gasConsumption} L`;
  }

  const calorieEl = clone.querySelector('.calorie-burned');
  if (calorieEl) {
    calorieEl.textContent = `${(distanceKm * 0.5 * 50).toFixed(0)} kcal`;
  }
  return clone;
}