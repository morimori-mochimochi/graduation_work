# frozen_string_literal: true

# ActiveSupport.run_load_hooks(:omniauth_strategy, self)これを待つ
# OmniAuthのストラテジーが読み込まれた後に実行する
ActiveSupport.on_load(:omniauth_strategy) do
  # OmniAuth::Strategies::OAuth2 の request_phase をオーバーライドしてログを出力
  # class_eval:定義されているクラスに後から新しいメソッドを追加、上書き（オーバーライド）可能。
  # 「オープンクラス」や「モンキーパッチ」とも呼ばれる。
  OmniAuth::Strategies::OAuth2.class_eval do
    def request_phase
      Rails.logger.info "OmniAuth: redirect_uri is '#{callback_url}'"
      super
    end
  end
