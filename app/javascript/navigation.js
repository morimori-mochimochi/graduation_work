console.log("navigation.jsを始めます");

import { fetchCurrentPos } from "./current_pos";

// #現在地マーカー
let currentMarker;
// #watchIdは位置情報の監視プロセスを識別する番号
let watchId;
// #stepIndexはDirectionsResult内の経路をどのステップまで進んだか管理する番号
let stepIndex = 0;

export function stopNavigation() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    console.log("ナビゲーションを停止しました");
  }

  //描画されたルートを消す
  if (window.directionsRenderer) {
    window.directionsRenderer.setMap(null);
  }

  //現在地マーカーを消す
  if (currentMarker) {
    currentMarker.setMap(null);
    currentMarker = null;
  }
}

function showArrivalMessage() {
  const ids=["arrivalMessage", "arrivalMessageCar"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.classList.remove('hidden');
    setTimeout(() => {
      el.classList.add('opacity-100');
    }, 10);
    console.log("到着メッセージを表示しました");
  })
}

export async function startNavigation() {
  //既存のナビがあれば停止
  stopNavigation();
  stepIndex = 0;

  // sessionStorageから直接データを取得する
  const storedDirections = sessionStorage.getItem("directionsResult");

  // データがない場合は処理を中断
  if (!storedDirections) {
    alert("ルートが設定されていません");
    return;
  }

  try {
    //まず現在地を取得して地図をそこにズームする
    const initialPos = await fetchCurrentPos();
    if (initialPos) {
      window.map.panTo(initialPos);
      window.map.setZoom(20);
    }
  } catch (error) {
    console.error("初期位置の取得に失敗しました:", error);
  }

  // JSON文字列をオブジェクトに変換
  const directionsResult = JSON.parse(storedDirections);
  console.log("★ startNavigation開始:", directionsResult);

  // DirectionsRendererを初期化し、ルートを描画する
  if (!window.directionsRenderer) {
    window.directionsRenderer = new google.maps.DirectionsRenderer({
      //suppressMarkers: true, //ナビ中の始点、終点のマーカーを非表示にする
      preserveViewport: true, //ルート描画中に地図の表示領域を維持する
    });
  }
  window.directionsRenderer.setMap(window.map);
  window.directionsRenderer.setDirections(directionsResult);

  // #最初のルート情報を取得
  const route = directionsResult.routes[0].legs[0];
  const steps = route.steps;

  // #現在地の追跡開始
  watchId = navigator.geolocation.watchPosition(
    (pos) => { // asyncは不要に
      // watchPositionのコールバック引数から直接位置情報を取得
      const currentPos = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

       // #最初の一回はマーカーを作成。それ以降はそれを更新
      if (!currentMarker) {
        currentMarker = new google.maps.Marker({
          position: currentPos,
          map: window.map,
          title: "現在地",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: "#00F",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFF"
          }
        });
      }else{
        currentMarker.setPosition(currentPos);
      }  
      // #マップを追従
        window.map.panTo(currentPos);

      // #現在地と次のステップの目的地との直線距離を計算
      const nextStep = steps[stepIndex].end_location;
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(currentPos),
        nextStep
      );

      // #次のステップに近づいたら進める
      if (distance < 30) {
        if (stepIndex < steps.length -1) {
          stepIndex++;
          console.log("次のステップへ進みます:", steps[stepIndex].instructions);
        }else{
          //最終目的地に到着
          console.log("目的地に到着しました。ナビを終了します。");
          stopNavigation();
          showArrivalMessage();
        }
      }
    },            
    (err) => {
      console.error("位置情報の取得に失敗しました: ", err);
      stopNavigation();
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );
}
