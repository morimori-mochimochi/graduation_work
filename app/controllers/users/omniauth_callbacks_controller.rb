# frozen_string_literal: true
# このコントローラはDivise（認証ライブラリ）＋Omniauth（外部ログイン連携)の仕組みを使って「LINEでログイン」する処置を担当
# ユーザーがログインした時に送られてくる認証情報を受け取ってアプリ内のUserモデルと結びつける役割を担う
module Users
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    skip_before_action :verify_authenticity_token, only: :line # LINEからのリクエストは外部サイトから来るためCSFRトークン検証をスキップ

    def line
      # Userモデルのメソッドを呼び出し、LINEの認証情報からユーザーを検索または作成する
      @user = User.sign_in_or_create_user_from_line(request.env['omniauth.auth'])

      if @user.persisted? #「persisted?」は「DBに保存されているか」を表す
        complete_line_login  #保存済みならログイン成功、未保存なら失敗処理へ進む
      else
        fail_line_login
      end
    end

    private

    def complete_line_login
      sign_in_and_redirect @user, event: :authentication
      set_flash_message(:notice, :success, kind: 'LINE')
    end

    def fail_line_login
      session['devise.line_data'] = request.env['omniauth.auth'].except(:extra) #except(:extra)はOmniauthから返される膨大なデータの中から不要な部分を除去してセッションに保存する
      flash[:alert] = "LINE連携に失敗しました。もう一度お試しください。"
      redirect_to new_user_session_path
    end      
  end # class OmniauthCallbacksController
end # module Users
    # You shoud configure your model like this:
    # devise :omniauthable, omniauth_providers: [:twitter]

    # You should also create an action method in this controller like this:
    # def twitter
    # end

    # More info at:
    # https://github.com/heartcombo/devise#omniauth

    # GET|POST /resource/auth/twitter
    # def passthru
    #   super
    # end

    # GET|POST /users/auth/twitter/callback
    # def failure
    #   super
    # end

    # protected

    # The path used when OmniAuth fails
    # def after_omniauth_failure_path_for(scope)
    #   super(scope)
    # end
