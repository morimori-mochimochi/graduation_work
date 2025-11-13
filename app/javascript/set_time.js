console.log("set_timee.jsを読み込みました");

export function initSetTime() {
  const walkDrawRouteBtn = document.getElementById("walkDrawRoute");
  if (!walkDrawRouteBtn) return;

  walkDrawRouteBtn.addEventListener("click", async() => {
    try{
      //walkDrawRouteはグローバルスコープに公開されているので直接呼び出せる
      await window.walkDrawRoute();
      calculateAndSetArrivalTime();
    } catch (error) {
      console.error("ルートの検索に失敗したため、到着時刻の計算を注意します: ", error);
    }
  });
}

function calculateAndSetArrivalTime() {
  const startHourEl = document.getElementById("startHour");
  const startMinuteEl = document.getElementById("startMinute");
  const relayHourEl = document.getElementById("relayHour");
  const relayMinuteEl = document.getElementById("relayMinute");
  const destinationHourEl = document.getElementById("destinationHour");
  const destinationMinuteEl = document.getElementById("destinationMinute");

  // 出発時刻が選択されていなければ現時刻を出発時刻に
  if (startHourEl.value === "時" || startMinuteEl.value === "分") { //////
    console.log("出発時刻が選択されていません。");
    return;
  }

  const startHour = parseInt(startHourEl.value, 10);
  const startMinute = parseInt(startMinuteEl.value, 10);

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

  // 到着時刻フォームに値を設定
  // padStartでフォーム用に09の形に変換
  destinationHourEl.value = String(arrivalTime.getHours()).padStart(2, '0');
  destinationMinuteEl.value = String(arrivalTime.getMinutes()).padStart(2, '0');

  console.log(`出発: ${startHour}:${startMinute}, 
              所要時間: ${totalDurationSeconds}秒, 
              到着: ${arrivalTime.getHours()}:${arrivalTime.getMinutes()}`);
}
