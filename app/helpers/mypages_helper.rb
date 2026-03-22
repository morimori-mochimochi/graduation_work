# frozen_string_literal: true

module MypagesHelper
  def mail_or_line_info(user)
    if user.line_connected?
      "LINEアカウント: #{user.name}"
    else
      "メールアドレス: #{user.email}"
    end
  end
end
