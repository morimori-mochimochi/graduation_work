class CreateSaveRoutes < ActiveRecord::Migration[7.1]
  def change
    create_table :save_routes do |t|
      t.string :name
      t.jsonb :start_point
      t.jsonb :end_point
      t.jsonb :waypoints
      t.string :travel_mode
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
