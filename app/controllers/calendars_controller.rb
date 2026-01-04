# frozen_string_literal: true

class CalendarsController < ApplicationController
  before_action :authenticate_user!

  def index
    # SaveRoutesControllerでfind_signed!を使用しているため、signed_idを取得するためにモデルオブジェクトが必要です
    routes = current_user.save_routes.where.not(execution_date: nil)
    @events = routes.map do |route|
      {
        title: "#{route.name} #{route.start_time&.strftime('%H:%M')}",
        start: route.execution_date,
        # 署名付きIDを使用して安全にルートを参照
        # purpose: :route_view: 別の用途で作られた署名付きIDが使われても弾く
        url: save_route_path(route.signed_id(purpose: :route_view))
      }
    end
  end
end
