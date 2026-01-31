# frozen_string_literal: true

class Location < ApplicationRecord # :nodoc:
  encrypts :address
  encrypts :lat, type: :float
  encrypts :lng, type: :float

  belongs_to :user

  # numericality: 整数であるかどうかや、指定値以上(以下・未満・等しい)かどうかなどを検証
  validates :lat, presence: true, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }
  validates :lng, presence: true, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }
  validates :name, presence: true, length: { maximum: 20 },
                   uniqueness: { scope: :user_id, message: I18n.t('defaults.location_already_registered') }

end
