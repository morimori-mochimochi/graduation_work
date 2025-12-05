export function initLineLinkageButton(container) {
  // 指定されたコンテナ内からボタンを探す
  const lineLinkageButton = container.querySelector('#line-linkage-button');

  // ボタンが存在する場合のみイベントリスナーを設定
  if (lineLinkageButton) {
    // data属性からAPIパスを取得
    const apiUrl = lineLinkageButton.dataset.apiUrl;
    if (!apiUrl) {
      console.error('LINE連携ボタンに data-api-url 属性がありません。');
      return;
    }

    lineLinkageButton.addEventListener('click', async (event) => {
      event.preventDefault(); // デフォルトの動作をキャンセル
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        window.location.href = data.url; // 取得したURLにリダイレクト
      } catch (error) {
        console.error('LINE連携URLの取得に失敗しました:', error);
        alert('LINE連携に失敗しました。もう一度お試しください。');
      }
    });
  }
}