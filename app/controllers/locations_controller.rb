class LocationsController < ApplicationController
    before_action :authenticate_user!

    def index
        @locations = current_user.locations.order(created_at: :desc)
    end

    def new; end

    def create
        
end
