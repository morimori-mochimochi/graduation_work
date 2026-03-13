import { openInfoWindow } from './info_window.js';

let isResultClearListenerAttached = false;

export function highlightMarker(marker, place, duration = 1500) {
  if (!marker) return;

  // InfoWindowを開く
  // set_marker.jsからインポートした関数を呼び出す
  const placeData = {
    name: place.displayName,
    address: place.formattedAddress,
    point: place.location
  };
  openInfoWindow(marker, placeData);

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
    console.log("DB検索を実行中...");
    const response = await fetch(`/locations/search?query=${encodeURIComponent(query)}`);
    if (response.ok) {
      const dbLocations = await response.json();
      console.log("自前DB検索結果: ", dbLocations);
      if (dbLocations.length > 0) {
        // Google Places APIの結果と同じ形式に変換
        const places = dbLocations.map(loc => ({
          location: new google.maps.LatLng(loc.latitude, loc.longitude),
          displayName: loc.name,
          formattedAddress: loc.address,
          isCustom: true, // 自前DBからの結果であることを示すフラグ
          id: loc.id
        }));
        displayPlaces(places);
        return;
      }
    }
  } catch (error) {
    console.error("自前DB検索中にエラーが発生しました: ", error);
  }

  // 2. 自前DBになければGoogle Places APIで検索
  const {Place} = await google.maps.importLibrary("places");
  const center = map.getCenter();

  const request = {
    textQuery: query,
    fields: ["location", "displayName", "formattedAddress", "photos"],
    // #マップの中心周辺５キロのように検索範囲を与える
    locationBias: center,
  };

  // searchByText: Places LibraryのPlaceクラスが提供するメソッド
  const result = await Place.searchByText(request);

  // #結果が一件もなければ終了
  if (!result.places || result.places.length === 0) {
    alert("該当する施設が見つかりませんでした");
    return;
  }

  displayPlaces(result.places);

};

function displayPlaces(places) {
  console.log("places API検索開始");
  const center = map.getCenter();

  // 距離順に並べ替え
  const sortedPlaces = places.sort((a, b) => {
    const distA = google.maps.geometry.spherical.computeDistanceBetween(center, a.location);
    const distB = google.maps.geometry.spherical.computeDistanceBetween(center, b.location);
    return distA - distB;
  });
  
  // 既存のマーカーを整理（ルート上のマーカー以外を削除）
  if (window.markers && window.markers.length > 0) {
    window.markers = window.markers.filter(marker => {
      if (isMarkerSelectedInRoute(marker)) {
        return true;
      } else {
        marker.setMap(null);
        return false;
      }
    });
  } else {
    window.markers = [];
  }

  // 検索結果表示用コンテナの準備
  let container = document.getElementById("resultContainer");
  if (!container) {
    container = createResultContainer();
    const mapDiv = document.getElementById("map");
    mapDiv.parentNode.insertBefore(container, mapDiv.nextSibling);
  } else {
    container.innerHTML = ""; //前回の結果をクリア
  }

  // マーカー作成とリスト表示のループを統合
  sortedPlaces.forEach((place) => {
    // 1. マーカーを作成
    const marker = new google.maps.Marker({
      position: place.location,
      map: map,
      title: place.displayName,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      }
    });
    marker.placeResult = place;
    marker.formattedAddress = place.formattedAddress;
    window.markers.push(marker);

    // 2. リストアイテムを作成
    const item = createResultListItem(place);

    // 3. イベントリスナーの設定（クロージャでmarkerとitemを直接紐付け）
    marker.addListener("click", () => {
      highlightMarker(marker, place);
      item.scrollIntoView({ behavior: "smooth", block: "center" });
      item.style.backgroundColor = "#ffff99";
      setTimeout(() => {
        item.style.backgroundColor = "";
      }, 1500);
    });

    item.addEventListener("click", () => {
      map.panTo(place.location);
      highlightMarker(marker, place);
    });

    container.appendChild(item);
  });

  // 検索結果リストの先頭にスクロール
  if (container && container.children.length > 0) {
    container.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ヘルパー関数: 結果表示用コンテナの作成
function createResultContainer() {
  const container = document.createElement("div");
  container.id = "resultContainer";
  Object.assign(container.style, {
    maxHeight: "200px",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "5px",
    margin: "10px auto",
    width: "90%",
    maxWidth: "700px",
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    textAlign: "center"
  });
  return container;
}

// ヘルパー関数: リストアイテムの作成
function createResultListItem(place) {
  const item = document.createElement("div");
  item.classList.add("result-item");
  Object.assign(item.style, {
    borderBottom: "1px solid #eee",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  });

  // 画像
  if (place.photos && place.photos.length > 0) {
    const img = document.createElement("img");
    img.src = place.photos[0].getURI({ maxWidth: 100, maxHeight: 100 });
    Object.assign(img.style, {
      width: "60px",
      height: "60px",
      objectFit: "cover",
      borderRadius: "4px",
      marginRight: "15px"
    });
    item.appendChild(img);
  }

  const infoDiv = document.createElement("div");
  infoDiv.style.flex = "1";

  // 「保存したスポット」表示
  if (place.isCustom) {
    const savedSpotDiv = document.createElement("div");
    Object.assign(savedSpotDiv.style, {
      display: "flex",
      alignItems: "center",
      marginBottom: "5px"
    });

    const savedIcon = document.createElement("img");
    savedIcon.src = "/images/saved_location.png";
    Object.assign(savedIcon.style, {
      width: "16px",
      height: "16px",
      marginRight: "5px"
    });

    const savedText = document.createElement("span");
    savedText.textContent = "保存したスポット";
    Object.assign(savedText.style, {
      fontSize: "0.8em",
      color: "#666"
    });

    savedSpotDiv.appendChild(savedIcon);
    savedSpotDiv.appendChild(savedText);
    infoDiv.appendChild(savedSpotDiv);
  }

  // 施設名
  const name = document.createElement("h4");
  name.textContent = place.displayName;
  Object.assign(name.style, {
    margin: "0 0 3px 0",
    fontSize: "1em"
  });

  // 住所
  const address = document.createElement("p");
  address.textContent = place.formattedAddress || "";
  Object.assign(address.style, {
    margin: "0",
    fontSize: "0.9em",
    color: "#555"
  });

  infoDiv.appendChild(name);
  infoDiv.appendChild(address);
  item.appendChild(infoDiv);

  return item;
}

export function initSearchBox(container = document) {
  const btn = container.querySelector("#searchBtn");
  const input = container.querySelector("#address");

  if (!btn || !input) {
    console.warn("検索ボックスの要素が見つかりません");
    return;
  }

  // イベントリスナーの重複登録を防止
  if(btn.dataset.searchEventAttached) {
    return;
  }
  btn.dataset.searchEventAttached = "true";
  input.dataset.searchEventAttached ='true';

  const performSearch = () => {
    // #入力欄に入れられた文字を取得し、前後の空白を削除してvalueに入れる
    const value = input.value.trim();
    // #valueに値があればsearchExactPlace関数を実行
    if (value) {
      searchExactPlace(value);
    }
  };

  // 検索ボタンクリックで検索実行
  btn.addEventListener("click", performSearch);

  // Enterキーで検索実行
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // フォームのデフォルト送信を防止
      performSearch();  // ↑送信ボタンを押したときにブラウザが自動的にページ遷移してデータを送る動作        
    }
  });

  if (!isResultClearListenerAttached) {
    document.addEventListener('relayPointsRendered', () => {
      const routeData = window.routeData;
      // ルートが計算され、距離情報が存在する場合のみ検索結果を削除する
      if (routeData && typeof routeData.total_distance !== 'undefined') {
        const resultContainer = document.getElementById("resultContainer");
        if (resultContainer) resultContainer.remove();
      }
    });
    isResultClearListenerAttached = true;
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

// マーカーが現在選択されているルート地点（出発地・目的地・経由地）かどうかを判定する関数
function isMarkerSelectedInRoute(marker) {
  const r = window.routeData;
  if (!r || typeof marker.getPosition !== 'function') return false;
  const position = marker.getPosition();

  const pointsToCheck = [];

  if (r.start && r.start.point) pointsToCheck.push(r.start.point);
  if (r.destination && r.destination.mainPoint && r.destination.mainPoint.point) {
    pointsToCheck.push(r.destination.mainPoint.point);
  }
  if (r.waypoints) {
    r.waypoints.forEach(wp => {
      if (wp.mainPoint && wp.mainPoint.point) pointsToCheck.push(wp.mainPoint.point);
    });
  }

  // マーカーの位置がいずれかの登録地点と一致すればtrue
  // Google Maps APIのLatLng.equalsメソッドを使用
  return pointsToCheck.some(p => p.equals && p.equals(position));
}
