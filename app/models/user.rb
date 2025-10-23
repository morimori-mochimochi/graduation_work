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

  # インスタンスメソッド
  def line_connected?
    uid.present? && provider.present?
  end
 
  #クラスメソッド
  def self.sign_in_or_create_user_from_line(auth)
    # providerとuidでユーザーを検索、または新規作成(メモリ上)
    user = find_or_initialize_by(provider: auth.provider, uid: auth.uid) do |u|
      # 新規作成の場合のみ、このブロックが実行される
      u.name = auth.info.name
      u.password = Devise.friendly_token[0, 20] # パスワードを自動生成
    end

    # 既存ユーザーの場合も名前を更新する（LINEの表示名変更に対応）
    user.name = auth.info.name if user.persisted?

    user.save # ユーザーを保存（新規・更新）

    unless user.persisted?
      Rails.logger.error "❌ User保存失敗: #{user.errors.full_messages.join(',')}"
    end
    user
  end

  def password_required?
    super && !line_connected?
  end
end
