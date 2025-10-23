#listen: Rails環境でファイル監視（ファイルの変更検知）を担っています。
#web-console: Railsの開発モードでエラー画面やビュー上に IRB（対話式Ruby）を表示してコードを実行できる機能 を提供するGemです。
#gem 'better-errors': Railsでエラーが発生したときに、見やすく、インタラクティブで、強力なエラー画面 を提供してくれるGemです。
#gem 'binding_of_caller': これがあるとREPL機能が使えてさらに便利
#brakeman: Ruby on Railsアプリ用の静的解析脆弱性診断ツール

source 'https://rubygems.org'

ruby '3.2.3'

gem 'rails', '~> 7.1.0'
gem 'pg', '>= 0.18', '< 2.0'
gem 'puma', '~> 6.0'
gem 'importmap-rails'
gem 'turbo-rails'
gem 'stimulus-rails'
gem 'devise'
gem 'geocoder'
gem 'bootsnap', require: false
gem 'dotenv-rails', groups: [:development, :test]
gem 'cssbundling-rails'
gem 'omniauth-oauth2'
gem 'omniauth-rails_csrf_protection'

group :development, :test do
  gem 'rspec-rails'
  gem 'pry-rails'
  gem 'factory_bot_rails'
  gem 'capybara'
  gem 'selenium-webdriver'
end

group :development do
  gem 'listen'
  gem 'web-console'
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'brakeman'
  gem 'rubocop', require: false
  gem 'rubocop-rails', require: false
  gem 'letter_opener'
  gem 'letter_opener_web'
end

gem "jsbundling-rails", "~> 1.3"
