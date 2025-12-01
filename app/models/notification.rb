class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :save_route

  validates :notify_at, presence: true
  validates :status, presence: true, inclusion: { in: %w[pending sent failed] }

  # Notificationモデルに「今送るべき通知だけを取り出す」ための便利メソッドを定義。
  # Rails ではこういう検索条件を scope（スコープ） と呼ぶ。
  # due_for_sendingというスコープ。メソッドのようにNotification.due_for_sendingと呼べる。
  # pendingの通知だけを選ぶ
  scope :due_for_sending, -> {
    where(status: 'pending')
      .where(notify_at: 1.minute.ago..Time.current)
  }
end
