#環境ごとにGoogleMapsApiキーを切り替える
GOOGLE_MAPS_API_KEY = case Rails.env
when "development", "test"
  Rails.application.credentials.dig(:google_maps, :development, :api_key)
when "production"
  Rails.application.credentials.dig(:google_maps, :production, :api_key)
end