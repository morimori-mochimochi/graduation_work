window.mapApiLoaded = new Promise((resolve) => {
  if (window.google && window.google.maps) {
    resolve();
    return; // #APIが読み込まれている時はすぐに解決
  } 
   
  // Google Maps APIの<script>を探す
  const script = document.querySelector(
    'script[src*="https://maps.googleapis.com/maps/api/js"]'
  );

  if (!script) {
    reject(new Error("Google Maps API script not found"));
    return;
  }

  // scriptの読み込み完了イベントを監視
  script.addEventListener("load", () => {
    //読み込んでもgoogle.mapsがなければエラー
    if (window.google && window.google.maps) {
      console.log("Google Maps API fully loaded");
      resolve();
    } else {
      reject(new Error("Google Maps API loaded but google.map is missing"));
    }
  });
  // 読み込みエラーをキャッチ
  script.addEventListener("error", () => {
    reject(new Error("Faild to load Google Maps API script"));
  });
});

window.mapApiLoaded.then(() => console.log("mapsReadyがresolveされたのでinitMap", window.google?.maps));
