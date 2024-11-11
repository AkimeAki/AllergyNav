# URL

`phpMyAdmin`: http://localhost:10111

# 環境構築

1. `make init`
2. `make attach`
3. `npm ci`
4. `npm run db:generate`
5. `npm run db:deploy`
6. `npm run db:seed`

# コマンド

`npm run db:generate`: Prismaで型生成
`npm run db:migrate`: Prismaでマイグレーションファイル生成
`npm run db:deploy`: マイグレーションファイルを反映
