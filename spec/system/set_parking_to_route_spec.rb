# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '駐車場を含めたルートを作成する', type: :system, js: true do
  context '目的地・出発地を設定し、駐車場を選択。その後ルート検索' do
    let(:start) { FactoryBot.build(:location) }
    let(:destination) { FactoryBot.build(:location, :tokyo_tower) }
    let(:parking) { FactoryBot.build(:location, :parking_near_tower) }

    before do
      visit root_path
      find("a[href='#{new_route_path}']").click
      find("a[href='#{car_routes_path}']").click
    end

    it 'FactoryBotで定義した地図データを使ってルート検索をできる' do
      expect(page).to have_selector('#map')

      # evaluate_async_script: 同期的に結果を返す（JSがすぐに終わる時用)
      # evaluate_script: 非同期（promiseを使うもの)を待つ時に使う
      # 上記どちらも任意のJSを実行するメソッド
      # carDrawRouteが参照するwindow.routeDataの構造に合わせてRubyでハッシュを作成
      # car_route.jsのwindow.routeDataの構造に合わせて、destinationの中にparkingLotを含める
      route_data = {
        start: { point: { lat: start.lat, lng: start.lng } },
        destination: {
          mainPoint: { point: { lat: destination.lat, lng: destination.lng } },
          parkingLot: { point: { lat: parking.lat, lng: parking.lng } }
        }
      }.to_json

      # JSとRubyの間では変数を参照することはできないので、引数として渡す必要がある
      # JSコードの中ではargumentsという特殊な変数を使ってRubyから渡された引数を受け取ることができる
      # arguments[0]：1番目の引数、つまりRubyから渡されたroute_data(JSON文字列) が入り、JSON.parse()でJSのオブジェクトに変換
      # arguments[1]：Capybaraが非同期処理完了検知のために自動挿入する done コールバック関数。これを呼び出すと、RSpecのテストが次のステップに進む
      result = page.evaluate_async_script(<<~JS, route_data)
          const routeDataFromRuby = JSON.parse(arguments[0]);
          const done = arguments[1];

          window.mapApiLoaded.then(async () => {
            // Rubyから渡されたデータをGoogle MapsのLatLngオブジェクトに変換
            window.routeData = {
              start: { point: new google.maps.LatLng(routeDataFromRuby.start.point) },
              destination: {
                mainPoint: { point: new google.maps.LatLng(routeDataFromRuby.destination.mainPoint.point) },
                parkingLot: { point: new google.maps.LatLng(routeDataFromRuby.destination.parkingLot.point) },
              },
              waypoints: [] // 中継点がない場合でも空の配列を定義
            };

            try {
              const result = await window.carDrawRoute();
              done(result); // 成功したら"OK"が返る
            } catch (e) {
              done("Error in carDrawRoute: " + e.message);
            }
          });
      JS

      expect(result).to eq('OK')
      expect(page.evaluate_script("sessionStorage.getItem('directionsResult')")).not_to be_nil

      # 6.「ナビ開始」ボタンをクリック
      find("img[alt='startNavi']").click

      # 7.ナビゲーションページに遷移したことを確認
      expect(page).to have_current_path(car_navigation_routes_path)
      expect(page).to have_selector("img[alt='stopNavi']")
    end
  end
end
