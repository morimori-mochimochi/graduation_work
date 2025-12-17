import { Controller } from "@hotwired/stimulus"
// `initCalendar`をインポートするが、ここでは使わない。
// `initializeCalendar`をインポートしてロジックを再利用する。
// ただし、`calendar_initializer.js`では`initializeCalendar`がエクスポートされていないため、
// このままだとエラーになります。
// 実際には、`calendar_initializer.js`から`initializeCalendar`をエクスポートするか、
// もしくは`initCalendar`を再利用する形にします。
// ここでは、`initCalendar`を再利用する形に修正します。
import { initCalendar } from "./calendar_initializer.js";

// Connects to data-controller="calendar"
export default class extends Controller {
  static values = { events: Array }

  connect() {
    // Stimulusコントローラーがアタッチされた要素をコンテナとして渡す
    initCalendar(this.element.parentElement);
  }
}