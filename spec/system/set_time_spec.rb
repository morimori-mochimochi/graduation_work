# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '時刻設定機能', type: :system, js: true do
  # テスト失敗時にブラウザのコンソールログを出力する
  after do |example|
    if example.exception
      puts "=== Browser Logs (On Failure) ==="
      puts page.driver.browser.logs.get(:browser).map(&:message).join("\n") if page.driver.browser.respond_to?(:logs)
    end
  end

  before do
    visit root_path
    find("a[href='#{car_routes_path}']").click
    # 2. walk.html.erbに遷移し、マップ表示を待つ
    # ignore_query: true はURL の末尾に「?param=value」などのクエリパラメータがついていても無視して比較するという意味。
    expect(page).to have_current_path(car_routes_path, ignore_query: true)
    # マップ表示まで待機
    # Capybaraの待機機能(#mapが表示されるまでデフォルトで数秒待ってくれる)
    expect(page).to have_selector('#map')

    # Google Mapsの初期化完了（window.mapがMapインスタンスになる）を待つ
    # InvalidValueError: setMap: not an instance of Map を防ぐため、
    # DOM要素ではなくMapオブジェクトになっていることを確認してからテストを進める
    page.evaluate_async_script(<<~JS)
      const done = arguments[0];
      const check = () => {
        if (window.map instanceof google.maps.Map) {
          done();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    JS
  end

  # 共通のルート設定処理をヘルパーメソッドに切り出し
  def set_route(waypoints: [])
    start_location = { lat: 35.6812, lng: 139.7671, name: '東京駅' }.to_json
    destination_location = { lat: 35.6586, lng: 139.7454, name: '東京タワー' }.to_json
    waypoints_json = waypoints.to_json

    status = page.evaluate_async_script(<<~JS, start_location, destination_location, waypoints_json)
      const start_location = JSON.parse(arguments[0]);
      const destination_location = JSON.parse(arguments[1]);
      const waypoints_from_ruby = JSON.parse(arguments[2]);
      const done = arguments[3];

      console.log("set_route: Start");

      // window.mapApiLoadedが未定義の時のガード節
      if (!window.mapApiLoaded) {
        console.error("set_route: window.mapApiLoaded is undefined");
        done("Error: window.mapApiLoaded is undefined ");
        return;
      }

      window.mapApiLoaded.then(async () => { // mapApiLoadedを待つ
        console.log("set_route: mapApiLoaded resolved");

        try {
          const start = new google.maps.LatLng(start_location);
          const destination = new google.maps.LatLng(destination_location);

          const waypoints = waypoints_from_ruby.map(wp => ({ mainPoint: { point: new google.maps.LatLng(wp.point), name: wp.name } }));
          window.routeData = {
            start: { point: start, name: start_location.name },
            destination: { mainPoint: { point: destination, name: destination_location.name } },
            waypoints: waypoints
          };
          // 画面にも設定を反映
          document.getElementById('startPoint').textContent = start_location.name;
          document.getElementById('destinationPoint').textContent = destination_location.name;
          // ルート検索を直接実行し、完了を待つ
          console.log("set_route: Calling carDrawRoute");
          const result = await window.carDrawRoute();
          console.log("set_route: carDrawRoute finished with status: " + result.status);

          if (result.status == 'OK') {
            window.routeData.travel_mode = 'DRIVING';
            sessionStorage.setItem('directionsResult', JSON.stringify(result.response));
            const event = new CustomEvent('routeDrawn', { detail: { status: 'OK' } });
            document.dispatchEvent(event);
          }
          done(result.status);
        } catch (e) {
          console.error("set_route: Error caught", e);
          done("Error in carDrawRoute: " + e.message);
        }
      }).catch((e) => {
        console.error("set_route: mapApiLoaded rejected", e);
        done("Error: mapApiLoaded rejected: " + e.message);
      });
    JS
    expect(status).to eq 'OK'
  end

  context '出発時刻を設定した場合' do
    it 'ルート検索後に到着時刻が自動で計算・表示されること' do
      # 1. ルートを設定し、検索を実行
      # これにより、時刻フィールドが現在時刻などで初期化される
      set_route

      # ルート描画完了後、JSによって時刻が現在時刻に初期化されるのを待つ
      expect(page).to have_field('startHour', with: /\d+/, wait: 10)

      # 2. ルート検索後に、出発時刻を '09:00' に設定
      # この時点で到着時刻が再計算されるはず
      select '09', from: 'startHour'
      select '00', from: 'startMinute'

      # 3. 時刻が正しく設定・計算されていることを確認
      # 所要時間は変動する可能性があるため、具体的な時刻ではなく「値がセットされたか」を検証
      expect(page).to have_no_select('destinationHour', selected: '時')
      expect(page).to have_no_select('destinationMinute', selected: '分')

      # 出発時刻が意図通り '09:00' になっていること
      expect(find('#startHour').value).to eq '09'
      expect(find('#startMinute').value).to eq '00'
    end
  end

  context '到着時刻を設定した場合' do
    it 'ルート検索後に出発時刻が自動で逆算・表示されること' do
      # 1. ルートを設定し、検索を実行
      set_route

      # ルート描画完了後、JSによって時刻が現在時刻に初期化されるのを待つ
      expect(page).to have_field('startHour', with: /\d+/, wait: 10)

      # 2. ルート検索後に、到着時刻を '09:00' に設定
      select '09', from: 'destinationHour'
      select '00', from: 'destinationMinute'

      # 出発時刻が逆算されて表示されるのを待つ
      # '時' ではないことを確認すれば、何らかの値がセットされたことがわかる
      expect(page).to have_no_select('startHour', selected: '時')
      expect(page).to have_no_select('startMinute', selected: '分')

      # 4. 念の為、到着時刻が変更されていないことも確認
      expect(find('#destinationHour').value).to eq '09'
      expect(find('#destinationMinute').value).to eq '00'
    end
  end

  context '中継点を追加した場合' do
    let(:parking) { attributes_for(:location, :parking_near_tower) }

    it '滞在時間を考慮して各地点の時刻が計算・表示されること' do
      # 1. ルートを設定し、検索を実行（東京タワー駐車場を中継点として渡す）
      waypoints = [{ point: { lat: parking[:lat], lng: parking[:lng] }, name: parking[:name] }]
      set_route(waypoints: waypoints)

      # ルート描画完了後、JSによって時刻が現在時刻に初期化されるのを待つ
      expect(page).to have_field('startHour', with: /\d+/, wait: 10)

      # 2. 出発時刻を09:00に設定
      select '09', from: 'startHour'
      select '00', from: 'startMinute'

      # 3. ルート検索完了後、中継点のUIが表示されるのを待つ
      expect(page).to have_selector('#relayPointsContainer .relay-point-item')

      # 4. 中継点の滞在時間を10時間に設定
      # 'within' を使って最初の中継点要素の範囲に操作を限定する
      within find('#relayPointsContainer .relay-point-item:first-child') do
        select '10', from: 'stayHour_0'
      end

      expect(page).to have_selector('#route-menu', visible: true)

      # 5. 再度ルート検索を実行
      find('#drawRoute').click

      # 6. 時刻計算が完了するのを待つ
      # 中継点の出発時刻が表示されれば計算完了とみなす
      # 要素が存在し、かつ指定したテキストが含まれるまで待機
      expect(page).to have_selector('#relayDepartureTime_0', text: /発/, wait: 10)

      # 7. 各時刻が計算されていることを確認
      # expect(page).to have_no_select(..., selected: '時'): セレクトボックスの選択状態が
      # '時' ではなくなるまで待機します。
      expect(page).to have_no_selector('#relayArrivalTime_0', text: '--:--')
      expect(page).to have_no_select('destinationHour', selected: '時')
      expect(page).to have_no_select('destinationMinute', selected: '分')
    end
  end
end
