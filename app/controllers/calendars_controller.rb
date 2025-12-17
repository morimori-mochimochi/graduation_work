# frozen_string_literal: true

class CalendarsController < ApplicationController
  before_action :authenticate_user!

  def index
    # pluckを使うことで、必要なカラムだけを効率的にDBから取得します。
    # これにより、不要なデータをメモリにロードすることを防ぎ、パフォーマンスが向上します。
    events_data = current_user.save_routes.where.not(execution_date: nil).pluck(:id, :name, :start_time, :execution_date)
    @events = events_data.map do |id, name, start_time, execution_date|
      {
        title: "#{name} #{start_time&.strftime('%H:%M')}",
        start: execution_date,
        url: save_route_path(id)
      }
    end
  end
end
