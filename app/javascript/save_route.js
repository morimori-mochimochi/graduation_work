document.addEventListener('DOMContentLoaded', () => {
  const saveRouteBtn = document.getElementById('saveRouteBtn');
  if (saveRouteBtn) {
    saveRouteBtn.addEventListener('click', async() => {
      // 'window.routeData'からルート情報を取得
      const routeData = window.routeData;
      if (!routeData || !routeData.start_point || !routeData.end_point) {
        console.error('ルート情報が見つかりません');
        return;
      }

      const today = new Data();
      const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      const defaultRouteName = `${formattedDate}のルート`;

      const saveData = {
        save_route: {
          name: defaultRouteName,
          travel_mode: routeData.travel_mode,
          start_point: JSON.stringify(routeData.start_point),
          end_point: JSON.stringify(routeData.end_point),
          waypoints: JSON.stringify(routeData.waypoints || [])
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
  function showToast(message) {
    alert(message);
  }
});