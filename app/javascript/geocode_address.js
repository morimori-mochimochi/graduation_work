
// #geocodeAddreessはAPi読み込み後に初期化
window.mapApiLoaded.then(() => {
  console.log("APIの準備ができました");

  let geocoder = new google.maps.Geocoder();

  window.geocodeAddress = function(){
  // #addressに入力された場所の文字列を取得
    const address = document.getElementById("address").value;
   // #geocoderはgeocodeingを使うためのオブジェクト
   // #.geocodeメソッドに住所教えて、とリクエストする
    geocoder.geocode({ address: address }, (results, status) => {
    // #resultsは候補の配列 results[0]は最もマッチした候補で、その緯度経度を取り出す
      if (status === "OK"){
        const location = results[0].geometry.location;
    // #地図の中心を移動
        window.map.setCenter(location);
        if (window.marker) {
    // #マーカーがすでにあれば消す
          window.marker.setMap(null);
        }  
    // #新たにマーカーを作って置く
        window.marker = new google.maps.Marker({
          map: window.map,
          position: location
        });
      } else {
        alert("ジオコーディングに失敗しました: "+ status);
      }
    });
  };
});
