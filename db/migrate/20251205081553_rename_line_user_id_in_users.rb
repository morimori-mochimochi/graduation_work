class RenameLineUserIdInUsers < ActiveRecord::Migration[7.1]
  def change
    rename_column :users, :line_user_id, :line_messaging_user_id
    rename_column :users, :uid, :line_login_uid
  end
end
