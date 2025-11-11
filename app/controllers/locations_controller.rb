# frozen_string_literal: true

class LocationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_location, only: %i[show edit update destroy]

  def index
    @locations = current_user.locations.order(created_at: :desc)
  end

  def show; end

  def new
    @location = current_user.locations.new(location_params_for_new)
  end

  def edit; end

  def create
    @location = current_user.locations.build(location_params)
    if @location.save
      redirect_to locations_path, notice: t('.notice')
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @location.update(location_params)
      redirect_to @location, notice: t('.notice')
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @location.destroy
    redirect_to locations_path, notice: t('.notice'), status: :see_other
  end

  def search
    # ログインしているユーザーが保存した場所から検索
    @locations = current_user.locations.where("name LIKE ? OR address LIKE ?", "%#{params[:query]}%", "%#{params[:query]}%")
    render json: @locations.map { |loc| { id: loc.id, name: loc.name, address: loc.address, latitude: loc.lat, longitude: loc.lng }}
  end

  private

  def location_params
    params.require(:location).permit(:name, :lat, :lng, :address)
  end

  def set_location
    @location = current_user.locations.find(params[:id])
  end

  # paramsの中から :location というキーの値を取り出そうとする
  # params に :location が存在すれば、その値（{ name: '...', lat: '...' } のようなハッシュ）を返す
  # :location が存在しない場合エラーを発生させる代わりに第二引数で指定されたデフォルト値である空のハッシュ {} を返す
  # permit: name, lat, lng, address というキーとその値だけを受け取る
  def location_params_for_new
    params.fetch(:location, {}).permit(:name, :lat, :lng, :address)
  end
end
