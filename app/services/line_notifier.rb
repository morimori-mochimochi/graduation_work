# frozen_string_literal: true

require 'net/http'
require 'uri'
require 'json'

class LineNotifier
  def self.send_message(line_uid, message_text)
    raise "LINE UIDが見つかりません" if line_uid.blank?

    uri = URI.parse("https://api.line.me/v2/bot/message/push")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.path)
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{Rails.application.credentials.line[:messaging_api_channel_access_token]}"

    data = {
      to: line_uid,
      messages: [{ type: "text", text: message_text }]
    }
    request.body = data.to_json

    response = http.request(request)
    raise "LINE API Error: #{response.code} #{response.body}" unless response.code == '200'
  end
end