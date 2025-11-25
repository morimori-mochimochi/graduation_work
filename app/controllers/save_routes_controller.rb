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
    if @save_route.save
      # 成功した場合はメッセージをJSONで返す
      render json: { message: t('.notice') }, status: :created
    else
      # 失敗した場合はエラー内容をJSONで返す
      logger.error "ルートの保存に失敗しました: #{@save_route.errors.full_messages.join(', ')}"
      render json: @save_route.errors, status: :unprocessable_entity
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
      start_point: [:lat, :lng], end_point: [:lat, :lng], waypoints: [:lat, :lng, :name]
    )
  end

  def set_save_route
    @save_route = current_user.save_routes.find(params[:id])
  end

  def save_route_params_for_new
    # save_routeがあればそれを使い、ないときは空のハッシュを返す
    params.fetch(:save_route, {}).permit(:name, :travel_mode, :start_point, :end_point, :waypoints)
  end
end