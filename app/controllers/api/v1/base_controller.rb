# frozen_string_literal: true

require 'line/bot' # line-bot-api を読み込む

module Api
  module V1
    class BaseController < ApplicationController
      # このBaseControllerを継承するAPIコントローラは、
      # デフォルトでユーザー認証が必須になります。
      before_action :authenticate_user!
    end
  end
end
  