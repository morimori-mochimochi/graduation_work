require 'rails_helper'

RSpec.describe "駐車場を含めたルートを作成する", type: :system, js: true do
  it "車で移動する際、目的地と駐車場を設定し、駐車場までは車のルート、駐車場から目的地までは徒歩のルートを提案する" do
    #1. トップページにアクセスし、車ルート作成ページに移動
    visit root_path

    find("a[href='#{new_route_path}']").click
    find("a[href='#{car_routes_path}']").click

    expect(page).to have_current_path(car_routes_path, ignore_query: true)
    expect(page).to have_selector('#map')

    # 2. JSで出発地・目的地・駐車場の位置情報を直接設定する
    # 駐車場検索のプロセスはスキップし、ユーザーが駐車場を選択した直後の状態を再現する
    page.evaluate_script(<<~JS)
      window.google = window.google || {};
      window.google.maps = window.google.maps || {};
      window.google.maps.LatLng = function(obj) {
        const lat = (typeof obj.lat === 'function') ? obj.lat() : obj.lat;
        const lng = (typeof obj.lng === 'function') ? obj.lng() : obj.lng;
        // 実際のGoogle Maps LatLngオブジェクトのインターフェースに合わせる
        return { lat: () => lat, lng: () => lng, toJSON: () => ({ lat: lat, lng: lng }) };
      };
 
      // 出発地、目的地、駐車場の設定
      window.routeStart = new google.maps.LatLng({ lat: 35.6812, lng: 139.7671 }); // 東京駅
      window.routeDestination = new google.maps.LatLng({ lat: 35.6586, lng: 139.7454 });
      window.routeParking = new google.maps.LatLng({ lat: 35.6590, lng: 139.7450 }); // 目的地の近くの駐車場
 
      // 駐車場選択後のUI更新をシミュレート
      const routeParkingBtn = document.getElementById("routeParking");
      if (routeParkingBtn) {
        routeParkingBtn.textContent = "モック駐車場";
        routeParkingBtn.style.display = "inline-block";
      }
    JS

    # 3.駐車場が設定された後、ルート描画関数を非同期で呼び出し、完了を待つ。
    # carDrawRouteはPromiseを返すasync関数なのでawaitで完了を待ってdone()をよび、Rspecに処理を戻す
    page.evaluate_async_script(<<~JS)
      const done = arguments[0];
      window.carDrawRoute().then(() => {
        done(); //成功したらテスト再開　
      }).catch((e) => {
        done(e.message); //失敗したらエラーメッセーと共にテストを失敗させる
      });
    JS
    
    # 4.ルート情報がsessionStorageに保存されるのを待つ
    expect(page).to have_javascript("sessionStorage.getItem('directionsResult')")

    # 6.「ナビ開始」ボタンをクリック
    find("img[alt='startNavi']").click

    # 7.ナビゲーションページに遷移したことを確認
    expect(page).to have_current_path(car_navigation_routes_path)
    expect(page).to have_selector("img[alt='stopNavi']")
  end              
end
