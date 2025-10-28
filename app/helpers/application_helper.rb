module ApplicationHelper
  def google_maps_api_key
    Rails.application.credentials.dig(:google_maps, Rails.env.to_sym, :api_key)
  end
end
