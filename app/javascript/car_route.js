import { fetchCurrentPos } from "./current_pos"

function isValidLatLng(point) {
  return point && typeof point.lat === 'function' && typeof point.lng === 'function';
}

export async function carDrawRoute(start, destination) {
  await window.mapApiLoaded;

  const originPos = start || window.routeStart || await fetchCurrentPos();
  const finalDestination = destination || window.routeDestination;

  if (!finalDestination) {
    const errorMessage = "目的地を選択してください";
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  // 既存のルート描画をクリア
  if (window.carRouteRenderers) {
    window.carRouteRenderers.forEach(renderer => renderer.setMap(null));
  }
  window.carRouteRenderers = [];

  const directionsService = new google.maps.DirectionsService();

  // 複数の中継点を設定
  const waypoints = [];
  if (Array.isArray(window.relayPoints)) {
    window.relayPoints.forEach(relayPoint => {
      // relayPointオブジェクトから位置情報を取り出す
      const point = relayPoint.position;
      // Google Maps APIが解釈できる形式かチェック
      if (isValidLatLng(point)) {
        waypoints.push({
          location: point,
          stopover: true 
        });
      }
    });
  }

  // 駐車場が設定されている場合：車ルートと徒歩ルートを分けて検索
  if (window.routeParking) {
    try {
      // --- 1. 車ルートと徒歩ルートを並行して検索 ---
      const drivingRequest = {
        origin: originPos,
        destination: window.routeParking,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: waypoints, // 中継点を追加
        optimizeWaypoints: true // 中継点の順序を最適化
      };
      const walkingRequest = {
        origin: window.routeParking,
        destination: finalDestination,
        travelMode: google.maps.TravelMode.WALKING
      };

      // Promise.allで2つのリクエストを同時に実行
      const [drivingResponse, walkingResponse] = await Promise.all([
        directionsService.route(drivingRequest),
        directionsService.route(walkingRequest)
      ]);

      // --- 3. 2つのルート情報を安全に結合 ---
      // JSON.parse(JSON.stringify(...)) はクラス情報を破壊するため使用しない
      const combinedResponse = drivingResponse;
      const drivingLeg = drivingResponse.routes[0].legs[0];
      const walkingLeg = walkingResponse.routes[0].legs[0];

      // 徒歩ルートの区間(leg)を車ルートに追加
      combinedResponse.routes[0].legs.push(walkingLeg);

      // 概要情報（距離、時間）を合算
      // routes[0].legs[0] は書き換えず、routes[0]の概要(overview)を更新するのが安全
      const combinedSummary = {
        distance: {
          text: `${((drivingLeg.distance.value + walkingLeg.distance.value) / 1000).toFixed(1)} km`,
          value: drivingLeg.distance.value + walkingLeg.distance.value
        },
        duration: {
          text: `${Math.ceil((drivingLeg.duration.value + walkingLeg.duration.value) / 60)} 分`,
          value: drivingLeg.duration.value + walkingLeg.duration.value
        }
      };
      // 結合したルートの概要として新しいサマリーを割り当てる
      combinedResponse.routes[0].summary = `合計: ${combinedSummary.distance.text}`;
      // boundsやoverview_polylineはRendererが自動で再計算するので、手動での結合は不要

      // 結合したルートを描画・保存
      // 1つのRendererで結合したルートを描画する
      const combinedRenderer = new google.maps.DirectionsRenderer({
        map: window.map,
      });
      combinedRenderer.setDirections(combinedResponse);
      window.carRouteRenderers.push(combinedRenderer);

      // 結合した結果をナビゲーション用に保存
      window.directionsResult = combinedResponse;
      sessionStorage.setItem("directionsResult", JSON.stringify(combinedResponse));

      // カスタムイベントを発行
      const event = new CustomEvent('routeDrawn', { detail: { status: 'OK', response: combinedResponse } });
      document.dispatchEvent(event);

      return "OK";

    } catch (error) {
      console.error("複合ルートの取得に失敗しました:", error);
      alert("ルートの取得に失敗しました: " + (error.message || error));
      throw error;
    }

  } else { // 駐車場が設定されていない場合：目的地まで車で直行
    const request = {
      origin: originPos,
      destination: finalDestination,
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: waypoints, // 中継点を追加
      optimizeWaypoints: true // 中継点の順序を最適化
    };
    try {
      const response = await directionsService.route(request);
      const renderer = new google.maps.DirectionsRenderer({ map: window.map });
      renderer.setDirections(response);
      window.carRouteRenderers.push(renderer);
      window.directionsResult = response;
      sessionStorage.setItem("directionsResult", JSON.stringify(response));
      const event = new CustomEvent('routeDrawn', { detail: { status: 'OK', response: response } });
      document.dispatchEvent(event);
      return "OK";
    } catch (error) {
      console.error("ルートの取得に失敗しました:", error);
      alert("ルートの取得に失敗しました: " + (error.message || error));
      throw error;
    }
  }
}
export function carRouteBtn() {
  const carDrawRouteBtn = document.getElementById("carDrawRoute");

  if (carDrawRouteBtn) {
    carDrawRouteBtn.addEventListener("click", async() => {
      try {
        await carDrawRoute();
      } catch (err) {
        console.error("carDrawRoute failed:", err); //コード中で発生したエラーをログに記録する
      }
    });
  }else{
  console.warn("carDrawRouteボタンが存在しません");
  }
}

window.carDrawRoute = carDrawRoute;