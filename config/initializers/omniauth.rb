# frozen_string_literal: true

# Railsアプリケーションの初期化が完了した後に実行する
Rails.application.config.after_initialize do
  require 'omniauth/oauth2'
  # OmniAuth::Strategies::OAuth2 の request_phase をオーバーライドしてログを出力
  OmniAuth::Strategies::OAuth2.class_eval do
    def request_phase
      Rails.logger.info "OmniAuth: redirect_uri is '#{callback_url}'"
      super
    end
  end
end