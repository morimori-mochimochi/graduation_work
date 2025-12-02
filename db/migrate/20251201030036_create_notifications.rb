class CreateNotifications < ActiveRecord::Migration[7.1]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.references :save_route, null: false, foreign_key: true
      t.datetime :notify_at, null: false
      t.string :status, null: false, default: 'pending'

      t.timestamps
    end

    # notificationsテーブルのstatusカラムにインデックスを追加
    add_index :notifications, :status
  end
end
