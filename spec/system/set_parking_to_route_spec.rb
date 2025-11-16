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
      route_data = {
        start: { point: { lat: start.lat, lng: start.lng } },
        destination: { mainPoint: { point: { lat: destination.lat, lng: destination.lng } } },
        waypoints: [{ point: { lat: parking.lat, lng: parking.lng }, isParking: true }]
      }.to_json

      result = page.evaluate_async_script(
        <<~JS, # 非同期処理の完了を待つ
          const routeDataFromRuby = JSON.parse(arguments[0]);
          const done = arguments[1];

          // Rubyから渡されたデータをGoogle MapsのLatLngオブジェクトに変換してwindow.routeDataを構築
          window.routeData = {
            start: { point: new google.maps.LatLng(routeDataFromRuby.start.point) },
            destination: { mainPoint: { point: new google.maps.LatLng(routeDataFromRuby.destination.mainPoint.point) } },
            waypoints: routeDataFromRuby.waypoints.map(wp => ({
              point: new google.maps.LatLng(wp.point),
              isParking: wp.isParking
            }))
          };

          window.carDrawRoute().then(result => done(result)).catch(e => done(e.message));
        JS,
        route_data
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
