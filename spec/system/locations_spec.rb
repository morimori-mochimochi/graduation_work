# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Locations', type: :system, js: true do
    #テストで使用するユーザーと場所のデータを作成
    let(:user) { create(:user) }
    # FactoryBotで定義した:locationファクトリからテストで使う住所や緯度経度情報を取得
    let(:location_attributes) { attributes_for(:location) }

    before do
        # テストの前に作成したユーザーでログインする
        sign_in user
    end

    describe 'スポットの保存から一覧表示までの流れ' do
        it 'ユーザーが新しい場所を保存し、詳細ページと一覧ページで確認できること' do
            visit new_location_path

            # new.html.erbのフォームに名前を入力する
            fill_in 'location_name', with: location_attributes[:name]

            # 保存ボタンをクリック
            expect do
                click_button '保存'
            end.to change(Location, :count).by(1)

            # 詳細ページでの確認
            # 保存後、一覧に飛ぶことを確認
            expect(page).to have_content '場所を保存しました'
            expect(page).to have_current_path(locations_path)
            expect(page).to have_content location_attributes[:name]
        end
    end
end
