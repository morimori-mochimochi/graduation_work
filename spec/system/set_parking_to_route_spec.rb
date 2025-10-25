# テスト：　placesAPIの通信がうまくいかないため、最初から出発点、到着点、駐車場の場所を渡すようにした。しかし、search_parkng.jsでは出発地、目的地をクリックで選択して駐車場を探す、をクリックすることで初めて

require 'rails_helper'

RSpec.describe "駐車場を含めたルートを作成する", type: :system, js: true do
  context '目的地・出発地を設定し、駐車場を選択。その後ルート検索' do
    let(:start) { FactoryBot.build(:location) }
    let(:destination) { FactoryBot.build(:location, :tokyo_tower) }
    let(:parking) { FactoryBot.build(:location, :parking_near_tower) }

    before do
      puts "visit root_path"
      visit root_path

      puts "clicked new_route_path"
      find("a[href='#{new_route_path}']").click

      puts "clicked car_routes_path"
      find("a[href='#{car_routes_path}']").click
    end

    it "FactoryBotで定義した地図データを使ってルート検索をできる" do
      expect(page).to have_selector('#map')

      #evaluate_async_script: 同期的に結果を返す（JSがすぐに終わる時用)
      #evaluate_script: 非同期（promiseを使うもの)を待つ時に使う
      #上記どちらも任意のJSを実行するメソッド
      result = page.evaluate_async_script(<<~JS, start.lat, start.lng, destination.lat, destination.lng, parking.lat, parking.lng)
        const done = arguments[6]; // 非同期の完了を知らせるdone関数をCapybaraが最後の引数に追加
        const[startLat, startLng, destLat, destLng, parkLat, parkLng] = arguments;

        window.routeStart = new google.maps.LatLng({ lat: startLat, lng: startLng });
        window.routeDestination = new google.maps.LatLng({ lat: destLat, lng: destLng });
        window.routeParking = new google.maps.LatLng({ lat: parkLat, lng: parkLng});

        console.log("FactoryBot data set to JS variables");

        window.carDrawRoute().then(done).catch(e => done(e.message));
      JS

      expect(result).to eq("OK")
      expect(page.evaluate_script("sessionStorage.getItem('directionsResult')")).not_to be_nil

      # 6.「ナビ開始」ボタンをクリック
      find("img[alt='startNavi']").click

      # 7.ナビゲーションページに遷移したことを確認
      expect(page).to have_current_path(car_navigation_routes_path)
      expect(page).to have_selector("img[alt='stopNavi']")
    end
  end              
end
