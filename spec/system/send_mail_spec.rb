# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '出発時刻通知メール', type: :system, js: true do
  let(:user) { create(:user) }

  before do
    sign_in user
  end

  # 共通のルート設定処理をヘルパーメソッドに切り出し
  def set_route
    start_location = { lat: 35.6812, lng: 139.7671, name: '東京駅' }.to_json
    destination_location = { lat: 35.6586, lng: 139.7454, name: '東京タワー' }.to_json

    page.evaluate_async_script(<<~JS, start_location, destination_location)
      const start_location = JSON.parse(arguments[0]);
      const destination_location = JSON.parse(arguments[1]);
      const done = arguments[2];

      window.mapApiLoaded.then(async () => { // mapApiLoadedを待つ
        const start = new google.maps.LatLng(start_location);
        const destination = new google.maps.LatLng(destination_location);

        window.routeData = {
          start: { point: start, name: start_location.name },
          destination: { mainPoint: { point: destination, name: destination_location.name } },
          waypoints: []
        };
        // 画面にも設定を反映
        document.getElementById('startPoint').textContent = start_location.name;
        document.getElementById('destinationPoint').textContent = destination_location.name;
        // ルート検索を直接実行し、完了を待つ
        await window.walkDrawRoute();
        done(); // walkDrawRouteの完了後にテストを再開
      });
    JS
  end

  it 'ルート保存後に通知設定をすると、出発時刻の通知メールが送信されること' do
    # 1. ルート作成ページにアクセス
    visit root_path
    find("a[href='#{new_route_path}']").click
    find("a[href='#{walk_routes_path}']").click

    expect(page).to have_current_path(walk_routes_path, ignore_query: true)
    expect(page).to have_selector('#map')
     
    # 2. ルートを描画
    set_route

    # ルート描画後に時刻を設定する (値はゼロ埋めされた文字列)
    select '10', from: 'startHour'
    select '30', from: 'startMinute'

    # 3. 到着時刻が計算されていることを確認
    expect(page).to have_javascript("sessionStorage.getItem('directionsResult')")
    expect(find('#startHour').value).not_to eq '時'
    expect(find('#startMinute').value).not_to eq '分'
    expect(find('#destinationHour').value).not_to eq '時'
    expect(find('#destinationMinute').value).not_to eq '分'

    # 4. ルートを保存
    find('#saveRouteBtn').click
    page.accept_alert 'ルートを保存しました'

    # 5. 保存されたルートの詳細ページから編集ページへ
    saved_route = user.reload.save_routes.last
    expect(page).to have_current_path(save_route_path(saved_route))
    click_link '編集'

    # 6. 実行日を今日に設定して更新
    expect(page).to have_current_path(edit_save_route_path(saved_route))

    # fill_inでは日付が '50101-02-02' のように誤って入力されることがあるため、
    # execute_scriptを使用して直接値を設定する
    # 実行前に、対象の要素が表示されるまで待機する
    expect(page).to have_field('save_route_execution_date', type: 'date')

    execute_script("document.getElementById('save_route_execution_date').value = '2025-01-01'")
    click_button '更新'

    # 7. 詳細ページに戻り、「メールで通知」ボタンが表示されていることを確認
    expect(page).to have_current_path(save_route_path(saved_route))
    expect(page).to have_content('ルートを更新しました')
    expect(page).to have_button('メールで通知')

    # 8. メール送信処理を実行し、メールが送信されることを確認
    # ActionMailer::Base.deliveries.clearで、テスト実行前に溜まったメールをクリア
    ActionMailer::Base.deliveries.clear
    # button_toはformを生成するため、確認ダイアログのacceptが必要
    # accept_confirm '出発5分前にメールで通知を設定します。よろしいですか？' do
    click_button 'メールで通知'

    # 日時部分は変動するため、正規表現でメッセージの存在を確認
    # 例: "2024年07月26日 08:55に通知を設定しました。"
    expect(page).to have_content(/に通知を設定しました。/)
    expect(ActionMailer::Base.deliveries.size).to eq 1
  end
end







  