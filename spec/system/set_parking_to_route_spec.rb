# テスト：　placesAPIの通信がうまくいかないため、最初から出発点、到着点、駐車場の場所を渡すようにした。しかし、search_parkng.jsでは出発地、目的地をクリックで選択して駐車場を探す、をクリックすることで初めて

require 'rails_helper'

RSpec.describe "駐車場を含めたルートを作成する", type: :system, js: true do
  it "車で移動する際、目的地と駐車場を設定し、駐車場までは車のルート、駐車場から目的地までは徒歩のルートを提案する" do
    #1. トップページにアクセスし、車ルート作成ページに移動
    visit root_path

    find("a[href='#{new_route_path}']").click
    find("a[href='#{car_routes_path}']").click

    expect(page).to have_current_path(car_routes_path, ignore_query: true)
    expect(page).to have_selector('#map')

    # 2. JSで出発地・目的地・駐車場の位置情報を直接設定する
    # application.jsの初期化が終わるのを待ってから、干渉するイベントリスナーを無効化する
    page.evaluate_script(<<~JS)
      // application.jsでテスト用に公開された関数を上書きして無効化
      window.testHooks.searchParking = () => { console.log("searchParking is now disabled for testing."); };
      window.testHooks.initMarkerEvents = () => { console.log("initMarkerEvents is now disabled for testing."); };
    JS

    # 3. イベントリスナーを無効化した後、ルート描画に必要な値を設定し、関数を非同期で呼び出し、完了を待つ。
    # carDrawRouteはPromiseを返すasync関数なのでawaitで完了を待ってdone()をよび、Rspecに処理を戻す
    page.evaluate_async_script(<<~JS)
      const done = arguments[0];

      // Google Maps APIのLatLngオブジェクトをモックする
      if (!window.google?.maps?.LatLng) {
        window.google = window.google || {};
        window.google.maps = window.google.maps || {};
        window.google.maps.LatLng = function(obj) {
          const lat = (typeof obj.lat === 'function') ? obj.lat() : obj.lat;
          const lng = (typeof obj.lng === 'function') ? obj.lng() : obj.lng;
          return { lat: () => lat, lng: () => lng, toJSON: () => ({ lat: lat, lng: lng }) };
        };
      }

      // 出発地、目的地、駐車場の設定
      window.routeStart = new google.maps.LatLng({ lat: 35.6812, lng: 139.7671 }); // 東京駅
      window.routeDestination = new google.maps.LatLng({ lat: 35.6586, lng: 139.7454 }); // 東京タワー
      window.routeParking = new google.maps.LatLng({ lat: 35.6590, lng: 139.7450 }); // 目的地の近くの駐車場

      console.log("Before carDrawRoute - routeDestination:", window.routeDestination);
      console.log("Before carDrawRoute - routeParking:", window.routeParking);

      // carDrawRouteを実行
      window.carDrawRoute()
        .then(result => {
          console.log("carDrawRoute finished with:", result);
          done(); // 成功したらテスト再開
        })
        .catch(e => {
          console.error("carDrawRoute failed in test:", e);
          done("carDrawRoute failed: " + (e.message || e)); // 失敗したらエラーメッセージと共にテストを失敗させる
        });
    JS
    
    # 4.ルート情報がsessionStorageに保存されるのを待つ
    expect(page).to have_javascript("sessionStorage.getItem('directionsResult')")

    # 6.「ナビ開始」ボタンをクリック
    find("img[alt='startNavi']").click

    # 7.ナビゲーションページに遷移したことを確認
    expect(page).to have_current_path(car_navigation_routes_path)
    expect(page).to have_selector("img[alt='stopNavi']")
  end              
end
