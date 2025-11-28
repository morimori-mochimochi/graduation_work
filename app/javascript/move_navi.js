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

    // 最終目的地は常に mainPoint
    const finalDestination = new google.maps.LatLng(
      parseFloat(routeData.end_point.mainPoint.lat),
      parseFloat(routeData.end_point.mainPoint.lng)
    );

    // 経由地を構築する
    const waypoints = [];

    // 1. 元の経由地を追加
    (routeData.waypoints || []).forEach(wp => {
      // 経由地の本来の場所
      waypoints.push({ location: new google.maps.LatLng(parseFloat(wp.mainPoint.lat), parseFloat(wp.mainPoint.lng)), stopover: true });
      // 経由地の駐車場があれば、それも経由地として追加
      if (wp.parkingLot) {
        waypoints.push({ location: new google.maps.LatLng(parseFloat(wp.parkingLot.lat), parseFloat(wp.parkingLot.lng)), stopover: true });
      }
    });

    // 2. 最終目的地の駐車場があれば、それを最後の経由地として追加
    if (routeData.end_point.parkingLot) {
      waypoints.push({ location: new google.maps.LatLng(parseFloat(routeData.end_point.parkingLot.lat), parseFloat(routeData.end_point.parkingLot.lng)), stopover: true });
    }

    const request = {
      origin: new google.maps.LatLng(parseFloat(routeData.start_point.lat), parseFloat(routeData.start_point.lng)),
      destination: finalDestination,
      travelMode: google.maps.TravelMode[routeData.travel_mode.toUpperCase()],
      waypoints: waypoints,
      optimizeWaypoints: false, // 保存された順序を維持するため、最適化はしない
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
