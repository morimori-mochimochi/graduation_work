export function initSetTime() {
  const startHourEl = document.getElementById("startHour");
  const startMinuteEl = document.getElementById("startMinute");
  const destinationHourEl = document.getElementById("destinationHour");
  const destinationMinuteEl = document.getElementById("destinationMinute");

  // 中継点UIの描画完了を待ってから時刻計算を実行する
  document.addEventListener('relayPointsRendered', (e) => {
    // sessionStorageにルート情報がない場合は何もしない
    if (!sessionStorage.getItem("directionsResult")) {
      return;
    }
    // ルート情報があれば時刻を計算
    calculateTimes({}, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl);
  });

  // 時刻が手動で変更された場合も再計算を実行
  if (startHourEl && startMinuteEl && destinationHourEl && destinationMinuteEl) {
    const calculateWithElements = (options) => calculateTimes(options, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl);
    startHourEl.addEventListener('change', () => calculateWithElements({ changed: 'start' }));
    startMinuteEl.addEventListener('change', () => calculateWithElements({ changed: 'start' }));
    destinationHourEl.addEventListener('change', () => calculateWithElements({ changed: 'destination' }));
    destinationMinuteEl.addEventListener('change', () => calculateWithElements({ changed: 'destination' }));
    document.getElementById('relayPointsContainer').addEventListener('change', (e) => {
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
  // 時刻設定UIが存在しないページでは処理を中断
  if (!startHourEl || !startMinuteEl || !destinationHourEl || !destinationMinuteEl) {
    console.warn('時刻設定UIが見つからないため、時刻計算をスキップします。');
    return;
  }

  const isStartSet = startHourEl && startMinuteEl && startHourEl.value !== "時" && startMinuteEl.value !== "分";
  const isDestinationSet = destinationHourEl.value !== "時" && destinationMinuteEl.value !== "分";

  // ルート情報がなければ何もしない
  const storedDirections = sessionStorage.getItem("directionsResult");
  if (!storedDirections) {
    return;
  }
  const directionsResult = JSON.parse(storedDirections);
  const route = directionsResult.routes[0];

  // ユーザーがどちらの時刻も設定していない場合、または出発時刻を変更した場合
  // → 出発時刻を基準に順算する
  if ((!isStartSet && !isDestinationSet) || isStartSet) {
    calculateAndSetArrivalTime(route, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl);
  } 
  // 到着時刻が設定されている場合（または変更された場合）
  // → 到着時刻を基準に逆算する
  else if (isDestinationSet && !isStartSet) {
    calculateAndSetDepartureTime(route, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl);
  }
}

// 中継点の滞在時間を秒単位で取得するヘルパー関数
function getStayDuration(index) {
  const stayHourEl = document.getElementById(`stayHour_${index}`);
  const stayMinuteEl = document.getElementById(`stayMinute_${index}`);
  let stayDuration = 0;

  if (stayHourEl && stayHourEl.value !== "") {
    stayDuration += parseInt(stayHourEl.value, 10) * 3600; // 時間を秒に変換
  }
  if (stayMinuteEl && stayMinuteEl.value !== "") {
    stayDuration += parseInt(stayMinuteEl.value, 10) * 60; // 分を秒に変換
  }
  return stayDuration;
}

//【順算】出発時刻から到着時刻を計算
function calculateAndSetArrivalTime(route, startHourEl, startMinuteEl, destinationHourEl, destinationMinuteEl) {
  let startHour, startMinute;
  
  // 出発時刻が未設定の場合は現時刻を取得
  if (startHourEl.value === "時" || startMinuteEl.value === "分") {
    const now = new Date();
    startHour = now.getHours();
    startMinute = now.getMinutes();

    // 出発時刻を時刻表記に
    startHourEl.value = String(startHour).padStart(2, '0');
    startMinuteEl.value = String(startMinute).padStart(2, '0');
  } else {
    // ユーザーが設定した出発時刻を routeData に保存
    const selectedTime = new Date();
    selectedTime.setHours(parseInt(startHourEl.value, 10), parseInt(startMinuteEl.value, 10), 0, 0);
    startHour = parseInt(startHourEl.value, 10);
    startMinute = parseInt(startMinuteEl.value, 10);
  }

  const departureTime = new Date();
  departureTime.setHours(startHour, startMinute, 0, 0);

  // 出発時刻をrouteDataに保存
  window.routeData.start_time = departureTime.toTimeString().split(' ')[0]; // "HH:MM:SS"形式
  
  console.log("departureTime:", routeData.start_time);

  let cumulativeDuration = 0;
  route.legs.forEach((leg, index) => {
    cumulativeDuration += leg.duration.value; // 秒単位の所要時間を累積
    const arrivalTime = new Date(departureTime.getTime() + cumulativeDuration * 1000);

    if (index === route.legs.length - 1) { // 最終目的地
      // 到着時刻の表示
      destinationHourEl.value = String(arrivalTime.getHours()).padStart(2, '0');
      destinationMinuteEl.value = String(arrivalTime.getMinutes()).padStart(2, '0');
      // 到着時刻をrouteDataに保存
      window.routeData.destination.arrival_time = arrivalTime.toISOString();
    } else { // 中継点

      // 中継点到着時刻を表示するspan要素を取得
      const arrivalTimeEl = document.getElementById(`relayArrivalTime_${index}`);
      
      if (arrivalTimeEl) {
        const arrivalHour = String(arrivalTime.getHours()).padStart(2, '0');
        const arrivalMinute = String(arrivalTime.getMinutes()).padStart(2, '0');
        const timeString = `${arrivalHour}:${arrivalMinute}`;
        arrivalTimeEl.textContent = timeString;

        // 到着時刻をrouteDataに保存
        if (window.routeData.waypoints[index]) {
          window.routeData.waypoints[index].arrival_time = arrivalTime.toISOString();
        }
      } else {
        console.warn(`中継点[${index}]の到着時刻表示要素が見つかりません。`);
      }

      // 中継点出発時刻を計算・表示
      const stayDuration = getStayDuration(index);
      const departureTimeEl = document.getElementById(`relayDepartureTime_${index}`);
      if (departureTimeEl) {
        if (stayDuration > 0) {
          const departureTimeFromRelay = new Date(arrivalTime.getTime() + stayDuration * 1000);
          const departureHour = String(departureTimeFromRelay.getHours()).padStart(2, '0');
          const departureMinute = String(departureTimeFromRelay.getMinutes()).padStart(2, '0');
          const departureTimeString = `${departureHour}:${departureMinute}`;
          departureTimeEl.textContent = `→ ${departureTimeString} 発`;
        } else {
          departureTimeEl.textContent = ''; // 滞在時間が0なら出発時刻を非表示
        }
      }

      // 次の区間の計算のために、この中継点での滞在時間を加算する
      // legは次の区間を指すため、現在の到着地点（中継点）のインデックスは index となる
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

  console.log("arrivalTime:", arrivalTime);

  // 最終到着時刻をrouteDataに保存
  window.routeData.destination.arrival_time = arrivalTime.toISOString();
  
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
      // 出発時刻をrouteDataに保存
      window.routeData.start_time = legDepartureTime.toTimeString().split(' ')[0]; // "HH:MM:SS"形式
    } else { // 途中は中継点（この時刻はその中継点への到着時刻）
      const arrivalTimeEl = document.getElementById(`relayArrivalTime_${legIndex - 1}`);

      if (arrivalTimeEl) {
        const arrivalHour = String(legDepartureTime.getHours()).padStart(2, '0');
        const arrivalMinute = String(legDepartureTime.getMinutes()).padStart(2, '0');
        const timeString = `${arrivalHour}:${arrivalMinute}`;
        arrivalTimeEl.textContent = timeString;

        // 到着時刻をrouteDataに保存
        if (window.routeData.waypoints[legIndex - 1]) {
          window.routeData.waypoints[legIndex - 1].arrival_time = legDepartureTime.toISOString();
        }
      } else {
        console.warn(`中継点[${legIndex - 1}]の到着時刻表示要素が見つかりません。`);
      }

      // 中継点出発時刻を計算・表示（到着時刻計算後に行う）
      const stayDuration = getStayDuration(legIndex - 1);
      const departureTimeEl = document.getElementById(`relayDepartureTime_${legIndex - 1}`);
      if (departureTimeEl) {
        if (stayDuration > 0) {
          const departureTimeFromRelay = new Date(legDepartureTime.getTime() + stayDuration * 1000);
          const departureTimeString = `${String(departureTimeFromRelay.getHours()).padStart(2, '0')}:${String(departureTimeFromRelay.getMinutes()).padStart(2, '0')}`;
          departureTimeEl.textContent = `→ ${departureTimeString} 発`;
        } else {
          departureTimeEl.textContent = ''; // 滞在時間が0なら出発時刻を非表示
        }
      }
    }
  });
}
