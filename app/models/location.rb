class Location < ApplicationRecord
  belongs_to :user

  validates :lat, :lng, :name, presence: true
end