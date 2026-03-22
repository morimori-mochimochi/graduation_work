# frozen_string_literal: true

module SaveRoutesHelper
  def notification_destination_info(save_route, user)
    notification = save_route.notifications.find_by(user: user)

    if notification&.line?
      label = "通知先LINEアカウント:"
      value = user.name
    else
      label = "通知先メールアドレス:"
      value = user.email
    end

    tag.p do
      concat tag.strong(label)
      concat " #{value}"
    end
  end

  def account_edit_button(user)
    return if user.line_connected?

    link_to edit_mypage_path do
      image_tag "/images/user_edit.png", alt: "edit_mypage", class: "btn_effect h-17"
    end
  end
end
