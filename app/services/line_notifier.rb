# frozen_string_literal: true

require 'net/http'
require 'uri'
require 'json'

class LineNotifier
  API_URI = URI.parse("https://api.line.me/v2/bot/message/push")

  def self.send_message(line_uid, message_text)
    raise "LINE UIDが見つかりません" if line_uid.blank?

    request = build_request(line_uid, message_text)
    response = execute_request(request)

    raise "LINE API Error: #{response.code} #{response.body}" unless response.code == '200'
  end

  def self.build_request(line_uid, message_text)
    request = Net::HTTP::Post.new(API_URI.path)
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{Rails.application.credentials.line[:messaging_api_channel_access_token]}"
    request.body = { to: line_uid, messages: [{ type: "text", text: message_text }] }.to_json
    request
  end

  def self.execute_request(request)
    http = Net::HTTP.new(API_URI.host, API_URI.port)
    http.use_ssl = true
    http.request(request)
  end

  private_class_method :build_request, :execute_request
end
