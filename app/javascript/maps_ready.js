window.mapApiLoaded = new Promise((resolve, reject) => {
  // () => {}　：アロー関数。onGoogleMapsReadyが呼ばれたら{}内の処理を実行する
  window.onGoogleMapsReady = () => {
    console.log("✅ Google Maps API 読み込み完了");
    resolve();
  };

  // 読み込みエラー対策
  const script = document.querySelector(
    'script[src*= "https://maps.googleapis.com/maps/api/js"]'
  );
  if (script) {
    script.addEventListener("error", () => {
      reject(new Error("Failed to load Google Maps API script")); 
    });
  } else {
    reject(new Error("Google Maps API script bot found"));
  }
});
