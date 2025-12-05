document.addEventListener('DOMContentLoaded', () => {
  const lineLinkageButton = document.getElementById('line-linkage-button');

  // ボタンが存在する場合のみイベントリスナーを設定
  if (lineLinkageButton) {
    lineLinkageButton.addEventListener('click', async (event) => {
      event.preventDefault(); // デフォルトの動作をキャンセル
      try {
        const response = await fetch('<%= new_api_v1_line_linkage_path %>');
        const data = await response.json();
        window.location.href = data.url; // 取得したURLにリダイレクト
      } catch (error) {
        console.error('LINE連携URLの取得に失敗しました:', error);
        alert('LINE連携に失敗しました。もう一度お試しください。');
      }
    });
  }
});