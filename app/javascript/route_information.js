export function initRouteInformation() {
  
  console.log("ルート情報を表示します");

  // 現在描画されているルート上に透明な線を重ねてクリックイベントを検知可能にする
  // そのために現在のルート情報を入れておくための配列を作る
  let paths = [];

  // 車ルート
  if (window.carRouteRenderers && window.carRouteRenderers.length > 0) {
    window.carRouteRenderers.forEach(renderer => {
      const directions = renderer.getDirections();
      if (directions && directions.routes && directions.routes.length > 0) {
        // overview_path: ルート全体の大まかなパス
        paths.push(directions.routes[0].overview_path)
      }
    });
  }

  if (window.walkRouteRenderer) {
    const directions = window.walkRouteRenderer.getDiretions();
    if (directions && directions.routes && directions.routes.length > 0) {
      paths.push(directions.routes[0].overview_path);
    }
  }

  // ルートがなければ何もしない
  if (paths.length === 0) return;

  // Infowindowのインスタンスを作成（１つを使い回す）
  const infoWindow = new google.maps.InfoWindow();

  // 透明なポリラインを作成してクリックイベントを設定
  paths.forEach(path => {
    const hitLine = new google.maps.Polyline({
      path: path,
      strokeColor: 'transparent', // 透明
      strokeOpacity: 0,
      strokeWeight: 20, // 太くすることでクリックしやすくする
      map: window.map,
      zIndex: 100 // 最前面
    });

    // クリックイベント
    hitLine.addListener('click', (event) => {
      // クリックされた位置にInfowindowを表示
      const content = createInfoWindowContent();
      infoWindow.setContent(content);
      infoWindow.setPosition(event, latLng);
      infoWindow.open(window.map);
    });
    // 配列に保存
    window.routeHitLines.push(hitLine);
  });
}

function createInfoWindowContent() {
  // テンプレを取得
  const template = document.getElementById('route-info-template')
  // テンプレの中身を確認
  const clone = template.content.cloneNode(true);

  // データを取得
  const distance = window.routeData.total_distance || 0;
  const duration = window.routeData.total_duration || 0;

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
  if (gasConsumptionEl) {
    // ガソリン消費量を計算（リッターあたり15kmの時）
    const gasConsumption = (distanceKm / 15).toFixed(2);
    gasConsumptionEl.textContent = `${gasConsumption} L`;
  }

  const calorieEl = clone.querySelector('.calorie-burned');
  if (calorieEl) {
    calorieEl.textContent = `${(distanceKm * 0.5 * 50).toFixed(0)} kcal`;
  }
  return clone;
}