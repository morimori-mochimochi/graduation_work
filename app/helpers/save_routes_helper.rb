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
end
