// #まず現在地を取得
export function getCurrentPosition() {
  return new Promise ((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn("このブラウザは位置情報に対応していません");
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        window.currentPosition = currentPosition;
        console.log("現在地を取得しました", currentPosition);
        resolve(currentPosition);
      },  
      (err) => {
        console.error("位置情報の取得に失敗しました:", err.message);
        reject(err);
      }
    );
  });
}

