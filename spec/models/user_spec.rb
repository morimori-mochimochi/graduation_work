require 'rails_helper'

RSpec.describe User, type: :model do
  describe '#create' do
    before do
      @user = FactoryBot.build(:user)
    end

    #contextには条件・状況を記述
    context 'ユーザー登録ができる場合' do
      it 'name, email, password, password_confirmationが正しく入力されていれば新規会員登録可能' do
        expect(@user).to be_valid
      end
    end

    context 'ユーザー登録できない場合' do
      it 'nameが空だと登録できない' do
        @user.name = nil
        #valid?でバリデ通過か判定
        @user.valid?
        expect(@user.errors.full_messages).to include("Invalid Email or password.")
      end

      it 'emailが空だと登録できない' do
        @user.email = nil
        @user.valid?
        expect(@user.errors.full_messages).to include("Invalid Email or password.")
      end

      it '登録ずみのEmailは再登録できない' do
        @user.saved
        #二人目のユーザーを用意
        another_user = FactoryBot.build(:user)
        another_user.email = @user.email
        another_user.valid?
        expect(another_user.errors.full_messages).to include("Email has already been taken")
      end

      it 'passwordが空だと登録できない' do
        @user.password = nil
        @user.valid?
        expect(@user.errors.full_messages).to include("Invalid Email or password.")
      end

      it 'passwordが6文字以下だと表示できない' do
        @user.password = "12345"
        @user.password_confirmation = "12345"
        @user.valid?
        expect(@user.errors.full_messages).to include("Password は6文字以上で入力してください")
      end

      it 'password=password_confiemationでないと登録できない' do
        @user.password_confirmation = ""
        @user.valid?
        expect(@user.errors.full_messages).to include("Password confirmation doesn't match Password")
      end  
    end
  end
end
