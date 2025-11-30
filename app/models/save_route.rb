# frozen_string_literal: true

class SaveRoute < ApplicationRecord
  serialize :start_point, coder: JSON
  serialize :end_point, coder: JSON
  serialize :waypoints, coder: JSON

  belongs_to :user

  validates :name, presence: true, length: { maximum: 255 }
  validates :travel_mode, presence: true
  validates :start_point, presence: true
  validates :end_point, presence: true
end
