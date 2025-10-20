class EmailRegistrationsController < ApplicationController
  before_action :authenticate_user!

  def email_registration
  end

  def email_registration_submit
    if current_user.update(user_params)
      redirect_to rooot_path, notice: "メールアドレスを登録しました"
    else
      render :email_registration, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end
end