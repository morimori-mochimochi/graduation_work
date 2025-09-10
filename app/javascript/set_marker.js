console.log("set_marker module loaded");

export async function initMarkerEvents() {
  console.log("マーカーイベントが発火しました");

  // マップ生成完了まで待機
  await window.mapApiLoaded;
    
  // #生成済みマップを取得
  const map = window.map;
  console.log("生成済みマップを取得しました");

  if (!map) {
    console.warn("地図が読み込まれていません");
    return;
  }

  console.log("addListener前のmapの型:", window.map.constructor.name);
  console.log("addListenerの有無: ", typeof window.map.addListener);

  // #マーカーが無い、という初期状態を作る
  let selectedMarker = null;

  // #マップクリックでマーカー配置
  google.maps.event.addListener(window.map, "click", (event) => {
    console.log("マーカーが置かれました");
    
  // #既存のマーカーを削除
    if (selectedMarker) {
      selectedMarker.setMap(null);
    }

  // #新しいマーカーを配置
    selectedMarker = new google.maps.marker.AdvancedMarkerElement({
      position: event.latLng,
      map: map,
      title: "選択地点"
    });
    
  // #検索用に座標を保存
    window.searchCenter = event.latLng;
  });
};
