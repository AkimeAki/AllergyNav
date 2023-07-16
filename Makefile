.PHONY: ps
ps:
	docker compose ps -a

.PHONY: up
up:
	docker compose build --no-cache
	docker compose up -d
	@make package-install

.PHONY: down
down:
	docker compose down --rmi all --volumes --remove-orphans

.PHONY: package-install
package-install:
	docker compose exec -it app npm ci

.PHONY: attach
attach:
	docker compose exec -it app bash
