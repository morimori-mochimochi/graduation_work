console.log("navigation.jsを始めます");

import { fetchCurrentPos } from "./current_pos";

export function restoreDirections() {
  const storedDirections = sessionStorage.getItem("directionsResult");
  if (!storedDirections) {
    alert("ルートを設定してください");
    return;
  }
    window.directionsResult = JSON.parse(storedDirections);
    console.log("フルリロード後に directionsResult 復元:", window.directionsResult);
    startNavigation();
}

async function updateNavigation() {
  const pos = await fetchCurrentPos();
  console.log("updateNavigation:", pos);
}

// #現在地マーカー
let currentMarker;
// #watchIdは位置情報の監視プロセスを識別する番号
let watchId;
// #stepIndexはDirectionsResult内の経路をどのステップまで進んだか管理する番号
let stepIndex = 0;

export function startNavigation() {
  console.log("★ startNavigation開始 window.directionsResult", window.directionsResult);
  if (!window.directionsResult) {
    alert("ルートが設定されていません");
    return;
  }

  // #最初のルート情報を取得
  const route = window.directionsResult.routes[0].legs[0];
  const steps = route.steps;

  // #現在地の追跡開始
  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      //fetchNavigaitonを内部で呼ぶ
      updateNavigation().then((latestPos) =>{
        //updateNavigationが返した現在地をマーカに設定
        const currentPos = latestPos;

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
      });      

      // #現在地と次のステップの目的地との直線距離を計算
      const nextStep = steps[stepIndex].end_location;
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(currentPos),
        nextStep
      );

      // #次のステップに近づいたら進める
      if (distance < 30 && stepIndex < steps.length - 1) {
        stepIndex++;
        console.log("次のステップへ進みます:", steps[stepIndex].instructions);
      }
    },
    (err) => {
      console.error("位置情報の取得に失敗しました: ", err);
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );
}
function stopNavigation() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  // 現在地マーカーを消す
  if (currentMarker) {
    currentMarker.setMap(null);
    currentMarker = null;
  }
}
