// クリックしたマーカーが大きくなる
export function highlightMarker(marker, duration = 1500) {
  if (!marker) return;
  // 施設の名前を取り出す
  let facilityName = marker.getTitle ? marker.getTitle() : "";
  // 施設の住所を取り出す
  let facilityAddress = marker.placeResult && marker.placeResult.formattedAddress
    ? marker.placeResult.formattedAddress
    : (marker.formattedAddress || "");
    
  // フォールバック: データの種類が足りない時に備えて代替フィールドを順に探す
  if (!facilityAddress && marker.address) facilityAddress = marker.address;
  if (!facilityAddress && marker.label) facilityAddress = marker.label;

  // <template>からInfoWindowのコンテンツを作成
  // cloneNode(false) → 要素自体だけコピー（中身の子要素はコピーしない）
	// cloneNode(true) → 要素 とその子要素すべて を再帰的にコピー
  const template = document.getElementById('info-window-template');
  const content = template.content.cloneNode(true);

  //動的な値を埋め込む
  content.querySelector('.info-window-facility-name').textContent = facilityName;
    
  // 既存のInfoWindowを閉じる
  if (window.activeInfoWindow) {
    window.activeInfoWindow.close();
  }

  const infoWindow = new google.maps.InfoWindow({
    content: content
  });
  infoWindow.open(marker.getMap(), marker);
  window.activeInfoWindow = infoWindow;

  //ボタンクリックベントを設定
  google.maps.event.addListenerOnce(infoWindow, "domready", function() {
    const start_btn = document.querySelector(".info-window-set-start");
    const destination_btn = document.querySelector(".info-window-set-destination");
    const route_btn = document.querySelector(".info-window-route-btn");
    const dropdown_menu = document.querySelector(".info-window-dropdown-menu");
    const save_btn = document.querySelector(".info-window-save-location");

    if (start_btn) {
      start_btn.addEventListener("click", function() {
        window.routeStart = marker.getPosition ? marker.getPosition() : marker.position;

        const uiStart = document.getElementById("startPoint"); 
        if (uiStart) {
          uiStart.textContent = facilityName || "選択した場所";
        }
        infoWindow.close();
      });
    }

    if (destination_btn) {
      destination_btn.addEventListener("click", function() {
        window.routeDestination = marker.getPosition ? marker.getPosition() : marker.position;

        const uiDest = document.getElementById("destinationPoint");
        if (uiDest) {
          uiDest.textContent = facilityName || "選択した場所";
        }
        infoWindow.close();
      });
    }

    if (route_btn) {
      route_btn.addEventListener("click", (e) => {
        e.stopPropagation(); // イベントの伝播を停止
        dropdown_menu.hidden = !dropdown_menu.hidden;
      });
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
  // 1. 自前DBを検索
  // encodeはフォームに入力された日本語によって
  // URLが壊れないよう安全な形に変換する
  try {
    const response = await fetch (`/locations/search?query=${encodeURIComponent(query)}`);
    if (response.ok) {
      const locations = await response.json();
      if (locations.length > 0) {
      // Google Places APIの結果と同じ形式に変換
      const places = locations.map(loc => ({
        location: new google.maps.LatLng(loc.latitude, loc.longitude),
        displayName: loc.name,
        formattedAddress: loc.address,
        isCustom: true // 自前DBからの結果であることを示すフラグ
      }));
      displayPlaces(places);
      return;
      }
    }
  } catch (error) {
    console.error("自前DB検索中にエラーが発生しました: ", error);
  }

  // 2. 自前DBになければGoogle Places APIで検索
  console.log("自前DBにないため、Google Places APIで検索します。");

  const {Place} = await google.maps.importLibrary("places");
  const center = map.getCenter();

  const request = {
    textQuery: query,
    fields: ["location", "displayName", "formattedAddress", "photos"],
    // #マップの中心周辺５キロのように検索範囲を与える
    locationBias: center,
  };

  const result = await Place.searchByText(request);

  // #結果が一件もなければ終了
  if (!result.places || result.places.length === 0) {
    alert("該当する施設が見つかりませんでした");
    return;
  }

  displayPlaces(result.places);

};

function displayPlaces(places) {
  const center = map.getCenter();

  // 距離順に並べ替え
  const sortedPlaces = places.sort((a,b) => {
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
    // placeオブジェクトの情報をmarkerに紐付ける
    marker.placeResult = place;
    marker.formattedAddress = place.formattedAddress;
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
    container.style.backgroundColor = "#FFFFFF";
    container.style.borderRadius = "8px"; 

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

    // 新たにdivを作り、クラス名をresult-itemにする
    const item = document.createElement("div");
    item.classList.add("result-item");
    item.style.borderBottom = "1px solid #eee";
    item.style.padding = "5px";
    item.style.cursor = "pointer";
      
    // 自前DBからの結果の場合、「保存したスポット」アイコンとテキストを表示
    if (place.isCustom) {
      const savedSpotDiv = document.createElement("div");
      savedSpotDiv.style.display = "flex";
      savedSpotDiv.style.alignItems = "center";
      savedSpotDiv.style.marginBottom = "5px";

      const savedIcon = document.createElement("img");
      // Railsのアセットパイプライン経由で画像を参照します
      savedIcon.src = "/images/saved_location.png"; 
      savedIcon.style.width = "16px";
      savedIcon.style.height = "16px";
      savedIcon.style.marginRight = "5px";

      const savedText = document.createElement("span");
      savedText.textContent = "保存したスポット";
      savedText.style.fontSize = "0.8em";
      savedText.style.color = "#666";
      
      savedSpotDiv.appendChild(savedIcon);
      savedSpotDiv.appendChild(savedText);
      item.appendChild(savedSpotDiv);
    }

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
      highlightMarker(window.markers[index]);
    });
  });
}

export function initSearchBox() {
  const btn = document.getElementById("searchBtn");
  const input = document.getElementById("address");

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
    }
  };
  if (walkBtn) walkBtn.addEventListener("click", clearMarkers);
  if (carBtn) carBtn.addEventListener("click", clearMarkers);
}
