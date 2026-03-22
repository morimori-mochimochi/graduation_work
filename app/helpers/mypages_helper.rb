# frozen_string_literal: true

module MypagesHelper
  def mail_or_line_info(user)
    if user.line_connected?
      "LINEアカウント: #{user.name}"
    else
      "メールアドレス: #{user.email}"
    end
  end

  def account_edit_button(user)
    return if user.line_connected?

    link_to edit_mypage_path do
      image_tag "/images/user_edit.png", alt: "edit_mypage", class: "btn_effect h-17"
    end
  end
end
