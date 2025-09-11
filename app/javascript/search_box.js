
// クリックしたマーカーが大きくなる
export function highlightMarker(marker, duration = 1500) {
  if (!marker) return;

  const originalIcon = marker.getIcon ? marker.getIcon() : null;

  if (originalIcon) {
    const newIcon = { ...originalIcon };
    if (newIcon.scaledSize) {
      newIcon.scaledSize = new google.maps.Size(
        newIcon.scaledSize.width * 1.5,
        newIcon.scaledSize.height * 1.5
      );
    }
    marker.setIcon(newIcon);
  }
  marker.setAnimation(google.maps.Animation.BOUNCE);

  setTimeout(() => {
    if (originalIcon) {
      marker.setIcon(originalIcon);
    }
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
  console.log("検索が実行されました");

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

  console.log("検索結果の並べ替えを行いました");
    
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

  console.log("検索結果をリストで表示しました");

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

    console.log("div要素を作りました");
      
    // 施設名
    const name = document.createElement("h4");
    name.textContent = place.displayName;
    name.style.margin = "0 0 3px 0";

    console.log("h4要素を作りました");

    // 住所
    const address = document.createElement("p");
    address.textContent = place.formattedAddress || "";
    address.style.margin = "0 0 3px 0";
    address.style.fontSize = "0.9em";
    address.style.color = "#555";
    console.log("p要素を作りました");

    // 画像
    let img;
    if (place.photos && place.photos.length > 0) {
      img = document.createElement("img");
      img.src = place.photos[0].getURI({ maxWidth: 100, maxHeight: 100 });
      img.style.display = "block";
      img.style.marginBottom = "3px";

      console.log("画像を挿入しました");
    }

    item.appendChild(name);
    if (img) item.appendChild(img);
    item.appendChild(address);
    container.appendChild(item);

    console.log("HTMLを挿入しました");

    //クリックでマップを移動
    item.addEventListener("click", () => {
      map.panTo(place.location);
      highlightMarker(markers[index]);
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
