namespace :push_line do
  desc "LINE通知テスト"
  task send_test: :environment do
    require 'net/http'
    require 'uri'
    require 'json'

    uri = URI.parse("https://api.line.me/v2/bot/message/push")

    # Net::HTTPオブジェクトを作成
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    # リクエストの内容を作成（POSTメソッド）
    request = Net::HTTP::Post.new(uri.path)
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{Rails.application.credentials.line[:messaging_api_channel_access_token]}"

    # Rakeタスクではcurrent_userが使えないため、DBからユーザーを取得します
    # line_login_uidが登録されているユーザーの中で、最後に登録されたユーザーを取得します
    user = User.where.not(line_login_uid: nil).last

    unless user
      puts "LINE UIDが登録されているユーザーが見つかりませんでした。"
      return
    end

    # 送信するデータをセット
    data = {
      to: user.line_login_uid,
      messages: [{ 
        type: "text", # 'test' ではなく 'text' が正しい指定です
        text: "プッシュ通知テスト中"
      }]
    }
    request.body = data.to_json

    # 送信実行して結果を受け取る
    response = http.request(request)

    # 結果の確認(200なら成功)
    puts "Response Code: #{response.code}"
    puts response.body unless response.code == '200'
  end
end