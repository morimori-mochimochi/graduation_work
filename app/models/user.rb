# frozen_string_literal: true

class User < ApplicationRecord # :nodoc:
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # Diviseの基本設定
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :omniauthable, omniauth_providers: [:line]

  has_many :locations, dependent: :destroy

  # バリデーション
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP },
                    unless: :line_connected?
  validates :password, presence: true, length: { minimum: 6 }, unless: :line_connected?
  validates :uid, uniqueness: { scope: :provider }, if: -> { provider.present? }

  # インスタンスメソッド
  def line_connected?
    uid.present? && provider.present?
  end

  # クラスメソッド
  def self.sign_in_or_create_user_from_line(auth)
    user = find_or_initialize_by_line_auth(auth)

    unless user.persisted?
      user.name = auth.info.name
      user.email = auth.info.email
      # パスワードはバリデーションを通過させるためのダミー
      user.password = Devise.friendly_token[0, 20]
      user.save!
    end
    user
  end

  # Deviseのバリデーションをオーバーライド
  # superは親クラスの同名のメソッドを呼び出す(Deviseの認証で内部的に使われている)
  def password_required?
    super && !line_connected?
  end

  def email_required?
    super && !line_connected?
  end

  def self.find_or_initialize_by_line_auth(auth)
    # providerとuidでユーザーを検索、または新規作成(メモリ上)
    find_or_initialize_by(provider: auth.provider, uid: auth.uid)
  end
end
