// このファイルはアプリケーションのエントリーポイントです。
// 主にbarba.jsやその他のグローバルなスクリプトを読み込みます。
// ページごとの初期化はbarba.jsのフックで行われます。
import barba from "./barba.js";
import { Collapse } from "bootstrap";

// callapseをバンドル対象と認識させるためのダミーコード
window.Collapse = Collapse;

// DOMContentLoadedがHTMLを全部読み込んだ時にはまだJSで追加されるフラッシュメッセージは存在していないためquerySelectorがnullになってしまう
function fadeOutFlash() {
  const flash = document.querySelector(".flash_message");
  if (!flash) return;

  setTimeout(() => {
    flash.style.transition = "opacity 0.8s"; //フラッシュメッセージが出て3秒後から0.８秒かけて徐々にopacity=０に
    flash.style.opacity = "0";
  }, 3000);
}

// DOMContentLoaded で一度だけ実行される処理を定義
document.addEventListener('DOMContentLoaded', () => {
  // 初回読み込み時の処理を実行
  fadeOutFlash();
});

// Barba遷移後のイベント
barba.hooks.after(() => fadeOutFlash());
