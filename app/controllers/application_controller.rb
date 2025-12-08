# frozen_string_literal: true

class ApplicationController < ActionController::Base # :nodoc:
  # 全てのコントローラーでLINE Botクライアントを利用できるようにする
  # helper_method :line_bot_client # ビューでは使用しないため、この行は不要

  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  # line-bot-apiを使用してline-apiサーバーと通信するための窓口を提供
  # V2 APIではLINE::Bot::Clientを使用する
  def line_messaging_client
    @line_messaging_client ||= Line::Bot::V2::MessagingApi::ApiClient.new do |config|
      config.channel_secret = Rails.application.credentials.line[:messaging_api_secret]
      config.channel_access_token = Rails.application.credentials.line[:messaging_api_channel_access_token]
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end
end
