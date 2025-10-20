require 'omniauth-oauth2'

  module Strategies
    class Line < OmniAuth::Strategies::OAuth2 #Strategies::Line は、「LINE用のカスタム版OAuth2の使い方」を定義しているクラス
    
      option :scope, 'openid profile email' #scopeは「どんな情報をLINEから取得したいか」を指定

      option :client_options, { #ここではAPIのどのURLを使うかを指定
        site: 'https://api.line.me', #ユーザーがログイン画面に移行するURL
        authorize_url: 'https://access.line.me/oauth2/v2.1/authorize', #アクセストークンを取得するためのURL
        token_url: 'https://api.line.me/oauth2/v2.1/token' #LINEのAPIのベースURL
      }

      uid { raw_info['sub'] } # uid は「ユーザーを一意に識別するID」を指定する箇所。raw_info['sub'] はLINEが返す「ユーザーID（subjectの略）」

      info do  # LINEから受け取った情報のうち、Railsアプリで使いたい情報を指定
        {
          name: raw_info['name'],
          email: raw_info['email']
        }
      end #これらの情報がハッシュ形式でRailsアプリに渡される

      def raw_info # raw_info は「LINEから取得したユーザー情報」を返すメソッド
        @raw_info ||= verify_id_token #一度取得した情報は @raw_info に保存して、次に呼ぶときは再取得しない
      end
      
      private

      def authorize_params #LINEログインでは「nonce（ナンス）」というランダムな文字列を送る必要がある
        super.tap do |params| #これはセキュリティ上の工夫で、「リクエストを改ざんされていないか」を確認するため
          params[:nonce] = SecureRandom.uuid #SecureRandom.uuid で一意な文字列を生成し、セッションに保存している
          session['omniauth.nonce'] = params[:nonce]
        end
      end

      def verify_id_token # LINEから返ってきた id_token を検証する処理
        @id_token_payload ||= begin # id_token は「このユーザーが本当にLINEでログインしたか」を保証するデータ
          client.request(:post, 'https://api.line.me/oauth2/v2.1/verify',
            {
              body: {
                id_token: access_token['id_token'],
                client_id: client_options.client_id,
                nonce: session.delete('omniauth.nonce')
              }
            }
          ).parsed
        rescue => e # エラーが起きたら Rails.error.report でログに詳細を出し、再度エラーを投げる
          Rails.error.report(e, context: {
            action: '[LINE login] ID token verification & get user info',
            client_id: options.client_id,
            has_id_token: access_token['id_token'].present?
          })
          raise
        end

        @id_token_payload
      end
    end
  end


