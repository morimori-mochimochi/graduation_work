window.onGoogleMapsReady = window.onGoogleMapsReady || function () {};
const originalOnGoogleMapsReady = window.onGoogleMapsReady;

window.onGoogleMapsReady = function () {
  originalOnGoogleMapsReady(); // 既存の処理があれば実行

  const startNaviBtn = document.getElementById('start-navigation-from-saved-route');
  if (!startNaniBtn) return;

  startNaviBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const button = e.currentTarget;
    const routeData = JSON.parse(button.dataset.route);

    // ボタンをローディング状態にする
    button.classList.add('loading');
    button.disabled = true;
    button.textConten = 'ルート準備中...';
    
    const directionsService = new google.maps.DirectionsService();

    const request = {
      origin: new google.maps.LatLng(routeData.start_point.lat, routeData.start_point.lng),
      destination: new google.maps.LatLng(routeData.end_point.lat, routeData.end_point.lng),
      travelMode: google.maps.TravelMode[routeData.travel_mode.toUpperCase()],
      waypoints: (routeData.waypoints || []).map(wp => ({
        location: new google.maps.LatLng(wp.lat, wp.lng),
        stopover: true
      })),
      optimizeWaypoints: true,
    };

    try {
      const response = await directionsService.route(request);
      // directionsResultをsessionStorageに保存
      sessionStorage.setItem('directionsResult', JSON.stringify(response));

      // travel_modeに応じて適切なナビゲーションページに移動
      if (routeData.travel_mode === 'driving') {
        window.location.href = '<%= car_navigation_routes_path %>';
      } else if (routeData.travel_mode === 'walking') {
        window.location.href = '<%= walk_navigation_routes_path %>';
      } else {
        alert('不明な移動手段です');
        button.classList.remove('loading');
        button.disabled = false;
        button.textContent = 'すぐ出発する';
      }
    } catch (error) {
      console.error('ルートの取得に失敗しました:', error);
      alert('ルートの取得に失敗しました。時間をおいて再度お試しください。');
      button.classList.remove('loading');
      button.disabled = false;
      button.textContent = 'すぐ出発する';
    }
  });
};

// API読み込み済みの時のために手動で呼び出す
if (window.google && window.google.maps) {
  window.onGoogleMapsReady();
}


