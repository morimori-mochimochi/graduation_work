// Stimulusは、HTMLとJavaScriptをうまく連携させるためのフレームワーク
// HTMLに data-controller="コントローラー名" という特別な属性を書くだけで、
// 対応するJSファイル（この場合は calendar_controller.js）を自動で読み込んで実行してくれる。
import { Controller } from "@hotwired/stimulus"
// `initCalendar`をインポートするが、ここでは使わない。
// `initializeCalendar`をインポートしてロジックを再利用する。
import { initCalendar } from "./calendar_initializer.js";

// 「これはStimulusのコントローラーですよ」という宣言.お決まりの書き方
export default class extends Controller {
  // これはStimulusの機能で、HTML側からデータを受け取るための設定
  static values = { events: Array }
  //このコントローラーがHTML要素に接続された時に自動実行される
  connect() {
    // Stimulusコントローラーがアタッチされた要素をコンテナとして渡す
    initCalendar(this.element.parentElement);
  }
}