let isInitialized = false;

export function initRouteInformation() {
  console.log("ルート情報を表示します");

  document.addEventListener('relayPointsRenderd', (event) => {

    if (isInitialized) return;
    isInitialized = true;
  
    const routeData = window.routeData;
    console.log("routeData:", routeData);

    if (!routeData || typeof routeData.total_distance === 'undefined' || typeof routeData.total_duration === 'undefined') {
      return;
    }

    const routeContainer = document.getElementById("routeContainer");
    if (!routeContainer) return;

    routeContainer.innerHTML = '';

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

      const calorieEl = clone.querySelector('.calorie-burned');
      if (calorieEl) {
        calorieEl.textContent = `${(distanceKm * 0.5 * 50).toFixed(0)} kcal`;
      }

      const gasConsumptionEl = clone.querySelector('.gas-consumption');
      if (gasConsumptionEl) {
        // ガソリン消費量を計算（リッターあたり15kmの時）
        const gasConsumption = (distanceKm / 15).toFixed(2);
        gasConsumptionEl.textContent = `${gasConsumption} L`;
      }

      routeContainer.appendChild(clone);
    }
  });
}