# frozen_string_literal: true

module ApplicationHelper # :nodoc:
  def google_maps_api_key
    Rails.application.credentials.dig(:google_maps, Rails.env.to_sym, :api_key)
  end
end
