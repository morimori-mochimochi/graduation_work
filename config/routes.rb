# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks'
  }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  root 'top#index'

  resources :routes, only: [:new, :create, :show] do
    collection do
      get :walk
      get :car
      get :walk_navigation
      get :car_navigation
    end
  end

  # cllection doは特定のIDを含まないURLを定義する（今回はlocationsの集合体に対して)
  # search_box.jsからのfetchリクエストこのURLに届き、
  # LocationsControllerのsearchアクションで検索可能に
  resources :locations do
    collection do
      get 'search'
    end
  end

  resources :save_routes do
    resources :notifications, only: [:create]
  end

  resource :calendar, only: [:index]

  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
  # Defines the root path route ("/")
  # root "posts#index"
end
