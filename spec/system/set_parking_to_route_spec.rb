require 'rails_helper'

RSpec.describe "駐車場を含めたルートを作成する", type: :system, js: true do
  it "車で移動する際、目的地周辺の駐車場を検索し、駐車場までは車のルート、駐車場から目的地までは徒歩のルートを提案する" do
    #1. トップページにアクセスし、車ルート作成ページに移動
    visit root_path
    find("a[href='#{new_route_path}']").click
    find("a[href='#{car_routes_path}']").click

    expect(page).to have_current_path(car_routes_path, ignore_query: true)
    expect(page).to have_selector('#map')

    #2. 出発地と目的地を擬似的に設定
    start_location = { lat: 35.6812, lng: 139.7671 }.to_json
    destination_location = { lat: 35.6586, lng: 139.7454 }.to_json

    #3. 目的地周辺の駐車場を検索し、最初の駐車場を選択する
    page.evaluate_async_script(<<~JS, start_location, destination_location)
      // parseはJSONを実際に使えるJSオブジェクトに変換するためのコード
      const start_location = JSON.parse(arguments[0]);
      const destination_location = JSON.parse(arguments[1]);
      const done = arguments[2];

      window.mapApiLoaded.then(async () => {
        try {
          // 出発地と目的地をグローバル変数にセット
          window.routeStart = new google.maps.LatLng(start_location);
          window.routeDestination = new google.maps.LatLng(destination_location);

          if (typeof window.searchParking !== 'function') {
            done("Error: window.searchParking is not a function");
            return;
          }
          document.getElementById('searchNearby').click();

          // searchParking()の初期化とイベントリスナ登録を待つ
          await new Promise(res => setTimeout(res, 100)); // 念のため少し待つ

          // 駐車場検索APIのレスポンスとマーカー描画を待つ
          setTimeout(() => {
            if (!window.parkingMarkers || window.parkingMarkers.length === 0) {
              done("No parking markers found");
              return;    
            }
            // 最初の駐車場マーカーをクリック
            google.maps.event.trigger(window.parkingMarkers[0], 'click');
            
            // Infowindowの描画を待ち、「ここに駐車する」ボタンをクリック
            // setTimeout(() => {}, x) xの後に{}を実行する 
            setTimeout(() => {
              const setParkingBtn = document.getElementById('setParking');
              if (!setParkingBtn) {
                done("Set parking button not found in InfoWindow");
                return;
              }
              setParkingBtn.click();
              done();
            }, 500);
          }, 1500);
        } catch (e) {
          console.error("Error during parking search/selection: ", e.message, e.stack);
          done("Error in parking search/selection: " + e.message);
        }
      });
    JS

    # 4.駐車場が設定された後、ルート描画ボタンをクリック
    find("#carDrawRoute").click

    # 5.ルート情報がsessionStorageに保存されるのを待つ
    expect(page).to have_javascript("sessionStorage.getItem('directionsResult')")

    # 6.「ナビ開始」ボタンをクリック
    find("img[alt='startNavi']").click

    # 7.ナビゲーションページに遷移したことを確認
    expect(page).to have_current_path(car_navigation_routes_path)
    expect(page).to have_selector("img[alt='stopNavi']")
  end              
end
