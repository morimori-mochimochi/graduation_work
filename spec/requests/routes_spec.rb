# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Routes', type: :request do
  describe 'GET /new' do
    it 'returns http success' do
      get car_routes_path
      expect(response).to have_http_status(:success)
    end
  end
end
