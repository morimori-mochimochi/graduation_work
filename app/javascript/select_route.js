export function selectRouteModule(carResult, walkResult) {
  // ルート選択切り替え関数
  const selectRoute = (mode) => {
    const isCar = mode === 'car';
    console.log(`ルート選択処理実行: ${mode}, isCar=${isCar}`);
    
    // 1. データの保存と更新
    const selectedResult = isCar ? carResult : walkResult;
    if (selectedResult && selectedResult.status === 'OK') {
      window.routeData.travel_mode = isCar ? 'DRIVING' : 'WALKING';
      window.directionsResult = selectedResult.response;
      sessionStorage.setItem("directionsResult", JSON.stringify(selectedResult.response));
    }

    // 2. 見た目の更新（選択された方を濃く、手前に表示）
    // 車ルートのスタイル更新
    if (carResult && carResult.renderers) {
      carResult.renderers.forEach((renderer, index) => {
        const weight = isCar ? 7 : 4;
        
        let color;
        if (isCar) {
          // 0番目は車ルート(緑)、それ以外は駐車場からの徒歩ルート(青)
          color = (index === 0) ? 'green' : 'blue';
        } else {
          color = 'gray';
        }

        renderer.setOptions({
          polylineOptions: {
            strokeColor: color,
            strokeOpacity: isCar ? 1.0 : 0.3,
            strokeWeight: weight,
            zIndex: isCar ? 10 : 1 //ルートの交差している時に数値の大きい方が手前に表示される
          }
        });
      });
    }
    // 徒歩ルートのスタイル更新
    if (walkResult && walkResult.renderer) {
      const weight = !isCar ? 7 : 4;
      const color = !isCar ? 'blue' : 'gray';

      walkResult.renderer.setOptions({
        polylineOptions: {
          strokeColor: color,
          strokeOpacity: !isCar ? 1.0 : 0.3,
          strokeWeight: weight,
          zIndex: !isCar ? 10 : 1
        }
      });
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