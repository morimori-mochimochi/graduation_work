class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # Diviseの基本設定
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :omniauthable, omniauth_providers: [:line]

  # バリデーション      
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }, unless: :line_account?
  validates :password, presence: true, length: { minimum: 6, message: "は6文字以上で入力してください"}, unless: :line_account?
  validates :uid, uniqueness: { scope: :provider }, if: -> { provider.present? }
 
  #クラスメソッド
  def self.from_omniauth(auth, current_user = nil)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      #emailはnilのまま
      user.email = nil
      #パスワードはDeviseが内部的に要求するため、ランダムなトークンを設定
      user.password = Devise.friendly_token[0, 20]
      #LINEから取得した名前をnameに設定
      user.name = auth.info.name
    end
  end

   # インスタンスメソッド
  def line_connected?
    uid.present? && provider.present?
  end

end
