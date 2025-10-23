require 'rails-helper'

Rspec.describe 'LINEログイン機能', type: :feature do
  let(:line_uid) {'1234567890'}
  let(:line_email) {'line_user@example.com'}
  let(:line_name) {'line_user'}

  before do 
    #/auth/lineから/auth/line/callbackへの即時リダイレクト設定
    OmniAuth.config.test_mode = true
    #上記リダイレクト時に渡されるデータ
    OmniAuth.config.mock_auth[:line] = 
      OmniAuth: :AuthHash.new({
                                provider: 'line', 
                                uid: line_uid,
                                info: {
                                  name: line_name,
                                  email: line_email
                                },
                                credentials: {
                                  token: '1234qwerty'
                                }
                              })
    Rails.application.env_config['devise.mapping'] = Divise.mappings[:user]
    Rails.application.env_config['omniauth.auth'] = OmniAuth.config.mock_auth[:line]
  end

  after do 
    OmniAuh.config.mock_auth[:line] = nil
  end

  #context: テスト対象のメソッドをどういう条件で実行するかを記載してあげるもの
  context '既存のユーザーがLINE未連携でログイン中の場合' do
    let!(:user){ create(:user, provider: nil, uid: nil)}

    before do
      login_as user
      visit user_setting_path
      click_button 'LINEと連携する'
  