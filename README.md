[![Deploy to Firebase Hosting on merge](https://github.com/teritamas/en-xross-xr-hackathon/actions/workflows/firebase-hosting-merge.yml/badge.svg?branch=main)](https://github.com/teritamas/en-xross-xr-hackathon/actions/workflows/firebase-hosting-merge.yml)

# エモリバ

エモリバは東京ドームシティで巻き起こる熱狂を、WebARで可視化します。同時に過去のイベントの盛り上がりも振り返り、過去の熱狂を追体験することができます。

- [作品紹介ページ - Proto Pedia](https://protopedia.net/prototype/5257)

## Quick Start

### 1. 必要情報の取得

はじめに下記のサービスにアクセスし、利用に必要な情報を取得する。API キーやアカウントが存在しない場合は作成する。

| サービス名   | URL                               | 必要な情報             |
| ------------ | --------------------------------- | ---------------------- |
| Google Cloud | https://console.cloud.google.com/ | サービスアカウントキー |

#### 1-1. `.env`の作成

`.env.example`をコピーして、`.env`を作成する。その後、それぞれのサービスから取得した情報を`.env`に設定する。

```bash
# GCPの設定
GOOGLE_APPLICATION_CREDENTIALS=${GCPのサービスアカウントキーを配置したパス}
```

### 2. サーバの起動

必要ライブラリをインストール。

```bash
npm install
```

開発用サーバを起動する。

```bash
npm run dev
```

実行後、以下の URL にアクセスする。

- http://localhost:3000

## デプロイ

本アプリケーションは、Firebaseにデプロイされている。デプロイを実行する場合、以下のコマンドを実行する。

```bash
npm run build -- --preset=firebase
firebase deploy --only functions:server,hosting
```

## その他

### AR.jsの参考になる情報

随時追加予定

- [Introduction – A-Frame](https://aframe.io/docs/1.5.0/introduction/)
- [AR.js Documentation](https://ar-js-org.github.io/AR.js-Docs/)

### 利用しているフォント

以下のパッケージより「ふい字」を利用している

- https://github.com/studioTeaTwo/aframe-japanese-font
