class RenameLonToLngInLocations < ActiveRecord::Migration[7.1]
  def change
    rename_column :locations, :lon, :lng
  end
end
