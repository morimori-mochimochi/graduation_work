function showToast(message) {
  alert(message);
}

document.addEventListener('DOMContentLoaded', () => {
  const saveRouteBtn = document.getElementById('saveRouteBtn');

  if (saveRouteBtn) {
    saveRouteBtn.addEventListener('click', async() => {
      // 'window.routeData'からルート情報を取得
      const routeData = window.routeData;
      
      console.log("routeDataの内容:", routeData);

      if (!routeData || !routeData.start?.point || !routeData.destination?.mainPoint?.point || !routeData.travel_mode) {
        console.error('ルート情報が見つかりません');
        return;
      }

      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      const defaultRouteName = `${formattedDate}のルート`;

      // LatLngオブジェクトから緯度経度を抽出
      const startPoint = {
        lat: routeData.start.point.lat(),
        lng: routeData.start.point.lng()
      };
      const endPoint = {
        lat: routeData.destination.mainPoint.point.lat(),
        lng: routeData.destination.mainPoint.point.lng()
      };

      // waypointも緯度経度のみを抽出
      const waypointsToSave =  (routeData.waypoints || []).map(wp => ({
        lat: wp.mainPoint?.point?.lat(),
        lng: wp.mainPoint?.point?.lng()
      }));

      const saveData = {
        save_route: {
          name: defaultRouteName,
          travel_mode: routeData.travel_mode,
          start_point: startPoint,
          end_point: endPoint,
          waypoints: waypointsToSave
        }
      };

      try {
        const response = await fetch(saveRouteBtn.dataset.saveRouteUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
          },
          body: JSON.stringify(saveData)
        });

        if (response.ok) {
          const data = await response.json();
          showToast(data.message);
          // フォームを閉じる（非表示にする）
          const routeFormHeader = document.getElementById('routeFormHeader');
          if (routeFormHeader) {
            routeFormHeader.style.display = 'none';
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
});