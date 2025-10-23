class ChangeNameColumnOnUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :name, :string
    remove_column :users, :first_name, :string if column_exists?(:users, :first_name)
    remove_column :users, :last_name, :string if column_exists?(:users, :last_name)
  end
end
