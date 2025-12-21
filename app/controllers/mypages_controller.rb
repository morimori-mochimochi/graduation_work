# frozen_string_literal: true

class MypagesController < ApplicationController
  before_action :authenticate_user!

  def show; end

  def edit; end

  def update
    if current_user.update_without_password(user_params)
      redirect_to mypage_path, notice: t('.notice')
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @user = current_user
    @user.destroy
    redirect_to root_path, notice: t('.notice')
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
end
