# frozen_string_literal: true

FactoryBot.define do
  factory :notification do
    user { nil }
    save_route { nil }
    notify_at { "2025-12-01 03:00:36" }
    status { "MyString" }
  end
end
