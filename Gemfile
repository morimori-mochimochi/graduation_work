# frozen_string_literal: true

# listen: Rails環境でファイル監視（ファイルの変更検知）を担っています。
# web-console: Railsの開発モードでエラー画面やビュー上に IRB（対話式Ruby）を表示してコードを実行できる機能 を提供するGemです。
# gem 'better-errors': Railsでエラーが発生したときに、見やすく、インタラクティブで、強力なエラー画面 を提供してくれるGemです。
# gem 'binding_of_caller': これがあるとREPL機能が使えてさらに便利
# gem 'brakeman: Ruby on Railsアプリ用の静的解析脆弱性診断ツール

source 'https://rubygems.org'

ruby '3.2.3'

gem 'bootsnap', require: false
gem 'cssbundling-rails'
gem 'devise'
gem 'devise-i18n'
gem 'devise-i18n-views'
gem 'dotenv-rails', groups: %i[development test]
gem 'geocoder'
gem 'importmap-rails'
gem 'omniauth-line'
gem 'omniauth-oauth2'
gem 'omniauth-rails_csrf_protection'
gem 'pg', '>= 0.18', '< 2.0'
gem 'puma', '~> 6.0'
gem 'rails', '~> 7.1.0'
gem 'stimulus-rails'
gem 'turbo-rails'

group :development, :test do
  gem 'capybara'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'pry-rails'
  gem 'rspec-rails'
  gem 'selenium-webdriver'
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'brakeman'
  gem 'letter_opener'
  gem 'letter_opener_web'
  gem 'listen'
  gem 'rubocop', require: false
  gem 'rubocop-rails', require: false
  gem 'web-console'
end

gem 'jsbundling-rails', '~> 1.3'
