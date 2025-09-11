export async function searchParking(){
  // #set_markerで保存してある"最後においたマーカーの座標"
  console.log("searchParkingが呼ばれました")

  const btn = document.getElementById("searchNearby");

  if (btn) {
    btn.addEventListener("click", async() => {
      const center = window.searchCenter;
      console.log("マーカーを取得しました");
        
      if (!center){
        alert("マーカーを設置してください");
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
          fields: ["location"]
        };
     
        const result = await Place.searchByText(request);
          
        if (!result.places || result.places.length === 0) {
          alert("周辺に駐車場が見つかりませんでした");
          return;
        }
        // #複数返ってくるので、一件ずつマーカー表示
        result.places.forEach(place => {
          new google.maps.marker.AdvancedMarkerElement({
            map: window.map,
            position: place.location,
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
}
