class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # Diviseの基本設定
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :omniauthable, omniauth_providers: [:line]

  # バリデーション      
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }, unless: :line_connected?
  validates :password, presence: true, length: { minimum: 6, message: "は6文字以上で入力してください"}, unless: :line_connected?
  validates :uid, uniqueness: { scope: :provider }, if: -> { provider.present? }
 
  #クラスメソッド
  def self.from_omniauth(auth, current_user = nil)
    return link_line_account(auth, current_user) if current_user&.line_connected? == false

    sign_in_or_create_user_from_line(auth)
  end

  def self.link_line_account(auth, current_user)
    success = current_user.update(
      provider: auth.provider,
      uid: auth.uid,
      email: nil,
      password: Devise.friendly_token[0, 20],
      name: auth.info.name
    )

    success ? current_user : nil
  end

  def self.sign_in_or_create_user_from_line(auth)
    User.find_or_create_by(
      provider: auth.provider,
      uid: auth.uid,
    ) do |user|
      user.name = auth.info.name
      user.email =auth.info.email
    end
  end

   # インスタンスメソッド
  def line_connected?
    uid.present? && provider.present?
  end

  def password_required?
    super && !line_connected?
  end
end
