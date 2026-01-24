class DropUnusedTables < ActiveRecord::Migration[7.1]
  def change
    # 外部キー制約の依存関係を考慮して、子テーブルから順に削除します

    # 1. notify_times (trip_plans に依存)
    drop_table :notify_times do |t|
      t.references :trip_plan, null: false, foreign_key: true
      t.datetime :notify_at, null: false
      t.boolean :notified, null: false
      t.timestamps
    end

    # 2. trip_plans (route_segments, users に依存)
    drop_table :trip_plans do |t|
      t.references :user, null: false, foreign_key: true
      t.references :route_segment, null: false, foreign_key: true
      t.datetime :departure_time, null: false
      t.datetime :arrival_time, null: false
      t.integer :length_of_stay
      t.string :name
      t.text :memo
      t.timestamps
    end

    # 3. selected_route_segments (route_segments, routes に依存)
    drop_table :selected_route_segments do |t|
      t.references :route_segment, null: false, foreign_key: true
      t.integer :order_index, null: false
      t.timestamps
      t.references :route, null: false, foreign_key: true
    end

    # 4. route_segments (starting_points, destinations に依存)
    drop_table :route_segments do |t|
      t.references :starting_point, null: false, foreign_key: true
      t.references :destination, null: false, foreign_key: true
      t.decimal :distance, precision: 8, scale: 2, null: false
      t.integer :duration, null: false
      t.timestamps
    end

    # 5. routes (users に依存)
    drop_table :routes do |t|
      t.references :user, null: false, foreign_key: true
      t.decimal :distance, precision: 8, scale: 2, null: false
      t.integer :duration, null: false
      t.json :raw_route_data, null: false
      t.string :name
      t.text :memo
      t.timestamps
    end

    # 6. destinations (locations に依存)
    drop_table :destinations do |t|
      t.references :location, null: false, foreign_key: true
      t.timestamps
    end

    # 7. starting_points (locations に依存)
    drop_table :starting_points do |t|
      t.references :location, null: false, foreign_key: true
      t.timestamps
    end

    # 8. parkings (独立)
    drop_table :parkings do |t|
      t.decimal :lat, precision: 10, scale: 6, null: false
      t.decimal :lon, precision: 10, scale: 6, null: false
      t.string :address, null: false
      t.text :memo
      t.string :name
      t.string :floor
      t.timestamps
    end
  end
end
