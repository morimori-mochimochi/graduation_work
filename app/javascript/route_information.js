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

    const template = document.getElementById('route-info-template');
    if (template) {
      const clone = template.content.cloneNode(true);

      const distanceEl = clone.querySelector('.route-total-distance');
      if (distanceEl) distanceEl.textContent = `${distanceKm} km`;

      const durationEl = clone.querySelector('.route-total-duration');
      if (durationEl) durationEl.textContent = timeString;

      resultContainer.appendChild(clone);
    }
  });
}