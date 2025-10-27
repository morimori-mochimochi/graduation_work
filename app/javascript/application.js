// このファイルはアプリケーションのエントリーポイントです。
// 主にbarba.jsやその他のグローバルなスクリプトを読み込みます。
// ページごとの初期化はbarba.jsのフックで行われます。

import "./barba";
import barba from "@barba/core";

// DOMContentLoadedがHTMLを全部読み込んだ時にはまだJSで追加されるフラッシュメッセージは存在していないためquerySelectorがnullになってしまう
function fadeOutFlash() {
  const flash = document.querySelector(".flash_message");
  if (!flash) return;

  setTimeout(() => {
    flash.style.transition = "opacity 0.8s"; //フラッシュメッセージが出て3秒後から0.８秒かけて徐々にopacity=０に
    flash.style.opacity = "0";
  }, 3000);
}

// 初回読み込み時とページ遷移後の両方で実行
document.addEventListener("DOMContentLoaded", fadeOutFlash);
barba.hooks.after(() => fadeOutFlash());
