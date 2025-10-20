# frozen_string_literal: true

class Users::LineRegistrationsController < Devise::RegistrationsController
  # GET /users/line/email
  # LINE認証後、メールアドレスを入力させるためのフォーム画面
  def new
    # sessionにLINEの認証情報がなければ、不正なアクセスとみなしトップページへ
    redirect_to root_path, alert: '不正なアクセスです。' unless session['devise.line_data']

    @user = User.new
  end

  # POST /users/line/email
  # メールアドレス入力フォームから送信された情報をもとに、ユーザー登録またはアカウント連携を行う
  def create
    line_data = session['devise.line_data']
    # sessionが切れている場合は、再度LINEログインからやり直してもらう
    unless line_data
      redirect_to new_user_session_path, alert: 'セッションが切れました。もう一度LINEログインからやり直してください。'
      return
    end

    # 入力されたメールアドレスで既存ユーザーを検索
    @user = User.find_by(email: user_params[:email])

    if @user
      # Case B: 既存ユーザーが見つかった場合 (アカウント連携)
      # パスワードを検証し、正しければLINEアカウントを紐付ける
      if @user.valid_password?(user_params[:password])
        @user.update(provider: line_data['provider'], uid: line_data['uid'])
        # session情報を削除
        session.delete('devise.line_data')
        set_flash_message! :notice, :updated, scope: 'devise.omniauth_callbacks', kind: 'LINE'
        sign_in_and_redirect @user, event: :authentication
      else
        # パスワードが間違っている場合
        flash.now[:alert] = 'パスワードが正しくありません。'
        render :new, status: :unprocessable_entity
      end
    else
      # Case A: 新規ユーザーの場合
      @user = User.new(
        email: user_params[:email],
        password: user_params[:password],
        password_confirmation: user_params[:password_confirmation],
        first_name: line_data.dig('info', 'name'), # LINEから取得した名前をセット
        provider: line_data['provider'],
        uid: line_data['uid']
      )

      if @user.save
        session.delete('devise.line_data')
        set_flash_message! :notice, :success, scope: 'devise.omniauth_callbacks', kind: 'LINE'
        sign_in_and_redirect @user, event: :authentication
      else
        render :new, status: :unprocessable_entity
      end
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end