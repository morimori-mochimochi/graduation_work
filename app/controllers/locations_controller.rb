class LocationsController < ApplicationController
    before_action :authenticate_user!

    def index
        @locations = current_user.locations.order(created_at: :desc)
    end

    def new; end

    def create
        @location = current_user.locations.build(location_params)
        if @location.save
            render json: @location, status: :created
        else
            render json: { errors: @location.errors.full_messages }, status: :unprocessable_entity
        end
    end
    
    private

    def location_params
        params.require(:location).permit(:name, :lat, :lng, :address)
    end
end
