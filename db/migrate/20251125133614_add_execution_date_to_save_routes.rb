class AddExecutionDateToSaveRoutes < ActiveRecord::Migration[7.1]
  def change
    add_column :save_routes, :execution_date, :date
  end
end
