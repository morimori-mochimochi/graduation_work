# frozen_string_literal: true

class ApplicationController < ActionController::Base # :nodoc:
  # 全てのコントローラーでLINE Botクライアントを利用できるようにする
  # helper_method :line_bot_client # ビューでは使用しないため、この行は不要

  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def line_bot_client
    @line_bot_client ||= Line::Bot::Client.new do |config|
      config.channel_secret = Rails.application.credentials.line[:messaging_channel_secret]
      config.channel_token = Rails.application.credentials.line[:messaging_channel_token]
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end
end
