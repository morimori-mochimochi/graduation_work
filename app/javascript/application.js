// このファイルはアプリケーションのエントリーポイントです。
// 主にbarba.jsやその他のグローバルなスクリプトを読み込みます。
// ページごとの初期化はbarba.jsのフックで行われます。
import "./barba.js";
import "@hotwired/turbo-rails"
import { Collapse } from "bootstrap";
import { initResetRouteBtn } from "./reset_route";

// callapseをバンドル対象と認識させるためのダミーコード
window.Collapse = Collapse;

// DOMContentLoaded で一度だけ実行される処理を定義
document.addEventListener('DOMContentLoaded', () => {
  // アプリケーション全体で一度だけ登録すれば良いイベントリスナーを初期化
  initResetRouteBtn();
});
