export async function searchParking(){
  // #set_markerで保存してある"最後においたマーカーの座標"
  console.log("searchParkingが呼ばれました")

  const btn = document.getElementById("searchNearby");

  if (btn) {
    btn.addEventListener("click", async() => {
      const center = window.routeDestination;
      console.log("マーカーを取得しました");
        
      if (!center){
        alert("目的地を設定してください");
        return;
      }

      // #JavaScript の try は 例外処理（エラー処理）ブロック を作るために使う
      // #try { ... } catch (error) { ... } で囲むことで、検索に失敗した場合に alert("駐車場の検索に失敗しました: " + error.message); と表示し、処理を安全に終了
      try {
        // #Placesライブラリをロード
        const { Place } = await google.maps.importLibrary("places");
        // #新APIではlocationBiasに{lat,lng}を渡す（radiusは使えない）
        const request = {
          textQuery: "parking",
          locationBias: { lat: center.lat(), lng: center.lng() },
          fields: ["location", "displayName", "formattedAddress"]
        };
     
        const result = await Place.searchByText(request);
          
        if (!result.places || result.places.length === 0) {
          alert("周辺に駐車場が見つかりませんでした");
          return;
        }
        // #複数返ってくるので、一件ずつマーカー表示
        result.places.forEach(place => {
          const marker = new google.maps.marker.AdvancedMarkerElement({
            map: window.map,
            position: place.location,
            content: (() => {
              const div = document.createElement("div");
              div.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="green">
                  <path d="M18.92 6.01C18.72 5.42 18.15 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 
                  .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 
                  .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 
                  16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 
                  13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 
                  0c-.83 0-1.5-.67-1.5-1.5S16.67 13 17.5 
                  13s1.5.67 1.5 1.5S18.33 16 17.5 16zM5 11l1.5-4.5h11L19 
                  11H5z"/>
                </svg>
              `;
              return div;
            })()
          });

          //駐車場マーカーの配列をグローバルに初期化
          if (!window. parkingMarkers) {
           window.parkingMarkers = [];
          }
          window.parkingMarkers.push(marker);


          // infoWindowを表示する処理
          marker.addListener("click", () => {
            if (window.activeInfoWindow) {
              window.activeInfoWindow.close();
            }

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="min-width:200px">
                  <div style="font-size:0.95em;color:#555;">
                    ${place.formattedAddress || "住所情報なし"}
                  </div>
                  <button id="setParking" style="marin-right:8px;">ここに駐車する</button>
                </div>
              `
            });

            infoWindow.open(window.map, marker);
            window.activeInfoWindow = infoWindow;

            google.maps.event.addListenerOnce(infoWindow, "domready", () => {
              const parkingBtn = document.getElementById("setParking");

              if (parkingBtn) {
                parkingBtn.addEventListener("click", () => {
                  //選択した駐車場の位置保存
                  window.routeParking = place.location;

                  if (window.parkingMarkers) {
                    window.parkingMarkers.forEach(m => {
                      if (m !== marker){
                        m.map = null; //マップから消す
                      }
                    });
                  }

                  //UI更新
                  const routeParkingBtn = document.getElementById("routeParking");
                  if (routeParkingBtn) {
                    routeParkingBtn.textContent = place.formattedAddress || "駐車場";
                    routeParkingBtn.style.display = "inline-block";
                  }
                  infoWindow.close();
                });
              }
            });
          });
        });
         // #マップを最初の駐車場に合わせてパン
        // #panToとは地図の中心をゆっくりと滑らせながら移動させるメソッド
        window.map.panTo(result.places[0].location);

      } catch (error) {
        alert("駐車場の検索に失敗しました: " + error.message);
      }
    });
  }
  // テスト用に、初期化が完了したことを示すフラグを立てる
  window.searchParkingInitialized = true;
}
