export function getLatLngFromPosition(pos) {
  return {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude
  };
}

export function initCurrentPosBtn(buttonIds = ["currentPosBtn", "initCurrentPosBtn"]) {
  console.log("現在地取得開始");
  buttonIds.forEach((buttonId) => {

    const btn = document.getElementById(buttonId);
    console.log("btn:", btn);
    if (!btn) {
      console.warn(`ボタンが存在しません: ${buttonId}`);
      return;
    }

    btn.addEventListener("click", (e) => {
      console.log("クリックイベント発火:", e.target);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const currentPos = getLatLngFromPosition(pos);
          window.currentPos = currentPos;
          console.log("現在地取得完了:", currentPos);

          // マーカーが存在する場合は中心を移動してマーカー立てる
          const map = window.map;
          if (map) {
            map.setCenter(currentPos);

            //既存のマーカーを消す
            if (window.currentPosMarker) {
              window.currentPosMarker.setMap(null);
            }

            //新しいマーカーを作成
            window.currentPosMarker = new google.maps.Marker({
              position: currentPos,
              map: map,
              title: "現在地",
              animation: google.maps.Animation.BOUNCE,
            });
          }else{
            console.warn("マップがまだ存在しません")
          }
        },
        (err) => {
          console.log("現在地の取得に失敗しました: ", err)
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    });
  });
}