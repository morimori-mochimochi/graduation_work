# 目次
1. [サービス概要](#anchor1)
2. [アプリのURL](#anchor2)
3. [このサービスへの思い・作りたい理由](#anchor3)
4. [ユーザー層](#anchor4)
5. [他のサービスとの差別点](#anchor5)
6. [サービス利用イメージ](#anchor6)
7. [使用方法](#anchor7)
8. [技術スタック](#anchor8)
9. [画面遷移図](#anchor9)
10. [ER図](#anchor10)
<br>
<br>
<a id="anchor1"></a>

# 1. 🚶‍♀️🚶 サービス概要 🚗💨
~~ スマートな移動をサポートします ~~
  
本アプリは車・徒歩による目的地までの最短ルートを提案し、ボタン一つで駐車場の検索、駐車した場所の保存を行い、<br>
その後駐車場から目的地まで徒歩ルートの案内まで行います。<br>
目的地に時間条件を追加すると、そこまでの所要時間から逆算して出発時間を割り出し、出発時刻5分前になるとメール通知してくれます。<br>
さらにログインすると、過去利用したルートや任意の場所を保存することが可能となり、土地勘のない地域でもスムーズな移動をサポートします。<br>
<br>

<a id="anchor2"></a>  
# 2. 🤖 アプリのURL 🤖
https://sketto-houmon-support.com/
<br>
<br>
<br>

<a id="anchor3"></a>  
# 3. 🧑‍🏫 このサービスへの思い・作りたい理由 📝
私には中学校教諭の姉がおり、平日・休日関係なく仕事に追われています。<br>
そんな姉の姿見て、私のプログラミング学習で少しでも負担を軽減できないかと考えました。<br>
このアプリを使うことで家庭訪問における、<br>
「各家庭の希望時間を加味しながら、１日に周る家庭の順序決めなければならない」という作業にかける時間を削減します。<br>
<br>
  
<a id="anchor4"></a>   
# 4. 👨‍💼 ユーザー層 👩‍💼
姉のような学校教諭だけでなく、お得意先の多い営業職の方や、<br>
１日でより多くのスポットを巡りたい観光客の行動計画作成に役立つアプリです。  
<br>
<br>

<a id="anchor5"></a>     
# 5. ✏️ 他サービスとの差別点 🖊️
すでにGoogleマップにはこのような機能が搭載されています。<br>
しかしGoogleマップは多機能がゆえに便利な機能がありながらも他の機能に埋もれてしまい、使いこなせている人は少ない印象を受けました。<br>
そのためこのアプリでは、「指定した場所から目的地までの移動の補助」という機能のみに焦点を当て、シンプルでどのような方でも直感的に操作が可能なUIを提供します。<br>
さらに訪問先到着時刻の指定が可能な上、出発時刻前に通知することでスケジュールのズレを防止します。<br>
<br>
<br>

<a id="anchor6"></a>     
# 6. 💭 サービス利用イメージ 💭
## 1 出発点と目的地を設定する
地図上から選択する、もしくは検索フォームから「名称」「住所」でも選択可能です。
<br>
<br>   
## 2 目的地に条件を設定する
到着したい時刻を設定できます。
通知を設定すると、到着時間から逆算した出発時間5分前にメール通知でお知らせします。
<br>
<br> 
## 3 駐車場を選ぶ
ボタン一つで目的地付近の駐車場を表示させ、選択できます。選択すると車での目的地が駐車場となり、駐車場から目的地までの徒歩ルートも案内します。
<br>
<br>  
## 4 カレンダーでルートを閲覧
カレンダー上に保存したルート表示するので、一眼で実施予定ルートを確認可能です。
<br>
<br>
<br>
<a id="anchor7"></a>  
# 7. 🔰 使用方法 🔰
  
> [!IMPORTANT]
> 一部のアニメーション機能が落ちる可能性があるため、ブラウザはGoogle Chromeをご利用ください。
<br>
## 地点を選択
https://github.com/user-attachments/assets/f696022c-5720-42f6-a17d-ace0b799c00f
<br>
    
## 地点を選択
https://github.com/user-attachments/assets/59a937c6-46b7-4841-bfa8-ac294dd3dbb6
<br>
    
## ルート描画
https://github.com/user-attachments/assets/14dec8bf-4495-498d-9ff4-dc4a454ba43e
<br> 
    
## ルート保存
https://github.com/user-attachments/assets/ea45d2bf-fefb-4c15-9721-8c12781aafcb
<br>
    
## ルート編集
https://github.com/user-attachments/assets/d5805e99-19d5-4eff-9133-256ebb30b852
<br> 
    
## ルート編集
https://github.com/user-attachments/assets/726b9201-d958-49cc-b874-50d14cefa2f6
<br>
  
## 通知設定
https://github.com/user-attachments/assets/6c147096-0f85-4fe3-93e3-7b17cb99139a
<br>
<br>

<a id="anchor8"></a>    
# 8. 🔧 技術スタック 🔨
<br>

|  項目  |  技術  |
| ------ | ------ |
| フロントエンド | HTML + JavaScript + Tailwind CSS(DasiyUI) |
| バックエンド | Ruby on Rails |
| DB | PostgreSQL |
| ログイン | devise + omniauth-line |
| 開発環境 | Docker |
| デプロイ | Render |
| 地図 | Google maps platform |
| 住所を地図座標に変換 | Geocoding API |
| ルートのリアルタイム追跡 | Directions API + Maps Javascript API + Geolocation API |
| 施設名の曖昧検索 | Places API |
| 地図上にクリックして場所選択 | Maps JavaScript API |
| ルート検索 | Directions API |
<br>
<br>

<a id="anchor9"></a>    
# 9. 🗾 画面遷移図 🛣️
<br>

[こちらから](https://www.figma.com/design/xR8C2mieQqLhdE6i9scIhG/Figma-basics?node-id=2766-96&p=f&m=draw)
<br>

<a id="anchor10"></a>    
# 10. 📈 ER図　📉
  
    
[![Image from Gyazo](https://i.gyazo.com/7e96586223b27f37598947e562bb49f4.jpg)](https://gyazo.com/7e96586223b27f37598947e562bb49f4)

[URLはこちら](https://app.diagrams.net/?src=about#G1lW5tENcvqQzEesh9Gtb2Tra8_Y00TAHI#%7B%22pageId%22%3A%22R2lEEEUBdFMjLlhIrx00%22%7D)
  
