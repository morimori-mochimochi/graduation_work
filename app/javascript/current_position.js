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
        const currentPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        window.currentPos = currentPos;
        console.log("現在地を取得しました", currentPos);
        resolve(currentPos);
      },  
      (err) => {
        console.error("位置情報の取得に失敗しました:", err.message);
        reject(err);
      }
    );
  });
}

