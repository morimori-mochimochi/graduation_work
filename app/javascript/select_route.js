export function selectRouteModule(carResult, walkResult) {
  // ルート選択切り替え関数
  const selectRoute = (mode) => {
    console.log(`selectRoute called with mode: ${mode}`);
    const isCar = mode === 'car';
    
    // 1. データの保存と更新
    const selectedResult = isCar ? carResult : walkResult;
    if (selectedResult && selectedResult.status === 'OK') {
      window.routeData.travel_mode = isCar ? 'DRIVING' : 'WALKING';
      sessionStorage.setItem("directionsResult", JSON.stringify(selectedResult.response));

      // 選択されたルートの距離と所要時間を再計算して保存
      const route = selectedResult.response.routes[0];
      if (route && route.legs) {
        let totalDistance = 0;
        let totalDuration = 0;
        route.legs.forEach(leg => {
          totalDistance += leg.distance.value;
          totalDuration += leg.duration.value;
        });
        window.routeData.total_distance = totalDistance;
        window.routeData.total_duration = totalDuration;
      }

      // UI更新（距離・時間表示や到着時刻）のためにイベントを発火
      const event = new CustomEvent('relayPointsRendered');
      document.dispatchEvent(event);
    }

    // 2. 見た目の更新（選択された方を濃く、手前に表示）
    // 車ルートのスタイル更新
    if (carResult && carResult.renderers) {
      console.log(`Updating car renderers. Count: ${carResult.renderers.length}`);
      carResult.renderers.forEach((renderer, index) => {
        const weight = isCar ? 7 : 4;
        
        let color;
        if (isCar) {
          // 0番目は車ルート(緑)、それ以外は駐車場からの徒歩ルート(青)
          color = (index === 0) ? 'green' : 'blue';
        } else {
          color = 'gray';
        }
        
        console.log(`Car renderer [${index}] - Setting color: ${color}, opacity: ${isCar ? 1.0 : 0.3}`);

        renderer.setOptions({
          polylineOptions: {
            strokeColor: color,
            strokeOpacity: isCar ? 1.0 : 0.3,
            strokeWeight: weight,
            zIndex: isCar ? 10 : 1 //ルートの交差している時に数値の大きい方が手前に表示される
          }
        });

        // スタイル変更を確実に反映させるため、現在のルート情報を再セットして再描画を促す
        const currentDirections = renderer.getDirections();
        if (currentDirections) {
          renderer.setDirections(currentDirections);
        }
      });
    } else {
      console.log("carResult or carResult.renderers is missing");
    }
    // 徒歩ルートのスタイル更新
    if (walkResult && walkResult.renderer) {
      const weight = !isCar ? 7 : 4;
      const color = !isCar ? 'blue' : 'gray';

      console.log(`Walk renderer - Setting color: ${color}, opacity: ${!isCar ? 1.0 : 0.3}`);

      walkResult.renderer.setOptions({
        polylineOptions: {
          strokeColor: color,
          strokeOpacity: !isCar ? 1.0 : 0.3,
          strokeWeight: weight,
          zIndex: !isCar ? 10 : 1
        }
      });

      // スタイル変更を確実に反映させるため、現在のルート情報を再セットして再描画を促す
      const currentDirections = walkResult.renderer.getDirections();
      if (currentDirections) {
        walkResult.renderer.setDirections(currentDirections);
      }
    } else {
      console.log("walkResult or walkResult.renderer is missing");
    }
  };

  // クリック判定用の透明ポリラインを作成するヘルパー関数
  const createHitLine = (result, mode) => {
    if (!result || !result.response || !result.response.routes[0]) return;
    
    const hitLine = new google.maps.Polyline({
      path: result.response.routes[0].overview_path,
      strokeColor: 'transparent', // 透明
      strokeOpacity: 0,
      strokeWeight: 20, // 太くしてクリックしやすくする
      map: window.map,
      zIndex: 20 // 最前面
    });

    // クリックイベント
    hitLine.addListener('click', () => {
     console.log(`Route hit line clicked: ${mode}`);
      selectRoute(mode);
      // クリックされたことをユーザーにフィードバック（例: インフォウィンドウなど）しても良いが、
      // ここでは線の色が濃くなることでフィードバックとする
    });

    window.routeHitLines.push(hitLine);
  };

  // 車・徒歩それぞれの判定ラインを作成
  createHitLine(carResult, 'car');
  createHitLine(walkResult, 'walk');

  // 初期状態は「車」を選択状態にする
  if (carResult && carResult.status === 'OK') {
    selectRoute('car');
  } else if (walkResult && walkResult.status === 'OK') {
    selectRoute('walk');
  }
};