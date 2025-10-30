# frozen_string_literal: true

class RoutesController < ApplicationController # :nodoc:
  def show; end
  def new; end

  def create
    respond_to do |format|
      format.html
      format.json { render json: { route: params[:route] } }
    end
  end
end
