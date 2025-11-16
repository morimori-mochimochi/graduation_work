# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'ナビゲーション機能', type: :system, js: true do
  it '車ルートを設定し、ナビゲーションを開始できること' do
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
    # 6.「ナビ開始」ボタンをクリック
    # 画像にリンクが設定されているためaltテキストで検索する
    find("img[alt='startNavi']").click

    # 7. ナビゲーションページに遷移したことを確認
    expect(page).to have_current_path(car_navigation_routes_path)
    expect(page).to have_selector("img[alt='stopNavi']")
  end
end
