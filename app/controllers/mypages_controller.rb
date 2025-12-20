# frozen_string_literal: true

class MypagesController < ApplicationController
  before_action :authenticate_user!

  def show; end

  def edit; end

  def update
    if current_user.update(params)
      redirect_to mypages_path, notice: t('.notice')
    else
      render :edit, status: :unprocessable_entity
    end
  end
end
