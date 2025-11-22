console.log("set_arrival_time.jsを読み込みました");

export function initSetTime() {
  const startHourEl = document.getElementById("startHour");
  const startMinuteEl = document.getElementById("startMinute");
  const destinationHourEl = document.getElementById("destinationHour");
  const destinationMinuteEl = document.getElementById("destinationMinute");

  // 中継点UIの描画完了を待ってから時刻計算を実行する
  document.addEventListener('relayPointsRendered', (e) => {
    console.log('relayPointsRenderedイベントを検知したので時刻を計算します。', e.detail);
    calculateTimes({}, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl); // ルート描画完了時に時刻を計算
  });

  // ルートが描画された直後も時刻計算を実行する
  document.addEventListener('routeDrawn', (e) => {
    calculateTimes({}, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl);
  });

  // 時刻が手動で変更された場合も再計算を実行
  if (startHourEl && startMinuteEl && destinationHourEl && destinationMinuteEl) {
    const calculateWithElements = (options) => calculateTimes(options, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl);
    startHourEl.addEventListener('change', () => calculateWithElements({ changed: 'start' }));
    startMinuteEl.addEventListener('change', () => calculateWithElements({ changed: 'start' }));
    destinationHourEl.addEventListener('change', () => calculateWithElements({ changed: 'destination' }));
    destinationMinuteEl.addEventListener('change', () => calculateWithElements({ changed: 'destination' }));

    document.getElementById('relayPointContainer').addEventListener('change', (e) => {
      if (e.target.classList.contains('stay-hour-select') || e.target.classList.contains('stay-minute-select')) {
        // 出発時刻が設定されていれば順算、そうでなければ逆算を実行
        const startIsSet = startHourEl.value !== "時" && startMinuteEl.value !== "分";
        const changeType = startIsSet ? 'start': 'destination';
        calculateWithElements({ changed: changeType });
      }
    });
  }
}

function calculateTimes(options = {}, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl) {
  const isStartSet = startHourEl && startMinuteEl && startHourEl.value !== "時" && startMinuteEl.value !== "分";
  const isDestinationSet = destinationHourEl.value !== "時" && destinationMinuteEl.value !== "分";

  // ルート情報がなければ何もしない
  const storedDirections = sessionStorage.getItem("directionsResult");
  if (!storedDirections) {
    console.log("ルート情報がないため、時刻計算をスキップします。");
    return;
  }
  const directionsResult = JSON.parse(storedDirections);
  const route = directionsResult.routes[0];

  // ユーザーがどちらの時刻も設定していない場合、または出発時刻を変更した場合
  // → 出発時刻を基準に順算する
  if ((!isStartSet && !isDestinationSet) || options.changed === 'start') {
    console.log("出発時刻を基準に、到着時刻を計算します。");
    calculateAndSetArrivalTime(route, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl);
  } 
  // 到着時刻が設定されている場合（または変更された場合）
  // → 到着時刻を基準に逆算する
  else if (isDestinationSet) {
    console.log("到着時刻を基準に、出発時刻を逆算します。");
    calculateAndSetDepartureTime(route, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl);
  }
}

// 中継点の滞在時間を秒単位で取得するヘルパー関数
function getStayDuration(index) {
  const stayHourEl = document.getElementById(`relayHour_${index}`);
  const stayMinuteEl = document.getElementById(`relayMinute_${index}`);
  let stayDuration = 0;

  if (stayHourEl && stayHourEl.value !== "時") {
    stayDuration += parseInt(stayHourEl.value, 10) * 3600; // 時間を秒に変換
  }
  if (stayMinuteEl && stayMinuteEl.value !== "分") {
    stayDuration += parseInt(stayMinuteEl.value, 10) * 60; // 分を秒に変換
  }
  return stayDuration;
}

//【順算】出発時刻から到着時刻を計算
function calculateAndSetArrivalTime(route, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl) {
  let startHour, startMinute;

  if (startHourEl.value === "時" || startMinuteEl.value === "分") {
    const now = new Date();
    startHour = now.getHours();
    startMinute = now.getMinutes();

    // 出発時刻表示
    startHourEl.value = String(startHour).padStart(2, '0');
    startMinuteEl.value = String(startMinute).padStart(2, '0');
  } else {
    startHour = parseInt(startHourEl.value, 10);
    startMinute = parseInt(startMinuteEl.value, 10);

    console.log("出発時刻：",  startHourEl.value);
    console.log("出発時刻：",  startMinuteEl.value);
  }

  const departureTime = new Date();
  departureTime.setHours(startHour, startMinute, 0, 0);

  let cumulativeDuration = 0;
  route.legs.forEach((leg, index) => {
    cumulativeDuration += leg.duration.value; // 秒単位の所要時間を累積
    const arrivalTime = new Date(departureTime.getTime() + cumulativeDuration * 1000);

    if (index === route.legs.length - 1) { // 最終目的地
      console.log(`最終目的地の計算します➕`);

      // 到着時刻の表示
      destinationHourEl.value = String(arrivalTime.getHours()).padStart(2, '0');
      destinationMinuteEl.value = String(arrivalTime.getMinutes()).padStart(2, '0');

      console.log("到着時刻：", destinationHourEl.value);
      console.log("到着時刻：", destinationMinuteEl.value);

    } else { // 中継点
      console.log(`中継点[${index}]の計算します🧮`);

      // 中継点の動的要素の定義
      const hourId = `relayHour_${index}`;
      const minuteId = `relayMinute_${index}`;
      console.log(`検索するID: ${hourId}, ${minuteId}`);

      const relayHourEl = document.getElementById(hourId);
      const relayMinuteEl = document.getElementById(minuteId);

      console.log("relayHourEl", relayHourEl);
      console.log("relayMinuteEl", relayMinuteEl);
      
      if (relayHourEl && relayMinuteEl) {

        // 中継点到着時刻の表示
        relayHourEl.value = String(arrivalTime.getHours()).padStart(2, '0');
        relayMinuteEl.value = String(arrivalTime.getMinutes()).padStart(2, '0');
        console.log("中継点計算：", relayHourEl.value);
        console.log("中継点計算：", relayMinuteEl.value);
      }

      // 次の区間の計算のために、この中継点での滞在時間を加算する
      // legは次の区間を指すため、現在の到着地点（中継点）のインデックスは index となる
      console.log(`中継点 ${index} の滞在時間を加算します`);
      cumulativeDuration += getStayDuration(index);
    }
  });
}

//【逆算】到着時刻から出発時刻を計算
function calculateAndSetDepartureTime(route, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl) {
  // ルート情報がなければ何もしない
  const storedDirections = sessionStorage.getItem("directionsResult");
  if (!storedDirections) {
    console.error("ルート情報が見つかりません");
    return;
  }

  const destinationHour = parseInt(destinationHourEl.value, 10);
  const destinationMinute = parseInt(destinationMinuteEl.value, 10);

  const arrivalTime = new Date();
  arrivalTime.setHours(destinationHour, destinationMinute, 0, 0);
  
  let cumulativeDuration = 0;
  // reverseでlegsをゴールから近い順に並べ替え
  // ループが回るたびにゴールからの所要時間がcumulativeDurationに累積していく
  [...route.legs].reverse().forEach((leg, index) => {
    cumulativeDuration += leg.duration.value; // 秒単位の所要時間を累積
    // legIndex: 道順そのもののindex
    // index: 時刻計算のために並べ変えた後のindex
    const legIndex = route.legs.length - 1 - index; // 逆順にしたindexを元に戻す

    // この区間の出発時刻（＝前の中継点への到着時刻）を計算するために、
    // この区間の「出発地点」での滞在時間を加算する
    if (legIndex > 0) {
      cumulativeDuration += getStayDuration(legIndex - 1);
    }

    const legDepartureTime = new Date(arrivalTime.getTime() - cumulativeDuration * 1000);

    if (index === route.legs.length - 1) { // 最初の逆ループ(=最後のleg)は出発地
      startHourEl.value = String(legDepartureTime.getHours()).padStart(2, '0');
      startMinuteEl.value = String(legDepartureTime.getMinutes()).padStart(2, '0');

      console.log("出発時刻計算：", startHourEl.value);
      console.log("出発時刻計算：", startMinuteEl.value);

    } else { // 途中は中継点（この時刻はその中継点への到着時刻）
      console.log("出発時刻を逆算します👾");
      const hourId = `relayHour_${legIndex - 1}`;
      const minuteId = `relayMinute_${legIndex - 1}`;

      const relayHourEl = document.getElementById(hourId);// legsとindexは１ずれている
      const relayMinuteEl = document.getElementById(minuteId);

      console.log(`検索するID: ${hourId}, ${minuteId}`);
      console.log("relayHourEl", relayHourEl);
      console.log("relayMinuteEl", relayMinuteEl);

      if (relayHourEl && relayMinuteEl) {
        relayHourEl.value = String(legDepartureTime.getHours()).padStart(2, '0');
        relayMinuteEl.value = String(legDepartureTime.getMinutes()).padStart(2, '0');

        console.log("中継点計算：", relayHourEl.value);
        console.log("中継点計算：", relayMinuteEl.value);
      }
    }
  });
}
