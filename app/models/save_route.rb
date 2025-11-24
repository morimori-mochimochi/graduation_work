class SaveRoute < ApplicationRecord
  belongs_to :user

  validates :name, presense: true, length: { maximum: 255 }
  validates :travel_mode, presense: true
  validates :start_point, presense: true
  validates :end_point, presense: true      
end
