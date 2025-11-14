import { fetchCurrentPos } from "./current_pos"

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

  // 駐車場が設定されている場合：車ルートと徒歩ルートを分けて検索
  if (window.routeParking) {
    try {
      // --- 1. 車ルートと徒歩ルートを並行して検索 ---
      const drivingRequest = {
        origin: originPos,
        destination: window.routeParking,
        travelMode: google.maps.TravelMode.DRIVING
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

      // --- 3. 2つのルート情報を1つに結合 ---
      // drivingResponseをベースに、walkingResponseの区間(leg)を追加する
      const combinedResponse = JSON.parse(JSON.stringify(drivingResponse)); // deep copy
      combinedResponse.routes[0].legs.push(walkingResponse.routes[0].legs[0]);

      // 結合したルートの概要（ポリラインと境界ボックス）を再計算
      combinedResponse.routes[0].overview_polyline = {
        points: drivingResponse.routes[0].overview_polyline.points + walkingResponse.routes[0].overview_polyline.points.slice(1)
      };
      const bounds = new google.maps.LatLngBounds();
      combinedResponse.routes[0].legs.forEach(leg => {
        leg.steps.forEach(step => {
          step.path.forEach(point => bounds.extend(new google.maps.LatLng(point.lat, point.lng)));
        });
      });
      combinedResponse.routes[0].bounds = bounds.toJSON();

      // --- 4. 結合したルートを描画・保存 ---
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