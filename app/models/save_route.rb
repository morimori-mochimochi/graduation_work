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
    # number.positive?: 0より大きい場合にtrueを返す
    parts << "#{hour}時間" if hour.positive?
    parts << "#{minute}分" if minute.positive?
    parts.join
  end

  # URLヘルパー(save_route_pathなど)が生成するIDをSigned IDに変更
  def to_param
    signed_id(purpose: :route_view)
  end

  # 移動手段を日本語で返す
  def travel_mode_ja
    case travel_mode
    when 'driving' then '車'
    when 'walking' then '徒歩'
    else travel_mode
    end
  end

  # 総移動距離をkm単位（小数点第2位まで）で返す
  def total_distance_km
    return unless total_distance

    # round(2): 小数点第2位まで表示
    (total_distance / 1000.0).round(2)
  end

  # 所要時間を分単位（切り上げ）で返す
  def total_duration_minutes
    return unless total_duration

    # ceil: 切り上げ(ceiling: 天井)
    (total_duration / 60.0).ceil
  end

  # 日時フォーマット用メソッド
  def formatted_execution_date
    execution_date&.strftime('%Y年%m月%d日')
  end

  def formatted_start_time
    start_time&.strftime('%H:%M')
  end
end
