# 開発環境構築

## 環境構築

1. `make init`
   Dockerコンテナ起動

2. `make attach-app`
   Dockerコンテナ（Next.js）にアタッチ

3. `npm ci`
   モジュールインストール

4. `npm run db:generate`
   データベースの型生成

5. `npm run db:deploy`
   ローカルのDBにマイグレーション

6. `npm run db:seed`
   ローカルのDBにテストデータを挿入

## コマンド

`npm run db:generate`: Prismaで型生成
`npm run db:migrate`: Prismaでマイグレーションファイル生成
`npm run db:deploy`: マイグレーションファイルを反映
