console.log("set_time.jsを読み込みました");

export function initSetTime() {
  // 'routeDrawn' カスタムイベントをリッスンする
  document.addEventListener('routeDrawn', (e) => {
    console.log('routeDrawnイベントを検知しました。到着時刻を計算します。', e.detail);
    // イベントを受け取ったら到着時刻を計算・設定する
    calculateAndSetArrivalTime();
  });
}

function calculateAndSetArrivalTime() {
  const startHourEl = document.getElementById("startHour");
  const startMinuteEl = document.getElementById("startMinute");
  const relayHourEl = document.getElementById("relayHour");
  const relayMinuteEl = document.getElementById("relayMinute");
  const destinationHourEl = document.getElementById("destinationHour");
  const destinationMinuteEl = document.getElementById("destinationMinute");

  // ユーザーが到着時刻をすでに指定している場合は、この関数の処理（到着時刻の上書き）を中断する
  if (destinationHourEl.value !== "時" && destinationMinuteEl.value !== "分") {
    console.log("到着時刻が指定されているため、set_arrival_timeの計算をスキップします。");
    return;
  }

  let startHour, startMinute;

  // 出発時刻が選択されていなければ現時刻を出発時刻に
  if (startHourEl.value === "時" || startMinuteEl.value === "分") {
    console.log("出発時刻が選択されていないため、現在時刻を使用します。");
    const now = new Date();
    startHour = now.getHours();
    startMinute = now.getMinutes();

    // フォームにも現在時刻をセット
    startHourEl.value = String(startHour).padStart(2, '0');
    startMinuteEl.value = String(startMinute).padStart(2, '0');
  } else {
    startHour = parseInt(startHourEl.value, 10);
    startMinute = parseInt(startMinuteEl.value, 10);
  }

  // sessionStorageからルート情報を取得 64-69
  const storedDirections = sessionStorage.getItem("directionsResult"); ///////
  if (!storedDirections) {
    console.error("ルート情報が見つかりません");
    return;
  }
  
  const directionsResult = JSON.parse(storedDirections);
  const route = directionsResult.routes[0];

  // 全区間の合計所要時間を計算
  // reduceは配列の全要素を合計したり、まとめる関数
  const totalDurationSeconds = route.legs.reduce((total, leg) => total + leg.duration.value, 0);

  // 出発時刻のDateオブジェクト作成
  const departureTime = new Date();
  departureTime.setHours(startHour, startMinute, 0, 0);

  // 到着時間を計算
  // getTime(): ミリ秒単位の時刻に変換
  // totalDurationSeconds * 1000: 所要時間（秒）をミリ秒に変換
  const arrivalTime = new Date(departureTime.getTime() + totalDurationSeconds * 1000);

  console.log("時間設定要素:", destinationHourEl); // 追加
  console.log("分設定要素:", destinationMinuteEl); // 追加
  console.log("設定する分の値:", String(arrivalTime.getMinutes()).padStart(2, '0')); // 追加

  // 到着時刻フォームに値を設定
  // padStartでフォーム用に09の形に変換
  destinationHourEl.value = String(arrivalTime.getHours()).padStart(2, '0');
  destinationMinuteEl.value = String(arrivalTime.getMinutes()).padStart(2, '0');

  console.log(`出発: ${startHour}:${startMinute}, 
              所要時間: ${totalDurationSeconds}秒, 
              到着: ${arrivalTime.getHours()}:${arrivalTime.getMinutes()}`);
}
