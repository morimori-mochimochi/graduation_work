class SaveRoute < ApplicationRecord
  belongs_to :user

  validates :name, presence: true, length: { maximum: 255 }
  validates :travel_mode, presence: true
  validates :start_point, presence: true
  validates :end_point, presence: true
end
