import { fetchCurrentPos } from "./current_pos";

await window.mapApiLoaded;

export function initMap(mapDiv) {
  const gmap = new google.maps.Map(mapDiv, {
    center: { lat: 35.681236, lng: 139.767125 }, // 即座にマップを表示するために初期値を具体的に設定
    zoom: 15,
    mapId: "56e6f7b7602076fe1ca74db5"
  });

  // callbackとして参照されるようにグローバルへ登録
  window.map = gmap;

  // マップ初期化後に現在地を取得して中心を移動
  fetchCurrentPos().then((pos) => {
    if (pos) {
      gmap.setCenter(pos);
    }
  }).catch((e) => {
    console.warn("現在地の取得に失敗しました", e);
  });
}
