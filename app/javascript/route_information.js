export function InitRouteInformation() {
  
  console.log("ルート情報を表示します");

  document.addEventListener('click', function() {

    console.log("initRouteInformationが呼び出されました");
  
    const routeData = window.routeData;
    console.log("routeData:", routeData);

    if (!routeData || typeof routeData.total_distance === 'undefined' || typeof routeData.total_duration === 'undefined') {
      return;
    }
  });
}

export function openRouteInformation(routeData) {
  const template = document.getElementById('route-info-template');
  const content = template.content.cloneNode(true);

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