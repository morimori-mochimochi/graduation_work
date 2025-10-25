class Location < ApplicationRecord
  belongs_to :user

  validates :lat, :lng, :name, presence: true

  def lat 
    super.to_f
  end

  def lng
    super.to_f
  end
end