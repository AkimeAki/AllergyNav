#!/bin/bash

# 終了ステータスが0じゃなかったら中断
set -e

# コンテナ起動時に持っているSQLiteのデータベースファイルは、後続処理でリストアに成功したら削除したいので、リネームしておく
if [ -f ./prisma/db.sqlite ]; then
  mv ./prisma/db.sqlite ./prisma/db.sqlite.bk
fi

# Cloud Storage からリストア
litestream restore -if-replica-exists -config /etc/litestream.yml ./prisma/db.sqlite

if [ -f ./prisma/db.sqlite ]; then
  # リストアに成功したら、リネームしていたファイルを削除
  echo "---- Restored from Cloud Storage ----"
  rm ./prisma/db.sqlite.bk
else
  # 初回起動時にはレプリカが未作成であり、リストアに失敗するので、
  # その場合には、冒頭でリネームしたdbファイルを元の名前に戻す
  echo "---- Failed to restore from Cloud Storage ----"
  mv ./prisma/db.sqlite.bk ./prisma/db.sqlite
fi

# メインプロセスに、litestreamによるレプリケーション、
# サブプロセスに Next.js アプリケーションを走らせる
exec litestream replicate -exec "npm run start" -config /etc/litestream.yml
