FactoryBot.define do
  factory :location do
    name { "東京駅" }
    lat { 35.6812.to_f }
    lng { 139.7671.to_f }

    trait :tokyo_tower do
      name { "東京タワー" }
      lat { 35.6586.to_f }
      lng { 139.7454.to_f }
    end
    
    trait :parking_near_tower do
      name { "東京タワー駐車場" }
      lat { 35.6590.to_f }
      lng { 139.7450.to_f }
    end
  end
end