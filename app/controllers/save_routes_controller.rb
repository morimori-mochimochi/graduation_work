# frozen_string_literal: true

class SaveRoutesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_save_route, only: %i[show edit update destroy]

  def index
    @save_routes = current_user.save_routes.order(created_at: :desc)
  end

  # set_save_route で @save_route がセットされる
  def show
    @notify_at = @save_route.notifications.last&.notify_at
  end

  def new
    @save_route = current_user.save_routes.new(save_route_params_for_new)
  end

  def edit; end

  def create
    @save_route = current_user.save_routes.build(processed_route_params)
    if @save_route.save
      render json: {
        message: t('.notice'),
        save_route_id: @save_route.signed_id(purpose: :route_view)
      }, status: :created
    else
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
      :name, :travel_mode, :start_time, :execution_date,
      :total_distance, :total_duration,
      start_point: %i[lat lng name],
      end_point: [:arrival_time, { mainPoint: %i[lat lng name], parkingLot: %i[lat lng name] }],
      waypoints: [
        :arrival_time,
        { stayDuration: %i[hour minute] },
        { mainPoint: %i[lat lng name], parkingLot: %i[lat lng name] }
      ]
    )
  end

  def set_save_route
    route = SaveRoute.find_signed!(params[:id], purpose: :route_view)
    @save_route = current_user.save_routes.find(route.id)
  rescue ActiveSupport::MessageVerifier::InvalidSignature, ActiveRecord::RecordNotFound
    redirect_to save_routes_path, alert: t('save_routes.set_save_route.alert')
  end

  def save_route_params_for_new
    # save_routeがあればそれを使い、ないときは空のハッシュを返す
    params.fetch(:save_route, {}).permit(:name, :travel_mode, :start_point, :end_point, :waypoints)
  end

  def processed_route_params
    route_params = save_route_params
    # travel_modeを小文字に変換
    route_params[:travel_mode]&.downcase!
    route_params
  end
end
