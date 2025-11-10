# frozen_string_literal: true

module SystemSpecHelpers
  def sign_in(user)
    visit new_user_session_path
    fill_in 'メールアドレス', with: user.email
    fill_in 'パスワード', with: user.password
    find("img[alt='ログイン']").click
  end
end

RSpec.configure do |config|
  config.include SystemSpecHelpers, type: :system
end