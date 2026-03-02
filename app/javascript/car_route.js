import { fetchCurrentPos } from "./current_pos"
import { initSetTime } from "./set_arrival_time";
import { initResetRouteBtn } from "./reset_route";
import { walkDrawRoute } from "./walk_route";
import { selectRouteModule } from "./select_route";

function isValidLatLng(point) {
  return point && typeof point.lat === 'function' && typeof point.lng === 'function';
}

// クリック判定用の透明ポリラインを管理する配列
window.routeHitLines = [];

export async function carDrawRoute(map = window.map) {
  // 新しいルートを作成する前に、既存のルート情報をsessionStorageから削除
  sessionStorage.removeItem("directionsResult");

  // 既存の車アイコンマーカーをクリア
  if (window.carIconMarker) {
    window.carIconMarker.setMap(null);
    window.carIconMarker = null;
  }

  await window.mapApiLoaded;

  let originPos;
  if (window.routeData.start && window.routeData.start.point) {
    originPos = window.routeData.start.point;
  } else {
    originPos = await fetchCurrentPos();
    window.routeData.start = { point: originPos, name: "現在地" }; // 現在地をrouteDataに保存
  }
  const finalDestination = window.routeData.destination.mainPoint.point;

  if (!finalDestination || !isValidLatLng(finalDestination)) {
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
  
  // 車ルートの経由地リストをアプリケーション側で作成
  const carWaypoints = [];
  
  // 中継点を処理
  window.routeData.waypoints.forEach(wp => {
    // 駐車場が設定されていれば駐車場を、なければ本来の地点を経由地とする
    // これはあったらアクセスする、というエラーを防ぐ書き方
    const location = wp.parkingLot?.point || wp.mainPoint.point;
    if (location && isValidLatLng(location)) {
      carWaypoints.push({
        location: location,
        stopover: true
      });
    }
  });

  // 最終目的地（またはその駐車場）を決定
  const finalCarDestination = window.routeData.destination.parkingLot?.point || finalDestination;

  const request = {
    origin: originPos,
    destination: finalCarDestination,
    waypoints: carWaypoints,
    travelMode: google.maps.TravelMode.DRIVING,
    optimizeWaypoints: false // ユーザーが設定した順序を維持
  };

  try {
    const response = await directionsService.route(request);
    
    // 車ルートを描画
    const carRenderer = new google.maps.DirectionsRenderer({ map: map, polylineOptions: { strokeColor: 'green' } });
    carRenderer.setDirections(response);
    window.carRouteRenderers.push(carRenderer);

    // 車ルートであることを示すアイコンを始点に表示
    const carIcon = {
      // Google Material Icons "directions_car"
      path: 'M18.92 6.01C18.72 5.42 18.15 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 13 17.5 13s1.5.67 1.5 1.5S18.33 16 17.5 16zM5 11l1.5-4.5h11L19 11H5z',
      fillColor: '#4CAF50', // ルートの色(green)に合わせる
      fillOpacity: 1,
      strokeWeight: 1,
      strokeColor: 'white',
      rotation: 0,
      scale: 1.3,
      anchor: new google.maps.Point(12, 12),
    };

    window.carIconMarker = new google.maps.Marker({
      position: originPos,
      map: map,
      icon: carIcon,
      title: '車ルート',
      zIndex: 100 // 他のマーカーより手前に表示
    });

    // 車ルートの総距離と総所要時間を計算
    const route = response.routes[0];
    if (route && route.legs && route.legs.length > 0) {
      let totalDistance = 0;
      let totalDuration = 0;

      route.legs.forEach(leg => {
        totalDistance += leg.distance.value; // 距離をメートルで加算
        totalDuration += leg.duration.value; // 所要時間を秒で加算
      });

      // 計算結果をグローバルなルート情報に保存
      window.routeData.total_distance = totalDistance;
      window.routeData.total_duration = totalDuration;
    }

    // 駐車場から目的地までの徒歩ルートを別途描画
    const walkingRoutes = [];
    // 中継点の徒歩ルート
    window.routeData.waypoints.forEach(wp => {
      if (wp.parkingLot?.point && wp.mainPoint?.point) {
        walkingRoutes.push({ origin: wp.parkingLot.point, destination: wp.mainPoint.point });
      }
    });
    // 最終目的地の徒歩ルート
    if (window.routeData.destination.parkingLot?.point) {
      walkingRoutes.push({ origin: window.routeData.destination.parkingLot.point, destination: finalDestination });
    }

    // 各徒歩ルートを非同期で取得して描画
    // Promise.allを使って全ての非同期処理の完了を待つ
    await Promise.all(walkingRoutes.map(async (walk) => {
      try {
        const walkResponse = await directionsService.route({ ...walk, travelMode: 'WALKING' });
        const walkRenderer = new google.maps.DirectionsRenderer({ map: map, preserveViewport: true, polylineOptions: { strokeColor: 'blue', strokeOpacity: 0.7, strokeWeight: 5 } });
        walkRenderer.setDirections(walkResponse);
        window.carRouteRenderers.push(walkRenderer);
      } catch (e) {
        console.warn("駐車場からの徒歩ルート取得に失敗しました:", e);
      }
    }));

    // 呼び出し元で制御するため、ここでは保存せず結果とレンダラーを返す
    return { status: "OK", response: response, renderers: window.carRouteRenderers };
    
  } catch (error) {
    console.error("ルートの取得に失敗しました:", error);
    alert("ルートの取得に失敗しました: " + (error.message || error));
    throw error;
  }
}
export function drawRouteBtn() {
  const drawRouteBtn = document.getElementById("drawRoute");

  if (drawRouteBtn) {
    drawRouteBtn.addEventListener("click", async() => {
      // 連打防止：処理中はボタンを無効化し、テキストを変更
      // disabledプロパティ: クリックに無反応になる
      drawRouteBtn.disabled = true;
      const originalText = drawRouteBtn.innerHTML;
      drawRouteBtn.textContent = "検索中...";

      try {
        // 既存のクリック判定用ラインを削除
        if (window.routeHitLines) {
          window.routeHitLines.forEach(line => line.setMap(null));
        }
        window.routeHitLines = [];

        const [carResult, walkResult] = await Promise.all([
          carDrawRoute(window.map).catch(e => { 
            console.error("carDrawRoute failed:", e);
            return null; 
          }),
          walkDrawRoute().catch(e => { 
            console.error("walkDrawRoute failed:", e);
            return null; 
          })
        ]);

        // どちらかのルート検索が成功した場合に、初回描画完了イベントを発火
        const successfulResult = (carResult && carResult.status === 'OK') ? carResult : walkResult;
        if (successfulResult && successfulResult.status === 'OK') {
          // sessionStorageへの保存は selectRouteModule 内で行われるため、ここではイベント発火のみ行う
          const event = new CustomEvent('routeDrawn', { detail: { status: 'OK' } });
          document.dispatchEvent(event);
        }

        selectRouteModule(carResult, walkResult);

      } catch (err) {
        console.error("Unexpected error:", err);
        // carDrawRoute内部でalertが出ている場合もあるが、予期せぬエラーに備える
      } finally {
        // 成功・失敗に関わらず、処理終了後にボタンを必ず元の状態に戻す
        drawRouteBtn.disabled = false;
        drawRouteBtn.innerHTML = originalText;
      }
    });
  }else{
  console.warn("drawRouteボタンが存在しません");
  }
}

function initRouteContent() {
  document.addEventListener('routeDrawn', (event) => {
    if (event.detail.status === 'OK') {
      initSetTime();
    }
  });
}

// イベントリスナーを初期化時に一度だけ登録する
initRouteContent();
initResetRouteBtn();

window.carDrawRoute = carDrawRoute;