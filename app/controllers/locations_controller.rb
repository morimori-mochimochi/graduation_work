class LocationsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_location, only: %i[show, edit, update, destroy]

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

    def show; end

    def edit; end

    def update
        if @location.update(location_params)
            redirect_to @location, notice: '場所の情報を更新しました'
        else
            render :edit, status: :unprocessable_entity
        end
    end

    def destroy
        @location.destroy
        redirect_to locations_path, notice: '削除しました', status: :see_other
    end
    
    private

    def location_params
        params.require(:location).permit(:name, :lat, :lng, :address)
    end

    def set_location
        @location = current_user.locations.find(params[:id])
    end
end
