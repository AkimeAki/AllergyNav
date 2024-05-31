.PHONY: コンテナ一覧
ps:
	docker compose ps -a

.PHONY: コンテナ起動
init:
	@make delete
	docker compose build --no-cache
	docker compose up -d

.PHONY: コンテナ削除
delete:
	docker compose down --rmi all --volumes --remove-orphans
	docker compose -f compose.prod.yml down --rmi all --volumes --remove-orphans

.PHONY: アプリコンテナにアタッチ
attach-app:
	docker compose exec -it app bash

.PHONY: DBコンテナにアタッチ
attach-db:
	docker compose exec -it db ./cockroach sql --insecure

.PHONY: コンテナログ
logs:
	docker compose logs

.PHONY: コンテナ（本番）起動
init-prod:
	@make delete
	docker compose -f compose.prod.yml build --no-cache
	docker compose -f compose.prod.yml up -d

.PHONY: コンテナ（本番）にアタッチ
attach-prod:
	docker compose -f compose.prod.yml exec -it app sh

.PHONY: コンテナ（本番）一覧
ps-prod:
	docker compose -f compose.prod.yml ps -a

.PHONY: コンテナ（本番）ログ
logs-prod:
	docker compose -f compose.prod.yml logs
