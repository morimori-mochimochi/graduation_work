# frozen_string_literal: true

class CalendarsController < ApplicationController
  before_action :authenticate_user!

  def index
    save_routes = current_user.save_routes.where.not(execution_date: nil)
    @events = save_routes.map do |route|
      {
        title: "#{route.name} #{route.departure_time&.strftime('%H:%M')}",
        start: route.execution_date,
        url: save_route_path(route),
        extendedProps: { id: route.id}
      }
    end
  end
end
