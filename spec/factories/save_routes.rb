FactoryBot.define do
  factory :save_route do
    name { "MyString" }
    start_point { "" }
    end_point { "" }
    waypoints { "" }
    travel_mode { "MyString" }
    user { nil }
  end
end
