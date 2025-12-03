# frozen_string_literal: true

# ActiveSupport.run_load_hooks(:omniauth_strategy, self)これを待つ
# OmniAuthのストラテジーが読み込まれた後に実行する
ActiveSupport.on_load(:omniauth_strategy) do
  # OmniAuth::Strategies::OAuth2 の request_phase をオーバーライドしてログを出力
  # class_eval: 既存のクラスに後からメソッドを追加・上書きする（モンキーパッチ）
  OmniAuth::Strategies::OAuth2.class_eval do
    # 1. ユーザーをLINEの認証画面にリダイレクトする直前の処理
    def request_phase
      Rails.logger.info "[OmniAuth Request Phase] redirect_uri: '#{callback_url}'"
      super
    end

    # 2. LINEからのコールバックを受け取り、アクセストークンを要求する直前の処理
    def build_access_token
      options.token_params.redirect_uri ||= callback_url
      Rails.logger.info "[OmniAuth Token Phase] redirect_uri: '#{options.token_params.redirect_uri}'"
      super
    end
  end
end
