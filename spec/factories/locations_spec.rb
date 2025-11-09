require 'rails_helper'

Rspec.describe 'Locations', type: :system do
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
            visit new_location_path(location: {
                                      address: location_attributes[:name], # Factoryのnameをaddressとして使用
                                      lat: location_attributes[:lat],
                                      lng: location_attributes[:lng]
                                    })
                                
            # new.html.erbのフォームに値が設定されていることを確認 ☝️☝️ここはフォームに名前を入れるのでは？
            expect(page).to have_field('名称', with: location_attributes[:name])
            
            # 「この場所を保存する」ボタンをクリックするとDBに登録されることを検証
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
