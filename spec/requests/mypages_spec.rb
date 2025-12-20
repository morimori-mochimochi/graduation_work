# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "Mypages", type: :request do
  let(:user) { create(:user) }

  before { sign_in user }

  describe "GET /show" do
    it "returns http success" do
      get mypage_path
      expect(response).to have_http_status(:success)
    end
  end
end
