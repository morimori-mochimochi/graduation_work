require 'rails_helper'

RSpec.describe "駐車場を含めたルートを作成する", type: :system, js: true do
  it "車で移動する際、目的地周辺の駐車場を検索し、駐車場までは車のルート、駐車場から目的地までは徒歩のルートを提案する" do
    #1. トップページにアクセスし、車ルート作成ページに移動
    visit root_path

    find("a[href='#{new_route_path}']").click
    find("a[href='#{car_routes_path}']").click

    expect(page).to have_current_path(car_routes_path, ignore_query: true)
    expect(page).to have_selector('#map')

    # 2. Google Maps APIの主要な機能をモックする
    # 実際のAPIコールを防ぎ、テストを安定させる
    page.evaluate_script(<<~JS)
      window.google = window.google || {};
      window.google.maps = window.google.maps || {};
      window.google.maps.LatLng = function(obj) {
        const lat = (typeof obj.lat === 'function') ? obj.lat() : obj.lat;
        const lng = (typeof obj.lng === 'function') ? obj.lng() : obj.lng;
        return { lat: () => lat, lng: () => lng };
      };
      window.google.maps.marker = {
        AdvancedMarkerElement: function(opts) {
          return {
            map: opts.map,
            position: opts.position,
            content: opts.content,
            addListener: (event, callback) => {},
            setMap: (map) => {}
          };
        }
      };
      window.google.maps.InfoWindow = function() {
        return {
          open: () => {},
          close: () => {},
          setContent: () => {},
          addListenerOnce: (event, callback) => {
            if (event === 'domready') {
              // InfoWindow内のボタンがクリック可能になるように、即座にコールバックを実行
              callback();
            }
          }
        };
      };
      window.google.maps.event = {
        trigger: (instance, eventName, ...args) => {
          // マーカークリックをシミュレートするために、リスナーを直接呼び出す
          if (instance && instance.listeners && instance.listeners[eventName]) {
            instance.listeners[eventName](...args);
          }
        },
        addListenerOnce: (instance, eventName, callback) => {
          if (instance && instance.addListenerOnce) {
            instance.addListenerOnce(eventName, callback);
          }
        }
      };
    JS

    # 3. 目的地周辺の駐車場を検索し、最初の駐車場を選択する
    # 3-1. JSで出発地・目的地を設定
    page.execute_script(<<~JS)
      window.routeStart = new google.maps.LatLng({ lat: 35.6812, lng: 139.7671 }); 
      window.routeDestination = new google.maps.LatLng({ lat: 35.6586, lng: 139.7454 });
    JS

    # 3-2. 「駐車場を探す」ボタンをクリック
    # このクリックにより search_parking.js 内のイベントリスナーが発火する
    find("#searchNearby").click

    # 3-3. Place.searchByText をモックし、非同期処理の完了を待つ
    # evaluate_async_script を使い、テストがブラウザのJS実行完了を待つようにする
    page.evaluate_async_script(<<~JS)
      const done = arguments[0];
      // search_parking.js が google.maps.importLibrary を呼び出すのを乗っ取る
      window.google.maps.importLibrary = async (lib) => {
        if (lib === 'places') {
          console.log('[MOCK] Intercepted importLibrary("places")');
          return {
            Place: {
              searchByText: async (request) => {
                console.log('[MOCK] Place.searchByText called with:', request);
                // 実際のAPIのレスポンス形式に合わせたモックデータを返す
                return {
                  places: [{
                    location: new google.maps.LatLng(request.locationBias),
                    formattedAddress: 'モック駐車場1',
                    displayName: 'Mock Parking 1'
                  }]
                };
              }
            }
          };
        }
        // 他のライブラリは空のオブジェクトを返す
        return {};
      };
      // search_parking.js内のマーカー描画が完了したことを示すフラグを待つ
      // これにより、非同期処理が完了したことを確実に捕捉できる
      const interval = setInterval(() => {
        if (window.parkingMarkersRendered) {
          clearInterval(interval);
          done(); // Capybaraに処理完了を通知
        }
      }, 100);
    JS

    # 3-4. 最初の駐車場マーカーをクリックする (マーカーはDOM要素ではないためJSで実行)
    page.execute_script(<<~JS)
      if (window.parkingMarkers && window.parkingMarkers.length > 0) {
        // マーカーのクリックイベントリスナーを直接実行
        window.parkingMarkers[0].listeners['click']();
      }
    JS

    # 3-5. InfoWindow内の「ここに駐車する」ボタンをクリック
    # find_buttonはボタンが表示されるまで自動で待機してくれる
    find_button("ここに駐車する").click

    # 3-6. InfoWindowが閉じて、駐車場の位置がJSのグローバル変数にセットされたことを確認
    # これにより、後続の処理が安定する
    expect(page).to have_javascript("window.routeParking")
    # InfoWindowが閉じたことを確認（ボタンがなくなる）
    expect(page).not_to have_button("ここに駐車する")

    # 4.駐車場が設定された後、ルート描画ボタンをクリック
    find("#carDrawRoute").click # このクリックで carDrawRoute が呼ばれる

    # 5.ルート情報がsessionStorageに保存されるのを待つ
    expect(page).to have_javascript("sessionStorage.getItem('directionsResult')")

    # 6.「ナビ開始」ボタンをクリック
    find("img[alt='startNavi']").click

    # 7.ナビゲーションページに遷移したことを確認
    expect(page).to have_current_path(car_navigation_routes_path)
    expect(page).to have_selector("img[alt='stopNavi']")
  end              
end
