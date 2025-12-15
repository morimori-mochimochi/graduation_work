#Dockerfileはアプリが動作する環境を定義するファイル
#どんなOS（ベースイメージ）を使う？どんなライブラリをインストールする？どんなソースコードをコピーする？コンテナ起動時にどんなコマンドを実行する？
#ベースとなるRubyの公式イメージを指定
FROM ruby:3.2.3

#必要なパッケージのインストール(不要なログ出力を抑えて静かにアップデート後)
#build-essential: Cのビルドに必要なツール
#libpg-dev: PostgreSQLと連携するためのライブラリ
#nodejs, yarn: JSとCSSのコンパイル用
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    gnupg2 \
    cron \
    vim \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

#アプリの作業ディレクトリを設定
WORKDIR /app

#指定したファイルをコンテナにコピー
COPY Gemfile Gemfile.lock ./
COPY package.json yarn.lock ./

#bundlerをインストールして依存関係を解決
RUN gem install bundler && bundle install
RUN yarn install

#アプリの全ファイルをコピー
COPY . .

# CSS / JS をビルド
RUN yarn build
RUN yarn build:css

# entrypoint.shをコンテナにコピーして実行権限を付与
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

#コンテナ外部からアクセス可能にするポート解放
EXPOSE 3000

#コンテナ起動時に実行するコマンドを指定してrailsサーバーを立ち上げる
CMD ["rails", "server", "-b", "0.0.0.0"]
