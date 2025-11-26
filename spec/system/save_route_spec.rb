# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'ルート保存機能', type: :system, js: true do
  it '車ルートを設定し、ルートを保存できること' do
    visit root_path
    find("a[href='#{new_route_path}']").click
    find("a[href='#{car_routes_path}']").click

    # 2. car.html.erbに遷移し、マップ表示を待つ
    # ignore_query: true はURL の末尾に「?param=value」などのクエリパラメータがついていても無視して比較するという意味。
    expect(page).to have_current_path(car_routes_path, ignore_query: true)
    # マップ表示まで待機
    # Capybaraの待機機能(#mapが表示されるまでデフォルトで数秒待ってくれる)
    expect(page).to have_selector('#map')

    # 3.Javascriptを実行して出発地と目的地を擬似的に設定
    # 実際のマップクリックは不安定になりやすいのでこの方法が堅実
    route_data = {
      start: { point: { lat: 35.6812, lng: 139.7671 } }, # 東京駅
      destination: { mainPoint: { point: { lat: 35.6586, lng: 139.7454 } } }, # 東京タワー
      waypoints: []
    }.to_json

    # evaluate_async_scriptを使い、非同期処理の完了を待つ
    # done.call()が呼ばれるまでテストは待機する
    # <<~JS ... JS (ヒアドキュメント): Rubyの機能で、複数行にわたる文字列を記述するための記法。
    # ここでは、実行したいJavaScriptコード全体を一つの文字列としてexecute_async_scriptメソッドに渡す。
    page.evaluate_async_script(<<~JS, route_data)
      const routeDataFromRuby = JSON.parse(arguments[0]);
      const done = arguments[1];

      window.mapApiLoaded.then(async () => {
          // carDrawRouteが参照するwindow.routeDataをセットアップ
          // Rubyから渡されたデータをGoogle MapsのLatLngオブジェクトに変換
          window.routeData = {
            start: { point: new google.maps.LatLng(routeDataFromRuby.start.point) },
            destination: {
              mainPoint: { point: new google.maps.LatLng(routeDataFromRuby.destination.mainPoint.point) }
            },
            waypoints: routeDataFromRuby.waypoints
          };

          try {
            if (typeof window.carDrawRoute !== 'function'){
              done("Error: window.carDrawRoute is not a function");
              return;
            }
            const result = await window.carDrawRoute();
            done(result); // 成功したら"OK"が返る
          } catch (e) {
            console.error("Error during carDrawRoute execution:", e.message, e.stack);
            done("Error in carDrawRoute: " + e.message);
          }
      });
    JS

    # 5. ルート情報がsessionStorageに保存されるのを待つ
    expect(page).to have_javascript("sessionStorage.getItem('directionsResult')")

    # 7. 保存ボタンをクリックする
    find('#saveRouteBtn').click

    # 8. 「ルートを保存しました」モーダルが表示されることを確認し、閉じる
    begin
      expect(page).to have_content('ルートを保存しました')
    rescue Selenium::WebDriver::Error::UnexpectedAlertOpenError => e
      # 予期せぬアラートが表示された場合の処理。
      # このrescueブロックに来た時点で、何らかのアラートが原因でテストが失敗している。
      begin
        # アラートがまだ存在すれば、テキストを取得して閉じる
        alert_text = page.driver.browser.switch_to.alert.text
        puts "\n--- Unexpected Alert Text: ---\n#{alert_text}\n---------------------------\n"
        page.driver.browser.switch_to.alert.accept
      rescue Selenium::WebDriver::Error::NoSuchAlertError
        # rescueブロックに来るまでの間にアラートが消えてしまった場合。何もしない。
      end
      # 元の例外を再度発生させ、コンソールログを出力させる
      raise e, '予期せぬアラートが原因でテストが失敗しました。', e.backtrace
    end
    click_on 'OK'

    # 9. 保存済みルート一覧ページに遷移する
    find('img[alt="routes_logo"]').click

    # 10. 保存したルートが一覧に表示されていることを確認する
    expect(page).to have_current_path(save_routes_path)
    expected_route_name = "#{Time.zone.now.strftime('%Y-%m-%d')}のルート"
    expect(page).to have_content(expected_route_name)
  end
end