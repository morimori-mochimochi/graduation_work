# frozen_string_literal: true

require 'line/bot'

def line_bot_client
  @line_bot_client ||= Line::Bot::Client.new do |config|
    # credentials.yml.enc に設定した値を参照
    config.channel_secret = Rails.application.credentials.line[:messaging_channel_secret]
    config.channel_token = Rails.application.credentials.line[:messaging_channel_token]
  end
end