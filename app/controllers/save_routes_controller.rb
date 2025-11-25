class SaveRoutesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_save_route, only: %i[show edit update destroy]

  def index
    @save_routes = current_user.save_routes.order(created_at: :desc)
  end

  def show; end # set_save_route で @save_route がセットされる

  def new
    @save_route = current_user.save_routes.new(save_route_params_for_new)
  end

  def edit; end

  def create
    @save_route = current_user.save_routes.build(save_route_params)
    respond_to do |format|
      if @save_route.save
        format.html { redirect_to save_routes_path, notice: t('.notice') }
        format.json { render json: { message: t('.notice') }, status: :created }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @save_route.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    # @save_route は set_save_route でセットされる
    if @save_route.update(save_route_params)
      redirect_to @save_route, notice: t('.notice')
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @save_route.destroy
    redirect_to save_routes_path, notice: t('.notice'), status: :see_other
  end

  private

  def save_route_params
    params.require(:save_route).permit(
      :name, :travel_mode,
      start_point: [:lat, :lng], end_point: [:lat, :lng], waypoints: [:lat, :lng]
    )
  end

  def set_save_route
    @save_route = current_user.save_routes.find(params[:id])
  end

  def save_route_params_for_new
    params.fetch(:save_route, {}).permit(:name, :travel_mode, :start_point, :end_point, :waypoints)
  end
end