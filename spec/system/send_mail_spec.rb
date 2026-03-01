# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '出発時刻通知メール', type: :system, js: true do
  let(:user) { create(:user) }

  before do
    sign_in user
    # 1. ルート作成ページにアクセス
    visit root_path
    find("a[href='#{car_routes_path}']").click

    expect(page).to have_current_path(car_routes_path, ignore_query: true)

    # デバッグ用: #mapが見つからない（非表示含む）場合、ブラウザのコンソールログを出力する
    unless page.has_selector?('#map')
      puts "========== Browser Logs (send_mail_spec) =========="
      puts page.driver.browser.logs.get(:browser).map(&:message).join("\n") if page.driver.browser.respond_to?(:logs)
      puts "==================================================="
    end

    expect(page).to have_selector('#map')

    page.evaluate_async_script(<<~JS)
      const done = arguments[0];
      const check = () => {
        if (window.map instanceof google.maps.Map) {
          done();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    JS
  end

  # 共通のルート設定処理をヘルパーメソッドに切り出し
  def set_route
    start_location = { lat: 35.6812, lng: 139.7671, name: '東京駅' }.to_json
    destination_location = { lat: 35.6586, lng: 139.7454, name: '東京タワー' }.to_json

    # 実行結果(status)を受け取るように変更
    status = page.evaluate_async_script(draw_route_script, start_location, destination_location)

    # ルート描画が成功('OK')していることを確認。失敗していればここでテストが落ちる。
    expect(status).to eq 'OK'
  end

  def draw_route_script
    <<~JS
      const start_location = JSON.parse(arguments[0]);
      const destination_location = JSON.parse(arguments[1]);
      const done = arguments[2];

      if (!window.mapApiLoaded) {
        done("Error: window.mapApiLoaded is undefined");
        return;
      }

      window.mapApiLoaded.then(async () => { // mapApiLoadedを待つ
        try {
          const start = new google.maps.LatLng(start_location);
          const destination = new google.maps.LatLng(destination_location);

          window.routeData = {
            start: { point: start, name: start_location.name },
            destination: { mainPoint: { point: destination, name: destination_location.name } },
            waypoints: []
          };

          const startEl = document.getElementById('startPoint');
          const destEl = document.getElementById('destinationPoint');
          if (!startEl || !destEl) {
            throw new Error("Start or Destination element not found in DOM");
          }
          startEl.textContent = start_location.name;
          destEl.textContent = destination_location.name;

          // ルート検索を直接実行し、完了を待つ
          if (typeof window.carDrawRoute !== 'function') {
            throw new Error("window.carDrawRoute is not a function");
          }
          const result = await window.carDrawRoute();

          if (result.status == 'OK') {
            window.routeData.travel_mode = 'DRIVING';
            sessionStorage.setItem('directionsResult', JSON.stringify(result.response));
            const event = new CustomEvent('routeDrawn', { detail: { status: 'OK' } });
            document.dispatchEvent(event);
          }
          done(result.status); // carDrawRouteのステータスをRuby側に返してテストを再開
        } catch (e) {
          done("Error: " + e.message);
        }
      }).catch((e) => {
        done("Error in mapApiLoaded: " + e.message);
      });
    JS
  end

  it 'ルート保存後に通知設定をすると、出発時刻の通知メールが送信されること' do
    # 2. ルートを描画
    set_route

    # ルート描画完了後、JSによって時刻が現在時刻に初期化されるのを待つ
    expect(page).to have_field('startHour', with: /\d+/, wait: 10)

    # 3. ルート描画後に時刻を設定する (値はゼロ埋めされた文字列)
    select '10', from: 'startHour'
    select '30', from: 'startMinute'

    # 4. 到着時刻が計算されていることを確認
    expect(find('#startHour').value).to eq '10'
    expect(find('#startMinute').value).to eq '30'
    expect(page).to have_no_select('destinationHour', selected: '時')
    expect(page).to have_no_select('destinationMinute', selected: '分')

    # 4. ルートを保存
    find('#saveRouteBtn').click
    page.accept_alert 'ルートを保存しました'

    # 5. 保存されたルートの詳細ページから編集ページへ
    saved_route = user.reload.save_routes.last
    expect(page).to have_current_path(save_route_path(saved_route))
    find("img[alt='edit']").click

    # 6. 実行日を今日に設定して更新
    expect(page).to have_current_path(edit_save_route_path(saved_route))

    # fill_inでは日付が '50101-02-02' のように誤って入力されることがあるため、
    # execute_scriptを使用して直接値を設定する
    # 実行前に、対象の要素が表示されるまで待機する
    expect(page).to have_field('save_route_execution_date', type: 'date')

    execute_script("document.getElementById('save_route_execution_date').value = '2025-01-01'")
    find("img[alt='update']").click

    # 7. 詳細ページに戻り、「メールで通知」ボタンが表示されていることを確認
    expect(page).to have_current_path(save_route_path(saved_route))
    expect(page).to have_content('ルートを更新しました')

    # 8. メール送信処理を実行し、メールが送信されることを確認
    # ActionMailer::Base.deliveries.clearで、テスト実行前に溜まったメールをクリア
    ActionMailer::Base.deliveries.clear
    # button_toはformを生成するため、確認ダイアログのacceptが必要
    accept_confirm '出発5分前にメールで通知を設定します。よろしいですか？' do
      find("img[alt='mail']").click
    end

    # 日時部分は変動するため、正規表現でメッセージの存在を確認
    # 例: "2024年07月26日 08:55に通知を設定しました。"
    expect(page).to have_content(/に通知を設定しました。/)

    # テスト内でメール送信タスクを直接実行する
    # Rails.application.load_tasksでRakeタスクを読み込む
    Rails.application.load_tasks
    # Rake::Task['notification:send_due'].invokeでタスクを実行
    Rake::Task['notifications:send_due'].invoke

    expect(ActionMailer::Base.deliveries.size).to eq 1
  end
end
