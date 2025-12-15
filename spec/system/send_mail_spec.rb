# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '出発時刻通知メール', type: :system, js: true do
  before do

    it 'ルート保存後、そのルートの出発時刻のメール通知が来ること'
      visit root_path
      find("a[href='#{new_route_path}']").click
      find("a[href='#{walk_routes_path}']").click

      expect(page).to have_current_path(walk_routes_path, ignore_query: true)
      expect(page).to have_selector('#map')
    

    # 共通のルート設定処理をヘルパーメソッドに切り出し
      def set_route(waypoints: [])
        start_location = { lat: 35.6812, lng: 139.7671 }.to_json
        destination_location = { lat: 35.6586, lng: 139.7454 }.to_json

        page.evaluate_async_script(<<~JS, start_location, destination_location, waypoints_json)
          const start_location = JSON.parse(arguments[0]);
          const destination_location = JSON.parse(arguments[1]);
          const done = arguments[2];

          window.mapApiLoaded.then(async () => { // mapApiLoadedを待つ
            const start = new google.maps.LatLng(start_location);
            const destination = new google.maps.LatLng(destination_location);

            window.routeData = {
              start: { point: start },
              destination: { mainPoint: { point: destination } },
            };
            // 画面にも設定を反映
            document.getElementById('startPoint').textContent = "東京駅";
            document.getElementById('destinationPoint').textContent = "東京タワー";
            // ルート検索を直接実行し、完了を待つ
            await window.walkDrawRoute();
            done(); // walkDrawRouteの完了後にテストを再開
          });
        JS
      end

      expect(page).to have_javascript("sessionStorage.getItem('directionsResult')")
      expect(find('startHour').value).not_to eq '時'
      expect(find('#startMinute').value).not_to eq '分'
      expect(find('#destinationHour').value).not_to eq '時'
      expect(find('#destinationMinute').value).not_to eq '分'

      find('#saveRouteBtn').click
      page.accept_alert 'ルートを保存しました'

      expect(page).to have_current_path(save_route_path(saved_route))
      find("a[href='#{edit_save_route_path(@save_route)}']").click

      







  