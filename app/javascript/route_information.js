let isInitialized = false;

export function initRouteInformation() {
  if (isInitialized) return;
  isInitialized = true;

  document.addEventListener('relayPointsRendered', () => {
    const routeData = window.routeData;

    if (!routeData || typeof routeData.total_distance === 'undefined' || typeof routeData.total_duration === 'undefined') {
      return;
    }

    let resultContainer = document.getElementById("resultContainer");
    
    // コンテナが存在しない場合は新たに作成
    if (!resultContainer) {
      const mapDiv = document.getElementById("map");
      if (!mapDiv) return;

      resultContainer = document.createElement("div");
      resultContainer.id = "resultContainer";
      resultContainer.style.maxHeight = "200px";
      resultContainer.style.overflowY = "auto";
      resultContainer.style.border = "1px solid #ccc";
      resultContainer.style.padding = "5px";
      resultContainer.style.margin = "10px auto";
      resultContainer.style.width = "90%";
      resultContainer.style.maxWidth = "700px";
      resultContainer.style.backgroundColor = "#FFFFFF";
      resultContainer.style.borderRadius = "8px"; 
      resultContainer.style.textAlign = "center";

      // mapDiv.parentNode（map の親）を基準に
      // mapDiv.nextSibling（map の次の兄弟）の直前に
      // resultContainer を挿入する
      mapDiv.parentNode.insertBefore(resultContainer, mapDiv.nextSibling);
    }

    resultContainer.innerHTML = '';

    // 距離と時間をフォーマット
    const distanceKm = (routeData.total_distance / 1000).toFixed(2);
    // round: 四捨五入
    const totalMinutes = Math.round(routeData.total_duration / 60);
    // floor: 切り捨て
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let timeString = "";
    if (hours > 0) {
      timeString += `${hours}時間`;
    }
    timeString += `${minutes}分`;
    // ルート情報を表示
    const infoHtml = `
      <div class="route-info-content" style="padding: 10px;">
        <h4 style="margin: 0 0 10px 0; font-size: 1.1em; color: #333;">ルート情報</h4>
        <div style="display: flex; justify-content: center; gap: 20px;">
          <div>
            <span style="font-size: 0.9em; color: #666;">総移動距離</span><br>
            <span style="font-size: 1.2em; font-weight: bold;">${distanceKm} km</span>
          </div>
          <div>
            <span style="font-size: 0.9em; color: #666;">所要時間</span><br>
            <span style="font-size: 1.2em; font-weight: bold;">${timeString}</span>
          </div>
        </div>
      </div>
    `;

    resultContainer.innerHTML = infoHtml;
  });
}