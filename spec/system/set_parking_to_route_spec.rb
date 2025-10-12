require 'rails_helper'

RSpec.describe "駐車場を含めたルートを作成する", type: :system, js: true do
  it "車で移動する際、目的地周辺の駐車場を検索し、駐車場までは車のルート、駐車場から目的地までは徒歩のルートを提案する" do
    #1. トップページにアクセスし、車ルート作成ページに移動
    visit root_path
    find("a[href='#{new_route_path}']").click
    find("a[href='#{car_routes_path}']").click

    expect(page).to have_current_path(car_routes_path, ignore_query: true)
    expect(page).to have_selector('#map')

    page.evaluate_script(<<~JS)
      //未定義の場合に「未定義エラー」にならないように新たに作って空のオブジェクト{}を代入する
      window.google = window.google || {};
      window.google.maps = window.google.maps || {};

      // LatLngクラスをテスト環境で「代替的に定義」
      if (!window.google.maps.LatLng) {
        window.google.maps.LatLng = function(obj) {
          return { 
            lat: function() { return (typeof obj.lat === 'function') ? obj.lat() : obj.lat; },
            lng: function() { return (typeof obj.lng === 'function') ? obj.lng() : obj.lng;}
          };
        };  
      }
      
      window.google.maps.importLibrary = async function(lib) {
        if (lib === 'places'){
          return {
            Place: {
              searchByText: async function(request) {
                console.info('[MOCK]Place.searchByText called with', request);
                return {
                  places: [
                    {
                      location: { lat: request.locationBias.lat, lng: request.locationBias.lng },
                      formattedAddress: 'モック駐車場1',
                      displayName: 'Mock Parking 1'
                    }
                  ]
                };
              }
            }
          };
        }
        return{};
      };
    JS

    # 3. 目的地周辺の駐車場を検索し、最初の駐車場を選択する (リファクタリング後)
    # 3-1. JSで出発地・目的地を設定
    page.execute_script(<<~JS)
      window.routeStart = new google.maps.LatLng({ lat: 35.6812, lng: 139.7671 }); 
      window.routeDestination = new google.maps.LatLng({ lat: 35.6586, lng: 139.7454 });
    JS

    # 3-2. 「駐車場を探す」ボタンをクリック
    find("#searchNearby").click

    # 3-3. 駐車場マーカーがJS内で生成されるのを待つ (Capybaraの待機機能を利用)
    # Google Maps APIのレスポンスに時間がかかる場合があるため、wait時間を長めに設定
    expect(page).to have_javascript("window.parkingMarkers && window.parkingMarkers.length > 0", wait: 10)
    # window.parkingMarkersRendered は search_parking.js 内でマーカー描画後に true になる
    expect(page).to have_javascript("window.parkingMarkersRendered", wait: 10)

    # 3-4. 最初の駐車場マーカーをクリックする (マーカーはDOM要素ではないためJSで実行)
    page.execute_script("google.maps.event.trigger(window.parkingMarkers[0], 'click');")

    # 3-5. InfoWindow内の「ここに駐車する」ボタンをクリック
    # find_buttonはボタンが表示されるまで自動で待機してくれる
    find_button("ここに駐車する").click

    # 3-6. InfoWindowが閉じて、駐車場の位置がJSのグローバル変数にセットされたことを確認
    # これにより、後続の処理が安定する
    expect(page).to have_javascript("window.routeParking")
    # InfoWindowが閉じたことを確認（ボタンがなくなる）
    expect(page).not_to have_button("ここに駐車する")

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
