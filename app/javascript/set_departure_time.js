console.log("set_departure_time.jsを読み込みました");

export function initSetDepartureTime() {
  // 'routeDrawn' カスタムイベントをリッスンする
  document.addEventListener('routeDrawn', (e) => {
    console.log('routeDrawnイベントを検知しました。到着時刻を計算します。', e.detail);
    // イベントを受け取ったら出発時刻を計算・設定する
    calculateAndSetDepartureTime();
  });
}

function calculateAndSetDepartureTime() {
  const startHourEl = document.getElementById("startHour");
  const startMinuteEl = document.getElementById("startMinute");
  const relayHourEl = document.getElementById("relayHour");
  const relayMinuteEl = document.getElementById("relayMinute");
  const destinationHourEl = document.getElementById("destinationHour");
  const destinationMinuteEl = document.getElementById("destinationMinute");

  const destinationHour = parseInt(destinationHourEl.value, 10);
  const destinationMinute = parseInt(destinationMinuteEl.value, 10);

  // sessionStorageからルート情報を取得 64-69
  const storedDirections = sessionStorage.getItem("directionsResult"); ///////
  if (!storedDirections) {
    console.error("ルート情報が見つかりません");
    return;
  }

  // 到着時刻が選択されていなければ処理を中断
  if (destinationHourEl.value === "時" || destinationMinuteEl.value === "分") {
    console.log("到着時刻が選択されていないため、出発時刻の逆算を中断します。");
    return;
  }

  // 到着時刻が手動で変更された場合も逆算を実行
  if (destinationHourEl && destinationMinuteEl) {
    destinationHourEl.addEventListener('change', calculateAndSetDepartureTime);
    destinationMinuteEl.addEventListener('change', calculateAndSetDepartureTime);
  }
  
  const directionsResult = JSON.parse(storedDirections);
  const route = directionsResult.routes[0];

  // 全区間の合計所要時間を計算
  // reduceは配列の全要素を合計したり、まとめる関数
  const totalDurationSeconds = route.legs.reduce((total, leg) => total + leg.duration.value, 0);

  // 到着時刻のDateオブジェクト作成
  const arrivalTime = new Date();
  // setHours(時, 分, 秒, ミリ秒)
  arrivalTime.setHours(destinationHour, destinationMinute, 0, 0);

  // 出発時間を計算
  // getTime(): ミリ秒単位の時刻に変換
  // totalDurationSeconds * 1000: 所要時間（秒）をミリ秒に変換
  const departureTime = new Date(arrivalTime.getTime() - totalDurationSeconds * 1000);

  console.log("時間設定要素:", startHourEl); // 追加
  console.log("分設定要素:", startMinuteEl); // 追加
  console.log("設定する分の値:", String(departureTime.getMinutes()).padStart(2, '0')); // 追加

  // 到着時刻フォームに値を設定
  // padStartでフォーム用に09の形に変換
  startHourEl.value = String(departureTime.getHours()).padStart(2, '0');
  startMinuteEl.value = String(departureTime.getMinutes()).padStart(2, '0');

  console.log(`出発: ${startHour}:${startMinute}, 
              所要時間: ${totalDurationSeconds}秒, 
              到着: ${arrivalTime.getHours()}:${arrivalTime.getMinutes()}`);
}
