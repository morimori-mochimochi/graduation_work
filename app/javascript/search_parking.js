// app/javascript/search_parking.js
export async function searchParking() {
  console.log("searchParkingが呼ばれました");
  
  // イベントデリゲーションを使って、動的に追加されるボタンにも対応
  document.addEventListener('click', async (event) => {
    // クリックした場所にsearch-nearby-parking-btnがあれば処理を続ける
    const searchBtn = event.target.closest('.search-nearby-parking-btn');
    if (!searchBtn) return; // 駐車場検索ボタンでなければ何もしない

    // 押されたボタンが目的地用か中継地用かを特定
    const pointType = searchBtn.dataset.pointType;
    // closest()は　自分　→ その親　→ またその親　と祖先方向に遡って.relay-point-itemを探す
    const relayPointItem = searchBtn.closest('.relay-point-item');
    
    // 駐車場を探したい位置を代入するための変数
    let targetPoint;
    // -1(目的地),0(中継点１),1(中継点３),2(中継点３) -1は存在しないインデックスを表すのに便利
    let pointIndex = -1; // 目的地の場合は-1、中継点の場合はそのインデックス

    // window.routeData.destination.mainPoint.point に入っている値を取り出す
    if (pointType === 'destination') {
      targetPoint = window.routeData?.destination?.mainPoint?.point;
    } else if (pointType === 'relay' && relayPointItem) {
      // relay-point-itemからインデックスを取得(中継点の「何番目か」を特定する)
      const container = document.getElementById('relayPointsContainer');
      // NodeListをArrayに変換してindexOfを使用(直接は使えないため)
      // 押したボタンが含まれる.relay-point-itemが何番目か取得
      pointIndex = Array.from(container.children).indexOf(relayPointItem);
      if (pointIndex !== -1) {
        // pointIndex見つかったら中継点データの中から該当番号の座標を取り出す
        targetPoint = window.routeData?.waypoints[pointIndex]?.mainPoint?.point;
      }
    }

    if (!targetPoint) {
      if (pointType === 'destination') {
        alert("目的地が設定されていません。");
      } else {
        alert("中継点が設定されていません。");
      }
      return;
    }
    
    // 既存の駐車場マーカーをクリア
    if (window.parkingMarkers) {
      window.parkingMarkers.forEach(m => m.map = null);
      window.parkingMarkers = [];
    }

    try {
      // Placesライブラリをロード
      const { Place } = await google.maps.importLibrary("places");

      // 検索条件を設定
      const request = {
        textQuery: "parking",
        locationBias: targetPoint, // 検索の中心地を対象の地点に設定
        fields: ["location", "displayName", "formattedAddress"]
      };

      // 検索結果を取得
      const result = await Place.searchByText(request);

      if (!result.places || result.places.length === 0) {
        alert("周辺に駐車場が見つかりませんでした");
        return;
      }

      // 複数返ってくるので、一件ずつマーカー表示
      result.places.forEach(place => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: window.map,
          position: place.location,
          content: createParkingIcon()
        });

        // parkingMarkersを入れる入れ物を作ってその中に入れる
        if (!window.parkingMarkers) {
          window.parkingMarkers = [];
        }
        window.parkingMarkers.push(marker);

        // infoWindowを表示する処理
        // addListenerはGoogleMap専用のイベント登録メソッド
        // マーカーをクリックでopenParkingInfoWindow関数を呼ぶ
        marker.addListener("click", () => {
          openParkingInfoWindow(marker, place, pointIndex);
        });
      });

      // 最初の駐車場検索結果にpanTo
      window.map.panTo(result.places[0].location);

    } catch (error) {
      alert("駐車場の検索に失敗しました: " + error.message);
      console.error("駐車場の検索に失敗しました:", error);
    }
  });
}

function createParkingIcon() {
  const div = document.createElement("div");
  div.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="green">
      <path d="M18.92 6.01C18.72 5.42 18.15 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 13 17.5 13s1.5.67 1.5 1.5S18.33 16 17.5 16zM5 11l1.5-4.5h11L19 11H5z"/>
    </svg>
  `;
  return div;
}

function openParkingInfoWindow(marker, place, pointIndex) {
  
  // すでに開いているinfoWindowは閉じる
  if (window.activeInfoWindow) {
    window.activeInfoWindow.close();
  }

  // テンプレートからコンテンツを生成
  const template = document.getElementById('parking-info-window-template');
  const content = template.content.cloneNode(true);

  // プレースホルダーに動的な値を設定
  content.querySelector('.parking-info-window-name').textContent = place.displayName;
  content.querySelector('.parking-info-window-address').textContent = place.formattedAddress || "住所情報なし";

  // templateをセット
  const infoWindow = new google.maps.InfoWindow({
    content: content
  });

  // infoWindowを開いてactiveInfoWindowにする
  infoWindow.open(window.map, marker);
  window.activeInfoWindow = infoWindow;

  // infoWindowが開いて実際にHTMLとして描画されてからdomreadyイベントが発火
  google.maps.event.addListenerOnce(infoWindow, "domready", () => {
    const setParkingBtn = document.querySelector(".set-parking-btn");
    setParkingBtn.addEventListener("click", () => {
      const parkingData = { point: place.location, name: place.displayName };
      // UIを書き換える用の変数
      let infoDiv;

      if (pointIndex === -1) { // 目的地の場合
        window.routeData.destination.parkingLot = parkingData;
        infoDiv = document.getElementById('destinationParkingInfo');
      } else { // 中継点の場合
        window.routeData.waypoints[pointIndex].parkingLot = parkingData;
        const relayPointItem = document.getElementById('relayPointsContainer').children[pointIndex];
        infoDiv = relayPointItem.querySelector('.parking-info');
      }

      // UIを書き換える用の変数
      if (infoDiv) {
        infoDiv.textContent = `P: ${place.displayName || '選択した駐車場'}`;
      }

      // 他の駐車場マーカーを消す
      if (window.parkingMarkers) {
        window.parkingMarkers.forEach(m => m.map = null);
        window.parkingMarkers = [];
      }
      infoWindow.close();
    });
  });
}
