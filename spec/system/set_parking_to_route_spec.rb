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
      result = page.evaluate_async_script(
        <<~JS, # 非同期処理の完了を待つ
          const[startLat, startLng, destLat, destLng, parkLat, parkLng] = arguments;
          const done = arguments[arguments.length - 1];

          window.routeStart = new google.maps.LatLng({ lat: startLat, lng: startLng });
          window.routeDestination = new google.maps.LatLng({ lat: destLat, lng: destLng });
          window.routeParking = new google.maps.LatLng({ lat: parkLat, lng: parkLng});
          console.log("FactoryBot data set to JS variables");

          window.carDrawRoute().then(result => done(result)).catch(e => done(e.message));
        JS
        start.lat,
        start.lng,
        destination.lat,
        destination.lng,
        parking.lat,
        parking.lng
      )

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
