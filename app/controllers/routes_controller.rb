class RoutesController < ApplicationController
  def new
  end

  def create
    respond_to do |format|
      format.html
      format.json { render json: {route: params[:route]} }
    end
  end

  def show
  end
end
