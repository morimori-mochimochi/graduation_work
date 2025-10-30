# frozen_string_literal: true

FactoryBot.define do
  factory :location do
    name { '東京駅' }
    lat { 35.6812 }
    lng { 139.7671 }

    trait :tokyo_tower do
      name { '東京タワー' }
      lat { 35.6586 }
      lng { 139.7454 }
    end

    trait :parking_near_tower do
      name { '東京タワー駐車場' }
      lat { 35.6590 }
      lng { 139.7450 }
    end
  end
end
