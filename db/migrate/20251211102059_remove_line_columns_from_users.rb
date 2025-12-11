class RemoveLineColumnsFromUsers < ActiveRecord::Migration[7.1]
  def change
    remove_column :users, :line_messaging_user_id, :string
    remove_column :users, :line_nonce, :string
  end
end
