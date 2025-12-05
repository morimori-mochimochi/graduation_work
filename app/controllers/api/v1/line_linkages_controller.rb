# frozen_string_literal: true

class Api::V1::LineLinkagesController < ApplicationController
  # CSRF保護をAPIモードでは無効にする
  # APIキーなどでの認証が望ましいが、今回は省略
  skip_before_action :verify_authenticity_token

  # 認証済みであることが前提
  before_action :authenticate_user!

  def update
    line_user_id = params[:line_user_id]

    if line_user_id.blank?
      render json: { error: 'line_user_id is required' }, status: :bad_request
      return
    end

    if current_user.update(line_user_id:)
      render json: {status: 'success', message: 'LINE account linked successfully.' }, status: :ok
    else
      render json: { error: 'Failed to link LINE account', details: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def authenticate_api_key
    #リクエスパラメータからAPIキーを取得
    provided_key = params[:api_key]
    # Railscredencialsから正しいAPIキーを取得
    correct_key = Rails.application.credentials.gas_api_key

    # キーが一致しない場合は401 Unauthorizeエラーを試す
    render json: { error: 'Unauthorized' }, status: :unauthorized unless provided_key == correct_key
  end
end
