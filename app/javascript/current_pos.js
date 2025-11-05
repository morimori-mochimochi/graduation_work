//現在地を保持する変数
let currentPos = null;

// 現在地取得関数
export function getLatLngFromPosition(pos) {
  return {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude
  };
}

// 現在地を取得してPromiseで返す
//成功すると{lat, lng}を返す
export function fetchCurrentPos() {
  return new Promise ((resolve, reject) => {
    // すでに取得されている時はそれを使う
    if (currentPos) {
      resolve(currentPos);
      return;
    }
    //ブラウザの位置情報を取得
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = getLatLngFromPosition(pos);
        currentPos = newPos;
        window.currentPos = newPos; //既存コード互換のため
        resolve(newPos);
        console.log("現在地取得完了:", currentPos);
      },
      (err) => reject(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  });
}

//外から現在地を読む関数
export function getCurrentPos() {
  return currentPos;
}

//現在地ボタンの初期化
//ボタンをクリックすると現在地取得とマップの移動＆マーカー表示
export function initCurrentPosBtn(buttonIds = ["currentPosBtn", "currentPosBtnCar"]) {
  console.log("現在地取得開始");
  buttonIds.forEach((buttonId) => {
    const btn = document.getElementById(buttonId);
    console.log("btn:", btn);
    if (!btn) {
      console.warn(`ボタンが存在しません: ${buttonId}`);
      return;
    }

    // ボタンに現在地取得が実行すみか確認して実行済み場合は何もしない
    if (btn.dataset.eventAttached) {
      return;
    }
    btn.dataset.eventAttached = "true";

    btn.addEventListener("click", async(e) => {
      console.log("クリックイベント発火:", e.target);
      try{
        const newPos = await fetchCurrentPos();
        console.log("現在地取得完了:", newPos);

        const map = window.map;
        if (map) {
          map.setCenter(newPos);

          //既存のマーカーを消す
          if (window.currentPosMarker) {
            window.currentPosMarker.setMap(null);
          }

          //新しいマーカーを作成
          window.currentPosMarker = new google.maps.Marker({
            position: newPos,
            map: map,
            title: "現在地",
            animation: google.maps.Animation.BOUNCE,
          });
        }else{
          console.warn("マップがまだ存在しません")
        }
      } catch (err) {
        console.error("現在地取得に失敗しました:", err);
      }
    });
  });
}