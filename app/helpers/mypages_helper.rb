# frozen_string_literal: true

module MypagesHelper
 def mail_or_line_info(current_user)
    if user.line_login_uid.present?
      "LINEアカウント: #{user.name}"
    else
      "メールアドレス: #{user.email}"
    end
  end
end
