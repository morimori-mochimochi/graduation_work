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

  # URL を /api/... にする(Web画面用のルートとは分離できる）
  namespace :api do
    # APIのバージョン管理(URL は /api/v1/... になる)
    namespace :v1 do
      # 通常の index/show/create/update/destroy は作らない
      # 代わりに独自の API アクションを生やす
      resources :notifications, only: [] do
        get :due, on: :collection
        patch :sent, on: :collection
      end
      # LINE Messaging APIとのアカウント連携
      # GET /api/v1/line_linkage/new -> 連携開始URLへリダイレクト
      # POST /api/v1/line_linkage/callback -> LINE PlatformからのWebhookを受け取る
      resource :line_linkage, only: [:new]
      resources :line_webhooks, only: [:create] 
    end
  end
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
  # Defines the root path route ("/")
  # root "posts#index"
end
