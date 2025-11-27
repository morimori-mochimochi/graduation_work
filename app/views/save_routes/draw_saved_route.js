document.addEventListener('turbo:load', () => {
  const routeDataElement = document.getElementById('route-data');
  // #route-data要素が存在しないページでは何もしない
  if (!routeDataElement) {
    return;
  }

  const routeData = JSON.parse(routeDataElement.dataset.route);
  const mapElement = document.getElementById('map');

  // 地図とDirectionsService/Rendererの初期化
  const map = new google.maps.Map(mapElement, {
    zoom: 15,
    // 地図の中心はルート描画後に自動調整されるため、仮の中心を設定
    center: { lat: 35.681236, lng: 139.767125 } // 東京駅
  });
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // Directions APIへのリクエストを作成
  const request = buildDirectionsRequest(routeData);

  // ルート検索を実行し、地図に描画
  directionsService.route(request, (result, status) => {
    if (status == 'OK') {
      directionsRenderer.setDirections(result);
    } else {
      console.error('Directions request failed due to ' + status);
      alert('ルートの描画に失敗しました。');
    }
  });
});

/**
 * 保存されたルート情報からDirections APIのリクエストオブジェクトを構築する
 * @param {object} routeData - ルート情報
 * @returns {object} Directions APIリクエストオブジェクト
 */
function buildDirectionsRequest(routeData) {
  // travel_modeをGoogle Maps APIの形式に変換
  const travelMode = routeData.travel_mode.toUpperCase();

  // 出発点
  const origin = {
    lat: parseFloat(routeData.start_point.lat),
    lng: parseFloat(routeData.start_point.lng)
  };

  // 到着点
  // end_pointはmainPointとparkingLotを持つ可能性がある
  const destinationPoint = routeData.end_point.parkingLot || routeData.end_point.mainPoint;
  const destination = {
    lat: parseFloat(destinationPoint.lat),
    lng: parseFloat(destinationPoint.lng)
  };

  // 経由地
  const waypoints = routeData.waypoints.map(waypoint => {
    // 各経由地はmainPointとparkingLotを持つ可能性がある
    const waypointLocation = waypoint.parkingLot || waypoint.mainPoint;
    return {
      location: {
        lat: parseFloat(waypointLocation.lat),
        lng: parseFloat(waypointLocation.lng)
      },
      stopover: true
    };
  });

  return {
    origin: origin,
    destination: destination,
    waypoints: waypoints,
    travelMode: google.maps.TravelMode[travelMode],
    optimizeWaypoints: true // 経由地の順序を最適化
  };
}