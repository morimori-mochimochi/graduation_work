class AddStartTimeToSaveRoutes < ActiveRecord::Migration[7.1]
  def change
    add_column :save_routes, :start_time, :time
  end
end
