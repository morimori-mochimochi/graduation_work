class AddLineColumnsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :line_nonce, :string
  end
end
