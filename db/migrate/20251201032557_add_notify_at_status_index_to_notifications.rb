class AddNotifyAtStatusIndexToNotifications < ActiveRecord::Migration[7.1]
  def change
    remove_index :notifications, :status
    add_index :notifications, [:notify_at, :status]
  end
end
