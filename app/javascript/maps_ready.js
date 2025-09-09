window.mapApiLoaded = new Promise((resolve) => {
  if (window.google && window.google.maps) {
    resolve(); // #APIが読み込まれている時はすぐに解決
  } else {
    const originalInitMap = window.initMap;  // #元のinitMap関数を保存(上書きしても元の処理が消えないように)
    window.initMap = () => {
      console.log("initMapがオリジナルに上書きされました");
      // #typeofは指定した値のデータ型を調べ、文字列で返す
      if (typeof originalInitMap === 'function') {
        originalInitMap();
      }
      resolve();
    };
  }
});
window.mapApiLoaded.then(() => console.log("mapsReadyがresolve"));
