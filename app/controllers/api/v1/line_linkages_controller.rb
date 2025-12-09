# このファイルではlineログインで得たUser IDと
# 友達登録で得たMessaging API用のUser IDを紐付けるためのエンドポイントを定義。
# LINEアカウントを連携するボタンをクリックするとこのファイルは呼ばれる

# frozen_string_literal: true

require 'net/http'
require 'uri'
require 'json'

module Api
  module V1
    # アカウント連携のためのコントローラー
    class LineLinkagesController < BaseController
      # LINEからのWebhookはCSRFトークンを含まないため、検証をスキップ
      skip_before_action :verify_authenticity_token

      # ユーザーをアカウント連携ページへリダイレクトさせる
      # nonce: webアプリのユーザーとlineアカウントを安全に紐付ける合言葉
      # アカウント連携ボタンクリックでnonceはDBに保存される
      # link_tokenによってユーザーはlineの画面へ移行する
      def new
        nonce = SecureRandom.urlsafe_base64
        current_user.update!(line_nonce: nonce)

        # line-bot-api gem　を使ってlinkTokenを発行
        # これにはLINE Login Id が必要
        # LINE Login ID はDBに保存済みの想定
        # issue_link_tokenAPIを呼び出した時、link_tokenが生成される
        # このlink_tokenを後のresponseに含まれるlink_tokenと比較することで安全性を検証
        # link_token: ユーザーをlineアプリのアカウント連携画面へ正しく誘導する通行手形
        response = line_messaging_client.issue_link_token(user_id: current_user.line_login_uid)
        # object.is_a?(Class): objectがClassまたはそのサブクラス、またはインクルードしているモジュールに属するか調べる。
        raise unless response.is_a? (Net::HTTPOK)

        link_token = JSON.parse(response.body)['linkToken']

        # ユーザーをアカウント連携ページへリダイレクト
        redirect_to "https://access.line.me/dialog/bot/accountLink?linkToken=#{link_token}"

      rescue StandardError => e
        # 捕捉されたエラーのクラス名とメッセージをログに出力
        Rails.logger.error "LINE Account Linkage failed for user #{current_user.id}: #{e.message}"
        render json: { error: 'LINE連携に失敗しました。もう一度お試しください。' }, status: :internal_server_error
      end

      private

      # ApplicationControllerからline_messaging_clientを呼び出せるように。
      # このクライアントはMessagingAPIとの通信を担当する
      def line_messaging_client
        @line_messaging_client ||= Line::Bot::V2::MessagingApi::ApiClient.new(
          channel_secret: Rails.application.credentials.line[:messaging_api_secret],
          channel_access_token: Rails.application.credentials.line[:messaging_api_channel_access_token]
        )
      end
    end
  end
end