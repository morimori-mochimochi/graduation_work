# frozen_string_literal: true

class Api::V1::LineLinkagesController < ApplicationController
  # CSRF保護をAPIモードでは無効にする
  # APIキーなどでの認証が望ましいが、今回は省略
  skip_before_action :verify_authenticity_token

  def create
    line_user_id = params[:line_user_id]

    if current_user.nil?
      render json: { error: 'User not logged in' }, status: :unauthorized
      return
    end

    if line_user_id.blank?
      render json: { error: 'line_user_id is required' }, status: :bad_request
      return
    end

    if current_user.update(line_user_id: line_user_id)
      render json: {status: 'success', message: 'LINE account linked successfully.' }, status: :ok
    else
      render json: { error: 'Failed to link LINE account', details: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
