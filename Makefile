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

.PHONY: コンテナにアタッチ
attach:
	docker compose exec -it app bash

.PHONY: コンテナ（本番）起動
init-prod:
	docker compose down --rmi all --volumes --remove-orphans
	docker compose -f compose.prod.yml down --rmi all --volumes --remove-orphans
	docker compose -f compose.prod.yml build --no-cache
	docker compose -f compose.prod.yml up -d

.PHONY: コンテナ（本番）にアタッチ
attach-prod:
	docker compose -f compose.prod.yml exec -it app sh
