# ◾️サービス概要
本アプリは車・徒歩による目的地までの最短ルートを提案し、ボタン一つで駐車場の検索、駐車した場所の保存を行い、その後駐車場から目的地まで徒歩ルートの案内まで行います。<br>
目的地に時間条件を追加すると、そこまでの所要時間から逆算して出発時間を割り出し、出発時刻5分前になるとLINEでプッシュ通知してくれます。<br>
さらにログインすると、過去利用したルートや任意の場所を保存することが可能となり、土地勘のない地域でもスムーズな移動をサポートします。<br>

# ◾️このサービスへの思い・作りたい理由
私には中学校教諭の姉がおり、平日・休日関係なく仕事に追われています。<br>そんな姉の姿見て、私のプログラミング学習で少しでも負担を軽減できないかと考えました。<br>
このアプリを使うことで家庭訪問における、「各家庭の希望時間を加味しながら、１日に周る家庭の順序決めなければならない」という課題にかける時間を削減します。<br>

# ◾️ユーザー層
姉のような学校教諭だけでなく、お得意先の多い営業職の方や、１日でより多くのスポットを巡りたい観光客の行動計画作成に役立つアプリです。

# ◾️他サービスとの差別点
すでにGoogleマップにはこのような機能が搭載されています。<br>しかしGoogleマップは多機能がゆえに便利な機能がありながらも他の機能に埋もれてしまい、使いこなせている人は少ない印象を受けました。<br>
そのためこのアプリでは、「指定した場所から目的地までの移動の補助」という機能のみに焦点を当て、シンプルでどのような方でも直感的に操作が可能なUIを提供します。<br>
さらに訪問先到着時刻の指定が可能な上、出発時刻前に通知することでスケジュールのズレを防止します。<br>

# ◾️サービス利用イメージ

## 1 出発点と目的地を設定する
地図上から選択する、もしくは検索フォームから「名称」「住所」でも選択可能です。

## 2 目的地に条件を設定する
到着したい時刻を設定できます。
通知をオンにすると、到着時間から逆算した出発時間5分前にLINEプッシュ通知でお知らせします。

## 3 駐車場を選ぶ
ボタン一つで目的地付近の駐車場を表示させ、選択できます。選択すると車での目的地が駐車場となり、駐車場から目的地までの徒歩ルートも案内します。

## 4 駐車場を保存する
駐車場に到着すると、「駐車した場所を記録しますか？」と表示され、駐車位置の保存が可能です。立体駐車場の場合は階数の記入ができます。

# ◾️ユーザーの獲得について

### 1 SNS(主にX)での利用者、レビューの獲得を行います。

### 2 このアプリの原点となる姉、そしてその周囲の学校教諭の皆さんに使って頂く

# ◾️技術スタック
|  項目  |  技術  |
| ------ | ------ |
| フロントエンド | HTML + CSS + JavaScript |
| バックエンド | Ruby on Rails |
| DB | PostgreSQL |
| ログイン | devise |
| 開発環境 | Docker |
| デプロイ | Render |
| 地図 | Google maps platform |
| 住所を地図座標に変換 | Geocoding API |
| ルートのリアルタイム追跡 | Directions API + Maps Javascript API + Geolocation API |
| 施設名の曖昧検索 | Places API |
| 地図上にクリックして場所選択 | Maps JavaScript API |
| ルート検索 | Directions API |
| LINEプッシュ通知 | Messaging API |

# ◾️モデル構成
- User(id, email, first_name, last_name, encrypted_password, created_at, updated_at)
- Parking(id, latitude, longitude, address, datetime, floor, user_id, created_at, updated_at)
- Route(id, origin, destination, waypoints, distance, duration, raw_route_data, user_id, created_at)
- TripPlan(id, user_id, route_id, arrival_time, departure_time, notify_at, notified)

# ◾️MVPまでに実装する機能

* [] ルート検索
* [] 中継点の追加機能
* [] 駐車場検索
* [] 住所と名称で検索可能に

# ◾️本リリースまでに追加予定の機能

* [] 目的地への到着時刻の指定
* [] 到着時間から逆算した出発時間を提案
* [] 出発時刻になるとLINEプッシュ通知
* [] ログイン機能
* [] 過去の経路に名前をつけて保存（ログイン後）
* [] 選択した場所に名前をつけて保存（ログイン後）
* [] 駐車場の位置保存（立駐は階数を記入可能に）

# ◾️画面遷移図

[こちらから](https://www.figma.com/design/xR8C2mieQqLhdE6i9scIhG/Figma-basics?node-id=2766-96&p=f&m=draw)
