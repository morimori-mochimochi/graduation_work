# frozen_string_literal: true

class SaveRoute < ApplicationRecord
  belongs_to :user
  has_many :notifications, dependent: :destroy

  validates :name, presence: true, length: { maximum: 255 }
  validates :travel_mode, presence: true
  validates :start_point, presence: true
  validates :end_point, presence: true

  # 滞在時間を「〇時間〇分」の形式にフォーマットするクラスメソッド
  def self.format_duration(duration_hash)
    return nil unless duration_hash

    hour = duration_hash['hour'].to_i
    minute = duration_hash['minute'].to_i

    return nil if hour.zero? && minute.zero?

    parts = []
    parts << "#{hour}時間" if hour.positive?
    parts << "#{minute}分" if minute.positive?
    parts.join
  end
end
