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
    if @save_route.save!
      redirect_to save_routes_path, notice: t('.notice')
    else
      render :new, status: :unprocessable_entity
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
    permitten_params = params.require(:save_route).permit(:name, :travel_mode)
    # JSON形式の文字列で送られてくることを想定
    # digを使うことで値がなくてもエラーで止まらずnilを返す
    permitted_params[:start_point] = JSON.parse(params[:save_rotue][:start_point]) if params.dig(:save_route, :start_point)
    permitted_params[:end_point] = JSON.parse(params[:save_route][:end_point]) if params.dig(:save_route, :end_point)
    permitted_params[:waypoints] = JSON.parse(params[:save_route][:waypoints]) if params.dig(:save_route, :waypoints)
    permitted_params
  end

  def set_save_route
    @save_route = current_user.save_routes.find(params[:id])
  end

  def save_route_params_for_new
    params.fetch(:save_route, {}).permit(:name, :travel_mode, :start_point, :end_point, :waypoints)
  end
end