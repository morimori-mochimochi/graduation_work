export async function searchParking(){
  console.log("searchParkingが呼ばれました")

  const btn = document.getElementById("searchNearby");

  if (btn) {
    btn.addEventListener("click", async() => {
      const center = window.routeDestination;
      if (!center){
        alert("目的地を設定してください");
        return;
      }

      // #JavaScript の try は 例外処理（エラー処理）ブロック を作るために使う
      // #try { ... } catch (error) { ... } で囲むことで、検索に失敗した場合に alert("駐車場の検索に失敗しました: " + error.message); と表示し、処理を安全に終了
      console.log ("tryに移ります");
      let Place;
      try {
        // #Placesライブラリをロード
        ({ Place } = await google.maps.importLibrary("places"));
        console.log ("placesライブラリの読み込み成功");
      } catch(error) {
        // console.errorはコンソールに赤文字でエラー内容を表示
        console.error("Placesライブラリの読み込みに失敗しました:", error);
        alert("地図機能の読み込みに失敗しました。ページを再読み込みしてください");
        return;
      }
        // #新APIではlocationBiasに{lat,lng}を渡す（radiusは使えない）
      const request = {
        textQuery: "parking",
        locationBias: { lat: center.lat(), lng: center.lng() },
        fields: ["location", "displayName", "formattedAddress"]
      };
     
      console.log("requestを定義しました");
      console.log("Request object:", JSON.stringify(request, null, 2));
      
      try {
        console.log("[LOG1] 駐車場検索のtryブロック開始");
        // タイムアウト処理を追加
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Parking search timed out after 8 seconds')), 8000)
        );
        console.log("[LOG2] timeoutPromise 作成完了");

        // API呼び出しとタイムアウトを競わせる
        const result =  await Promise.race([
          (async () => {
            console.log("[TRACE]Place.searchByText 呼び出し開始");
            try {
              const res = await Place.searchByText(request);
              console.log("[TRACE] Place.searchByText 正常終了:", res);
              return { ok: true, source: "api", data: res };
            } catch (err) {
              console.error("[TRACE] Place.searchByText 内部でエラー:", err);
              return { ok: false, source: "api", error: err };
            }
          })(),
          (async () => {
            console.log("[TRACE] timeoutPromise 開始（8秒タイマー)");
            try {
              await new Promise((_, reject) => 
                setTimeout(() => reject(new Error("タイムアウト")), 8000)
              );
            } catch (err) {
              console.warn ("[TRACE]timeoutPromise発火: ", err.message);
              return { ok: false, source: "timeout", error: err };
            }
          })()
        ]);
        console.log("[TRACE]Promise race 結果:", result)
            
        // テスト用に、マーカーの描画が完了したことを示すフラグを立てる
        window.parkingMarkersRendered = true;
          
        if (!result.data.places || result.data.places.length === 0) {
          alert("周辺に駐車場が見つかりませんでした");
          // テストのためにコンソールにもログを残す
          console.warn("No parking found near the destination.");
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
          if (!window.parkingMarkers) {
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
                  console.log("routeParkingの中身:", window.routeParking);

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
        // テスト用に、初期化が完了したことを示すフラグを立てる
        window.searchParkingInitialized = true;
        // #マップを最初の駐車場に合わせてパン
        // #panToとは地図の中心をゆっくりと滑らせながら移動させるメソッド
        window.map.panTo(result.places[0].location);

      } catch (error) {
        alert("駐車場の検索に失敗しました: " + error.message);
        console.error("駐車場の検索に失敗しました:", error);
      }
    });
  }
}
