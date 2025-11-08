class AddUniqueIndexToLocationsOnNameAndUserId < ActiveRecord::Migration[7.1]
  def change
    add_index :locations, %i[user_id name], unique: true
  end
end
