require 'net/http'
require 'uri'
require 'json'

uri = URI.parse("https://api.line.me/v2/bot/message/push")

# Net::HTTPオブジェクトを作成
# まだ実際にデータは送信していないが「どこに接続するか」を定義した状態
http = Net::HTTP.new(uri.host, uri.port)
# 「SSL/TLS（暗号化通信）を使用する」という設定を有効にしている
http.use_ssl = true

# リクエストの内容を作成（POSTメソッド）
request = Net::HTTP::Post.new(uri.path)
request["Content-Type"] = "application/json"
request["Authorization"] = "Bearer #{Rails.application.credentials.line[:channel_access_token]}"

# 送信するデータをセット
data = {
  to: "#{ current_user.line_login_uid }",
  messages: [{ 
    type: "test",
    text: "プッシュ通知テスト中"
  }]
}
request.body = data.to_json

# 送信実行して結果を受け取る
response = http.request(request)

# 結果の確認(200なら成功)
puts response.code