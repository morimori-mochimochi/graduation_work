class AddTotalDistanceAndDurationToSaveRoutes < ActiveRecord::Migration[7.1]
  def change
    add_column :save_routes, :total_distance, :integer
    add_column :save_routes, :total_duration, :integer
  end
end
