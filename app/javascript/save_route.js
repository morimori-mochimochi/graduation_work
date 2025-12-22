function showToast(message) {
  alert(message);
}

// CSRFトークンをbodyのdata属性から取得するヘルパー関数
function getCsrfToken() {
  return document.body.dataset.csrfToken;
}

export function initSaveRoute(container) {
  const saveRouteBtn = container.querySelector('#saveRouteBtn');

  if (saveRouteBtn) {
    // イベントの重複登録を防ぐためのチェック
    if (saveRouteBtn.dataset.saveEventAttached) {
      return;
    }
    saveRouteBtn.dataset.saveEventAttached = 'true';

    saveRouteBtn.addEventListener('click', async() => {
      // 'window.routeData'からルート情報を取得
      const routeData = window.routeData;

      if (!routeData || !routeData.start?.point || !routeData.destination?.mainPoint?.point || !routeData.travel_mode) {
        console.error('ルート情報が見つかりません');
        return;
      }

      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      const defaultRouteName = `${formattedDate}のルート`;

      // LatLngオブジェクトから緯度経度を抽出
      const startPoint = {
        name: routeData.start?.name,
        lat: typeof routeData.start.point.lat === 'function' ? routeData.start.point.lat() : routeData.start.point.lat,
        lng: typeof routeData.start.point.lng === 'function' ? routeData.start.point.lng() : routeData.start.point.lng
      };
      const endPoint = {
        mainPoint: {
          name: routeData.destination?.mainPoint?.name,
          lat: routeData.destination.mainPoint.point.lat(),
          lng: routeData.destination.mainPoint.point.lng()
        },
        arrival_time: routeData.destination.arrival_time, 
        parkingLot: routeData.destination.parkingLot ? {
          name: routeData.destination.parkingLot.name,
          lat: routeData.destination.parkingLot.point.lat(),
          lng: routeData.destination.parkingLot.point.lng()
        } : null
      };

      // waypointも緯度経度のみを抽出
      const waypointsToSave =  (routeData.waypoints || []).map(wp => ({
        mainPoint: {
          name: wp.mainPoint?.name,
          lat: wp.mainPoint?.point?.lat(),
          lng: wp.mainPoint?.point?.lng()
        },
        arrival_time: wp.arrival_time,
        stayDuration: wp.stayDuration,
        parkingLot: wp.parkingLot ? {
          name: wp.parkingLot.name,
          lat: wp.parkingLot.point.lat(),
          lng: wp.parkingLot.point.lng()
        } : null
      }));

      const saveData = {
        save_route: {
          name: defaultRouteName,
          travel_mode: routeData.travel_mode,
          start_time: routeData.start_time, // 追加
          start_point: startPoint,
          end_point: endPoint,
          waypoints: waypointsToSave,
          total_distance: routeData.total_distance,
          total_duration: routeData.total_duration
        }
      };

      try {
        const response = await fetch(saveRouteBtn.dataset.saveRouteUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken()
          },
          body: JSON.stringify(saveData)
        });

        if (response.ok) {
          const data = await response.json();
          showToast(data.message); 
          if (data.save_route_id) {
            // 保存成功後、作成されたルートの詳細ページにリダイレクト
            window.location.href = `/save_routes/${data.save_route_id}`;
          } else {
            console.error('保存には成功しましたが、ルートIDが取得できませんでした。');
            showToast('ルートは保存されましたが、ページの移動に失敗しました。');
          }
        } else {
          const errorData = await response.json();
          console.error('ルートの保存に失敗しました:', errorData);
          showToast('ルートの保存に失敗しました');
        }
      } catch (error) {
        console.error('エラーが発生しました:', error);
        showToast('エラーが発生しました');
      }
    });
  }
}