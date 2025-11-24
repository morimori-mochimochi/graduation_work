# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '時刻設定機能', type: :system, js: true do
  before do

    visit root_path
    find("a[href='#{new_route_path}']").click
    find("a[href='#{walk_routes_path}']").click
    # 2. walk.html.erbに遷移し、マップ表示を待つ
    # ignore_query: true はURL の末尾に「?param=value」などのクエリパラメータがついていても無視して比較するという意味。
    expect(page).to have_current_path(walk_routes_path, ignore_query: true)
    # マップ表示まで待機
    # Capybaraの待機機能(#mapが表示されるまでデフォルトで数秒待ってくれる)
    expect(page).to have_selector('#map')
  end
  
  # 共通のルート設定処理をヘルパーメソッドに切り出し
  def set_route
    start_location = { lat: 35.6812, lng: 139.7671 }.to_json
    destination_location = { lat: 35.6586, lng: 139.7454 }.to_json

    page.evaluate_async_script(<<~JS, start_location, destination_location)
      const start_location = JSON.parse(arguments[0]);
      const destination_location = JSON.parse(arguments[1]);
      const done = arguments[2];

      window.mapApiLoaded.then(async () => { // mapApiLoadedを待つ
        const start = new google.maps.LatLng(start_location);
        const destination = new google.maps.LatLng(destination_location);

        window.routeData = {
          start: { point: start },
          destination: { mainPoint: { point: destination } },
          waypoints: []
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

  context '出発時刻を設定した場合' do
    it 'ルート検索後に到着時刻が自動で計算・表示されること' do
      # 1. 出発地と目的地を設定
      select '09', from: 'startHour'
      select '00', from: 'startMinute'

      # 2. ルートを設定し、検索を実行
      set_route

      # 3. ルート検索が完了し、結果がsessionStorageに保存されるのを待つ
      # set_route内でwalkDrawRouteの完了を待っているため、このチェックは成功するはず
      expect(page).to have_javascript("sessionStorage.getItem('directionsResult')")
      # 所要時間は変動する可能性があるため、具体的な時刻ではなく「値がセットされたか」を検証
      expect(find('#destinationHour').value).not_to eq '時'
      expect(find('#destinationMinute').value).not_to eq '分'

      # 5. 念の為、出発時刻が変更されていないことも確認
      expect(find('#startHour').value).to eq '09'
      expect(find('#startMinute').value).to eq '00'
    end
  end

  context '到着時刻を設定した場合' do
    it 'ルート検索後に出発時刻が自動で逆算・表示されること' do
      # 1. 出発地と目的地を設定
      select '09', from: 'destinationHour'
      select '00', from: 'destinationMinute'

      # 2. ルートを設定し、検索を実行
      set_route

      # 3. ルート検索が完了し、結果がsessionStorageに保存されるのを待つ
      # set_route内でwalkDrawRouteの完了を待っているため、このチェックは成功するはず
      expect(page).to have_javascript("sessionStorage.getItem('directionsResult')")
      # 出発時刻が逆算されて表示されるのを待つ
      expect(find('#startHour').value).not_to eq '時'
      expect(find('#startMinute').value).not_to eq '分'

      # 5. 念の為、到着時刻が変更されていないことも確認
      expect(find('#destinationHour').value).to eq '09'
      expect(find('#destinationMinute').value).to eq '00'
    end
  end
end
