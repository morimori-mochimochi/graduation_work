window.mapApiLoaded = new Promise((resolve, reject) => {
  function checkReady() {
    if (window.google && window.google.maps && window.google.maps.DirectionsService) {
      console.log("✅ Google Maps API ready");
      resolve();
      return true;
    }
    return false;
  }

  if (checkReady()) return; // すでにロード済みなら即resolve

  const script = document.querySelector(
    'script[src*="https://maps.googleapis.com/maps/api/js"]'
  );

  if (!script) {
    reject(new Error("Google Maps API script not found"));
    return;
  }

  script.addEventListener("load", () => {
    // "load"後すぐではまだgoogle.mapsが完全に揃っていないことがあるので、
    // 一定間隔でチェックしてからresolve
    const maxWaitMs = 5000;
    const start = Date.now();

    const interval = setInterval(() => {
      if (checkReady()) {
        clearInterval(interval);
      } else if (Date.now() - start > maxWaitMs) {
        clearInterval(interval);
        reject(new Error("Google Maps API failed to become ready in time"));
      }
    }, 100);
  });

  script.addEventListener("error", () => {
    reject(new Error("Failed to load Google Maps API script"));
  });
});