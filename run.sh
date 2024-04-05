#!/bin/bash

# 終了ステータスが0じゃなかったら中断
set -e

# コンテナ起動時に持っているSQLiteのデータベースファイルは、後続処理でリストアに成功したら削除したいので、リネームしておく
if [ -f /app/prisma/db.sqlite ]; then
  mv /app/prisma/db.sqlite /app/prisma/db.sqlite.bk
fi

# Cloud Storage からリストア
litestream restore -if-replica-exists -config /etc/litestream.yml /app/prisma/db.sqlite

if [ -f /app/prisma/db.sqlite ]; then
  # リストアに成功したら、リネームしていたファイルを削除
  echo "---- Restored from Cloud Storage ----"
  rm /app/prisma/db.sqlite.bk
else
  # 初回起動時にはレプリカが未作成であり、リストアに失敗するので、
  # その場合には、冒頭でリネームしたdbファイルを元の名前に戻す
  echo "---- Failed to restore from Cloud Storage ----"
  mv /app/prisma/db.sqlite.bk /app/prisma/db.sqlite
fi

# メインプロセスに、litestreamによるレプリケーション、
# サブプロセスに Next.js アプリケーションを走らせる
exec litestream replicate -exec "npm run start" -config /etc/litestream.ymls
