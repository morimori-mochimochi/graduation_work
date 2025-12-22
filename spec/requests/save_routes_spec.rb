# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "SaveRoutes", type: :request do
  let(:user) { create(:uset) }
  let(:save_route) { create(:save_route, user: user) }

  before { sign_in user }

  describe "GET /show" do
    context "正規の署名付きIDでアクセスした場合" do
      it "正常にレスポンスが返る" do
        get save_route_path(save_route)
        expect(response).to redirect_to(save_routes_path)
      end
    end

    context "生のID（数字）で直接アクセスした場合" do
      it "一覧ページへリダイレクトされる" do
        # IDを直接指定してアクセス
        get "/save_routes/#{save_route.id}"
        
        expect(response).to redirect_to(save_routes_path)
        follow_redirect!
        expect(response.body).to include("URLが無効です")
      end
    end

    context "改ざんされたIDでアクセスした場合" do
      it "一覧ページへリダイレクトされる" do
        # 正しいIDの末尾を変えてアクセス
        invalid_id = save_route.signed_id(purpose: :route_view) + "invalid"
        get "/save_routes/#{invalid_id}"

        expect(response).to redirect_to(save_routes_path)
      end
    end
  end
end
