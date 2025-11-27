// container = document は「container がないときは document を使うよ」という意味
export function initMoveNavi(container = document) {
  const startNaviBtn = container.querySelector('#start-navigation-from-saved-route');
  if (!startNaviBtn) return;
  
  // イベントリスナーの重複登録を防止
  if (startNaviBtn.dataset.moveNaviAttached) return;
  startNaviBtn.dataset.moveNaviAttached = 'true';
  
  startNaviBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const button = e.currentTarget;
    const routeData = JSON.parse(button.dataset.route);
    // ボタンをローディング状態にする
    button.classList.add('loading');
    button.disabled = true;
    button.textContent = 'ルート準備中...';
    
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
        window.location.href = button.dataset.carNaviPath;
      } else if (routeData.travel_mode === 'walking') {
        window.location.href = button.dataset.walkNaviPath;
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
}
