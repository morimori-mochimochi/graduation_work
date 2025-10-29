window.mapApiLoaded = new Promise((resolve, reject) => {
  // () => {}　：アロー関数。onGoogleMapsReadyが呼ばれたら{}内の処理を実行する
  // 読み込みエラー対策
  const script = document.querySelector(
    'script[src*= "https://maps.googleapis.com/maps/api/js"]'
  );
  if (script) {
    script.addEventListener("error", () => {
      reject(new Error("Google Maps API script の読み込みに失敗しました")); 
    });
  } else {
    reject(new Error("Google Maps API script が見つかりませんでした"));
  }

  window.onGoogleMapsReady = async () => {
    console.log("✅ Google Maps API 読み込み完了。ライブラリ初期化待ち...");
    try {
      //主要なライブラリを確実にダウンロード(内部オブジェクトgoogle.maps.importLibrary)
      await google.maps.importLibrary("maps");
      await google.maps.importLibrary("places");
      await google.maps.importLibrary("geometry");
      await google.maps.importLibrary("routes");
      console.log("✅ Google Maps 全ライブラリ初期化完了");
      resolve();
    } catch (err) {
      reject(new Error("Google Mapsライブラリ初期化失敗:" + err.message));
    }
  };
});
