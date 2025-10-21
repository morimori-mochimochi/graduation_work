# frozen_string_literal: true
# このコントローラはDivise（認証ライブラリ）＋Omniauth（外部ログイン連携)の仕組みを使って「LINEでログイン」する処置を担当
# ユーザーがログインした時に送られてくる認証情報を受け取ってアプリ内のUserモデルと結びつける役割を担う
module Users
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    skip_before_action :verify_authenticity_token, only: :line # LINEからのリクエストは外部サイトから来るためCSFRトークン検証をスキップ

    def line
      @user = User.from_omniauth(request.env['omniauth.auth'], current_user) # LINEから帰ってきた情報はrequest.env['omniauth.auth']に入っている
                                                                             # User.from_omniauthはUserモデルで定義されたクラスメソッド。このメソッドが「LINEの認証情報を元に、既存のユーザーを探したり、新規作成」したりする
      notify_line_already_linked and return if current_user && @user.nil?  #もし他ユーザーがすでにそのアカウントでLINE連携済みなら警告を出して中断する。

      if @user.persisted? #「persisted?」は「DBに保存されているか」を表す
        complete_line_login  #保存済みならログイン成功、未保存なら失敗処理へ進む
      else
        fail_line_login
      end
    end

    private

    def notify_line_already_linked
      redirect_to user_setting_path
      set_flash_message(:alert, :failure, kind: 'LINE', reason: '他アカウントでLINE連携済みです')
    end

    def complete_line_login
      sign_in_and_redirect @user, event: :authentication
      set_flash_message(:notice, :success, kind: 'LINE')
    end

    def fail_line_login
      session['devise.line_data'] = request.env['omniauth.auth'].expect(:extra)
      redirect_to new_user_registration_url
      set_flash_message(:alert, :failure, kind:'LINE', reason: 'LINE連携に失敗しました')
    end      
  end # class OmniauthCallbacksController
end # module Users
    # You should configure your model like this:
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
