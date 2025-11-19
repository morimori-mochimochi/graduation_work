console.log("set_arrival_time.jsを読み込みました");

export function initSetTime() {
  const startHourEl = document.getElementById("startHour");
  const startMinuteEl = document.getElementById("startMinute");
  const destinationHourEl = document.getElementById("destinationHour");
  const destinationMinuteEl = document.getElementById("destinationMinute");

  // 'routeDrawn' カスタムイベントをリッスンする
  document.addEventListener('routeDrawn', (e) => {
    console.log('routeDrawnイベントを検知。時刻を計算します。', e.detail);
    calculateTimes();
  });

  // 時刻が手動で変更された場合も再計算を実行
  if (startHourEl && startMinuteEl && destinationHourEl && destinationMinuteEl) {
    startHourEl.addEventListener('change', () => calculateTimes({ changed: 'start' }));
    startMinuteEl.addEventListener('change', () => calculateTimes({ changed: 'start' }));
    destinationHourEl.addEventListener('change', () => calculateTimes({ changed: 'destination' }));
    destinationMinuteEl.addEventListener('change', () => calculateTimes({ changed: 'destination' }));
  }
}

function calculateTimes(options = {}) {
  const startHourEl = document.getElementById("startHour");
  const startMinuteEl = document.getElementById("startMinute");
  const destinationHourEl = document.getElementById("destinationHour");
  const destinationMinuteEl = document.getElementById("destinationMinute");

  const isStartSet = startHourEl.value !== "時" && startMinuteEl.value !== "分";
  const isDestinationSet = destinationHourEl.value !== "時" && destinationMinuteEl.value !== "分";

  // ルート情報がなければ何もしない
  const storedDirections = sessionStorage.getItem("directionsResult");
  if (!storedDirections) {
    console.error("ルート情報が見つかりません");
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

//【順算】出発時刻から到着時刻を計算
function calculateAndSetArrivalTime(route, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl) {
  let startHour, startMinute;

  if (startHourEl.value === "時" || startMinuteEl.value === "分") {
    const now = new Date();
    startHour = now.getHours();
    startMinute = now.getMinutes();
    startHourEl.value = String(startHour).padStart(2, '0');
    startMinuteEl.value = String(startMinute).padStart(2, '0');
  } else {
    startHour = parseInt(startHourEl.value, 10);
    startMinute = parseInt(startMinuteEl.value, 10);
  }

  const departureTime = new Date();
  departureTime.setHours(startHour, startMinute, 0, 0);

  let cumulativeDuration = 0;
  route.legs.forEach((leg, index) => {
    cumulativeDuration += leg.duration.value; // 秒単位の所要時間を累積
    const arrivalTime = new Date(departureTime.getTime() + cumulativeDuration * 1000);

    if (index === route.legs.length - 1) { // 最終目的地
      destinationHourEl.value = String(arrivalTime.getHours()).padStart(2, '0');
      destinationMinuteEl.value = String(arrivalTime.getMinutes()).padStart(2, '0');
    } else { // 中継点
      console.log("中継点の計算します🧮");
      const relayHourEl = document.getElementById(`relayHour_${index}`);
      const relayMinuteEl = document.getElementById(`relayMinute_${index}`);

      console.log("relayHourEl", relayHourEl);
      console.log("relayMinuteEl", relayMinuteEl);
    
      
      if (relayHourEl && relayMinuteEl) {
        relayHourEl.value = String(arrivalTime.getHours()).padStart(2, '0');
        relayMinuteEl.value = String(arrivalTime.getMinutes()).padStart(2, '0');
        console.log("中継点計算：", relayHourEl.value);
        console.log("中継点計算：", relayMinuteEl.value);
      }
    }
  });
}

//【逆算】到着時刻から出発時刻を計算
function calculateAndSetDepartureTime(route, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl) {
  const destinationHour = parseInt(destinationHourEl.value, 10);
  const destinationMinute = parseInt(destinationMinuteEl.value, 10);

  const arrivalTime = new Date();
  arrivalTime.setHours(destinationHour, destinationMinute, 0, 0);

  let cumulativeDuration = 0;
  [...route.legs].reverse().forEach((leg, index) => {
    cumulativeDuration += leg.duration.value; // 秒単位の所要時間を累積
    const departureTime = new Date(arrivalTime.getTime() - cumulativeDuration * 1000);
    // legIndex: 道順そのもののindex
    // index: 時刻計算のために並べ変えた後のindex
    const legIndex = route.legs.length - 1 - index; // 逆順にしたindexを元に戻す

    if (index === route.legs.length - 1) { // 最初の逆ループ(=最後のleg)は出発地
      startHourEl.value = String(departureTime.getHours()).padStart(2, '0');
      startMinuteEl.value = String(departureTime.getMinutes()).padStart(2, '0');
    } else { // 途中は中継点（この時刻はその中継点への到着時刻）
      const relayHourEl = document.getElementById(`relayHour_${legIndex - 1}`);
      const relayMinuteEl = document.getElementById(`relayMinute_${legIndex - 1}`);
      if (relayHourEl && relayMinuteEl) {
        relayHourEl.value = String(departureTime.getHours()).padStart(2, '0');
        relayMinuteEl.value = String(departureTime.getMinutes()).padStart(2, '0');
      }
    }
  });
}
