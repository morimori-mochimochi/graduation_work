let resolveMapApiLoaded, rejectMapApiLoaded;

// アプリケーション全体でGoogle Maps APIの読み込み状態を管理するためのPromise
window.mapApiLoaded = new Promise((resolve, reject) => {
  // Promiseのresolve/rejectをグローバル変数に保持して、他の場所から制御できるようにします
  resolveMapApiLoaded = resolve;
  rejectMapApiLoaded = reject;
});

// Google Maps APIのコールバック関数をグローバルスコープに定義
// この関数はAPIスクリプトの `&callback=onGoogleMapsReady` によって呼び出されます
window.onGoogleMapsReady = async() => {
  try {
    // Google Maps APIの必要なライブラリを非同期でインポートします
    await google.maps.importLibrary("maps");
    await google.maps.importLibrary("places");
    await google.maps.importLibrary("geometry");
    await google.maps.importLibrary("routes");
    // すべてのライブラリが読み込めたらPromiseを解決(resolve)します
    resolveMapApiLoaded();
  } catch (err) {
    // ライブラリの読み込みに失敗した場合はPromiseを拒否(reject)します
    rejectMapApiLoaded(new Error("Google Mapsライブラリ初期化失敗:" + err.message));
  }
};

// Google Maps APIスクリプト自体の読み込みエラーを捕捉します
const script = document.querySelector(
  'script[src*="https://maps.googleapis.com/maps/api/js"]'
);
if (script) {
  script.addEventListener("error", (e) => {
    // Promiseがまだ解決されていない場合のみrejectを呼び出します
    rejectMapApiLoaded?.(new Error("Google Maps API script の読み込みに失敗しました"));
  });
} else {
  console.error("Google Maps API script が見つかりませんでした");
}
