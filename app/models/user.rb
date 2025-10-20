class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # Diviseの基本設定
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :omniauthable, omniauth_providers: [:line]

  # バリデーション      
  validates :first_name, presence: true, unless: :line_account?
  validates :last_name, presence: true, unless: :line_account?
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }, unless: :line_account?
  validates :password, presence: true, length: { minimum: 6, message: "は6文字以上で入力してください"}, unless: :line_account?
  validates :uid, uniqueness: { scope: :provider }, if: -> { provider.present? }
 
  #クラスメソッド
  def self.from_omniauth(auth, current_user = nil)
    # すでにログイン中のユーザーがLINE未連携なら、LINEアカウントを紐付ける
    return link_line_account(auth, current_user) if current_user&.line_connected? == false

    # そうでなければ、LINE情報からユーザーを検索or新規作成
    sign_in_or_create_user_from_line(auth)
  end

  def self.link_line_account(auth, current_user)
    success = current_user.update(
      provider: auth.provider,
      uid: auth.uid,
      email: auth.info.email,
      line_notify: true
    )

    success ? current_user : nil
  end

  def self.sign_in_or_create_user_from_line(auth)
    # LINE連携済みのuserのusername,passwordは更新しない
    find_or_create_by(
      provider: auth.provider,
      uid: auth.uid,
      email: auth.info.email
    ) do |user|
      user.username = auth.info.name
      user.password = Devise.friendry_token[0, 20]
      user.line_notify = true
    end
  end

   # インスタンスメソッド
  def line_connected?
    uid.present? && provider.present?
  end

end
