require 'rails_helper'

RSpec.describe "ナビゲーション機能", type: :system do
    it "徒歩ルートを設定し、ナビゲーションを開始できること" do
        # 1. トップページにアクセスし、「ルート作成」ボタンをクリックして徒歩ルート作成ページへ遷移
        visit root_path
        find("a[href='#{new_route_path}']").click
        find("a[href='#{walk_routes_path}']").click

        # 2. walk.html.erbに遷移し、マップ表示を待つ
        # ignore_query: true はURL の末尾に「?param=value」などのクエリパラメータがついていても無視して比較するという意味。
        expect(page).to have_current_path(walk_routes_path,ignore_query: true)
        # マップ表示まで待機
        # Capybaraの待機機能(#mapが表示されるまでデフォルトで数秒待ってくれる)
        expect(page).to have_selector('#map')

        # 3.Javascriptを実行して出発地と目的地を擬似的に設定
        # 実際のマップクリックは不安定になりやすいのでこの方法が堅実
        start_location = { lat: 35.6812, lng: 139.7671 }.to_json #東京駅
        destination_location = { lat: 35.6586, lng: 139.7454 }.to_json #東京タワー

        page.execute_script("window.mapApiLoaded.then(() => {window.routeStart = new google.maps.LatLng(#{start_location}); window.routeDestination = new google.maps.LatLng(#{destination_location}); })")

        # 4. ルート検索を実行
        # ボタンクリックをシミュレートする代わりに、walkDrawRoute関数を直接実行する。
        # これにより、テストコードとアプリケーションの連携が確実になる。
        page.execute_script("walkDrawRoute(window.routeStart, window.routeDestination);")

        # 5. ルート情報がsessionStorageに保存されるのを待つ
        expect(page).to have_javascript("sessionStorage.getItem('directionsResult')")
        # 6.「ナビ開始」ボタンをクリック
        # 画像にリンクが設定されているためaltテキストで検索する
        find("img[alt='startNavi']").click

        # 7. ナビゲーションページに遷移したことを確認
        expect(page).to have_current_path(walk_navigation_routes_path)
        expect(page).to have_selector("img[alt='stopNavi']")
    end
end