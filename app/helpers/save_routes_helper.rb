# frozen_string_literal: true

module SaveRoutesHelper
  def notification_destination_info(save_route, user)
    notification = save_route.notifications.find_by(user: user)

    if notification&.line?
     # HTMLの<p>タグを生成
      tag.p do
       # concatを使うことで、複数の要素を連結して<p>タグの中に入れることができる
        concat tag.strong("通知先LINEアカウント:")
        concat " #{user.name}"
      end
    else
      tag.p do
        concat tag.strong("通知先メールアドレス:")
        concat " #{user.email}"
      end
    end
  end
end
