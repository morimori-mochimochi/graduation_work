// クリックしたマーカーが大きくなる
export function highlightMarker(marker, duration = 1500) {
  if (!marker) return;
  // 施設の名前を取り出す
  let facilityName = marker.getTitle ? marker.getTitle() : "";
  // 施設の住所を取り出す
  let facilityAddress = marker.placeResult && marker.placeResult.formattedAddress
    ? marker.placeResult.formattedAddress
    : (marker.formattedAddress || "");

  console.log("施設名、住所を取り出しました");
    
  // フォールバック: データの種類が足りない時に備えて代替フィールドを順に探す
  if (!facilityAddress && marker.address) facilityAddress = marker.address;
  if (!facilityAddress && marker.label) facilityAddress = marker.label;

  // InfoWindowの内容ボタン
  const infoContent = `
    <div style = "min-width:200px";>
      <div style="font-weight:bold;font-size:1.1em;margin-bottom:2px;text-align:center;">${facilityName}</div>
      <button id="setStr" style="margin-right:4px;">出発地</button>
      <button id="setDest">ここを目的地に設定</button>
      <button id="saveLocation">この場所を保存</button>
    </div>
  `;
  // 既存のInfoWindowを閉じる
  if (window.activeInfoWindow) {
    window.activeInfoWindow.close();
  }

  const infoWindow = new google.maps.InfoWindow({
    content: infoContent
  });
  infoWindow.open(marker.getMap(), marker);
  window.activeInfoWindow = infoWindow;

  //ボタンクリックベントを設定
  google.maps.event.addListenerOnce(infoWindow, "domready", function() {
    console.log("setStr:", document.getElementById("setStr"));
    console.log("setDest:", document.getElementById("setDest"));

    const start_btn = document.getElementById("setStr");
    const destination_btn = document.getElementById("setDest");
    const save_btn = document.getElementById("saveLocation");

    if (start_btn) {
      start_btn.addEventListener("click", function() {
        window.routeStart = marker.getPosition ? marker.getPosition() : marker.position;

        const uiStart = document.getElementById("startPoint"); 
        if (uiStart) {
          console.log("出発地UIを更新します:", uiStart);
          uiStart.textContent = facilityName || "選択した場所";
        }
        infoWindow.close();
      });
    }

    console.log("出発地ボタンにイベント登録しました", start_btn);

    if (destination_btn) {
      destination_btn.addEventListener("click", function() {
        window.routeDestination = marker.getPosition ? marker.getPosition() : marker.position;

        const uiDest = document.getElementById("destinationPoint");
        if (uiDest) {
          console.log("目的地UIを更新します:", uiDest);
          uiDest.textContent = facilityName || "選択した場所";
        }
        infoWindow.close();
      });
      console.log("目的地ボタンにイベント登録しました", destination_btn);
    }

    if (save_btn) {
      save_btn.addEventListener("click", function() {
        const position = marker.getPosition ? marker.getPosition() : marker.position;
        // URLのクエリパラメータを作成
        const params = new URLSearchParams({
          'location[address]': facilityAddress,
          'location[lat]': position.lat(),
          'location[lng]': position.lng()
        });

        // new_location_path にクエリパラメータを付けて遷移
        window.location.href = `/locations/new?${params.toString()}`;
      });
    }
  });
  
  marker.setAnimation(google.maps.Animation.BOUNCE);

  setTimeout(() => {
    marker.setAnimation(null);
  }, duration);
}

// #部分一致検索＋ピン設置
async function searchExactPlace(query) {
  const {Place} = await google.maps.importLibrary("places");
  const center = map.getCenter();
  console.log("Placeライブラリが呼ばれました");

  const request = {
    textQuery: query,
    fields: ["location", "displayName", "formattedAddress", "photos"],
    // #マップの中心周辺５キロのように検索範囲を与える
    locationBias: center,
  };

  const result = await Place.searchByText(request);
  console.log(result);

  // #結果が一件もなければ終了
  if (!result.places || result.places.length === 0) {
    alert("該当する施設が見つかりませんでした");
    return;
  }

 // 距離順に並べ替え
  const sortedPlaces = result.places.sort((a,b) => {
    const distA = google.maps.geometry.spherical.computeDistanceBetween(center, a.location);
    const distB = google.maps.geometry.spherical.computeDistanceBetween(center, b.location);
    return distA - distB;
  });
    
  // 既存のマーカーを削除
  if (window.markers && window.markers.length > 0) {
    window.markers.forEach(m => m.setMap(null));
  }
  window.markers = [];

  sortedPlaces.forEach(place => {
    const marker = new google.maps.Marker({
      position: place.location,
      map: map,
      title: place.displayName,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      }
    });
    window.markers.push(marker);
  });

  // 検索結果をリスト表示
  let mapDiv = document.getElementById("map");
  let container = document.getElementById("resultContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "resultContainer";
    container.style.maxHeight = "200px";
    container.style.overflowY = "auto";
    container.style.border = "1px solid #ccc";
    container.style.padding = "5px";
    container.style.marginTop = "10px";

    mapDiv.parentNode.insertBefore(container, mapDiv.nextSibling);
  } else {
    container.innerHTML = ""; //前回の結果をクリア
  }

  // forEachはJSの繰り返し処理。マーカーとリストを対応付けてリストのHTMLを作る。
  sortedPlaces.forEach((place, index) => {
    const marker = window.markers[index];

    // マーカークリックで対応するリストへ移動
    // window.markerにすることでこの処理の外からマーカーを消すことが可能。
    window.markers[index].addListener("click", () => {
      highlightMarker(window.markers[index]);

      // 対応するリスト要素までスクロール
      const listItem = container.children[index];
      if (listItem) {
        listItem.scrollIntoView({ behavior: "smooth", block: "center" });
        // ハイライト効果
        listItem.style.backgroundColor = "#ffff99";
        setTimeout(() => {
          listItem.style.backgroundColor = "";
        }, 1500);
      }
    });

    const item = document.createElement("div");
    item.classList.add("result-item");
    item.style.borderBottom = "1px solid #eee";
    item.style.padding = "5px";
    item.style.cursor = "pointer";
      
    // 施設名
    const name = document.createElement("h4");
    name.textContent = place.displayName;
    name.style.margin = "0 0 3px 0";

    // 住所
    const address = document.createElement("p");
    address.textContent = place.formattedAddress || "";
    address.style.margin = "0 0 3px 0";
    address.style.fontSize = "0.9em";
    address.style.color = "#555";

    // 画像
    let img;
    if (place.photos && place.photos.length > 0) {
      img = document.createElement("img");
      img.src = place.photos[0].getURI({ maxWidth: 100, maxHeight: 100 });
      img.style.display = "block";
      img.style.marginBottom = "3px";
    }

    item.appendChild(name);
    if (img) item.appendChild(img);
    item.appendChild(address);
    container.appendChild(item);

    //クリックでマップを移動
    item.addEventListener("click", () => {
      map.panTo(place.location);
      highlightMarker(markers[index]);
      console.log("highlightMarkerが呼ばれた");
    });
  });
}

export function initSearchBox() {
  const btn = document.getElementById("searchBtn");
  const input = document.getElementById("address");
  console.log("検索ボタンアクションが呼ばれました");

  if (btn && input) {
    btn.addEventListener("click", () => {
      // #入力欄に入れられた文字を取得し、前後の空白を削除してvalueに入れる
      const value = input.value.trim();
      // #valueに値があればsearchExactPlace関数を実行
      if (value) {
        searchExactPlace(value);
      }
    });
  }
}

export function clearSearchMarkersOnRouteDraw() {
  const walkBtn = document.getElementById("walkDrawRoute");
  const carBtn = document.getElementById("carDrawRoute");

  const clearMarkers = () => {
    if (window.markers && window.markers.length > 0) {
      window.markers.forEach(marker => marker.setMap(null));
      window.markers = [];
      console.log("検索マーカーを消しました");
    }
  };
  if (walkBtn) walkBtn.addEventListener("click", clearMarkers);
  if (carBtn) carBtn.addEventListener("click", clearMarkers);
}
