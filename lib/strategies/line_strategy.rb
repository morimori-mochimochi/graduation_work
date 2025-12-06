# frozen_string_literal: true

require 'omniauth-oauth2'

module OmniAuth
  module Strategies
    # OmniAuth::Strategiesモジュール内にクラスを定義
    class LineStrategy < OmniAuth::Strategies::OAuth2
      # scopeは「どんな情報をLINEから取得したいか」を指定
      option :scope, 'openid profile'

      # ここではAPIのどのURLを使うかを指定
      option :client_options, {
        # ユーザーがログイン画面に移行するURL
        site: 'https://api.line.me',
        # アクセストークンを取得するためのURL
        authorize_url: 'https://access.line.me/oauth2/v2.1/authorize',
        # LINEのAPIのベースURL
        token_url: 'https://api.line.me/oauth2/v2.1/token'
      }

      # uid は「ユーザーを一意に識別するID」を指定する箇所。raw_info['sub'] はLINEが返す「ユーザーID（subjectの略）」
      uid { raw_info['sub'] }

      # LINEから受け取った情報のうち、Railsアプリで使いたい情報を指定
      # これらの情報がハッシュ形式でRailsアプリに渡される
      info do
        {
          name: raw_info['name'],
          email: raw_info['email']
        }
      end

      # raw_info は「LINEから取得したユーザー情報」を返すメソッド
      # 一度取得した情報は @raw_info に保存して、次に呼ぶときは再取得しない
      def raw_info
        @raw_info ||= verify_id_token
      end

      private

      # LINEログインでは「nonce（ナンス）」というランダムな文字列を送る必要がある
      def authorize_params
        # これはセキュリティ上の工夫で、「リクエストを改ざんされていないか」を確認するため
        super.tap do |params|
          params[:nonce] = SecureRandom.uuid
          session['omniauth.nonce'] = params[:nonce]
        end
      end

      # id_token を検証し、ユーザー情報を取得する
      # id_token は「このユーザーが本当にLINEでログインしたか」を保証するデータ
      def verify_id_token
        @id_token_payload ||= perform_id_token_verification
      rescue StandardError => e
        handle_verification_error(e)
      end

      # LINE APIにid_tokenの検証をリクエストする
      def perform_id_token_verification
        client.request(:post, 'https://api.line.me/oauth2/v2.1/verify',
                       { body: verification_params }).parsed
      end

      # 検証APIに送るパラメータを構築する
      def verification_params
        {
          id_token: access_token['id_token'],
          client_id: options.client_id,
          nonce: session.delete('omniauth.nonce')
        }
      end

      # 検証時のエラーをログに記録し、再度例外を発生させる
      def handle_verification_error(error)
        Rails.error.report(error, context: {
                             action: '[LINE login] ID token verification & get user info',
                             client_id: options.client_id,
                             has_id_token: access_token['id_token'].present?
                           })
        raise error
      end
    end
  end
end
