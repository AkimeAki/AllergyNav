DROP SCHEMA IF EXISTS dev;

CREATE SCHEMA dev DEFAULT CHARACTER
SET
	utf8mb4 COLLATE utf8mb4_general_ci;

USE dev;

CREATE TABLE
	stores (
		id INT(10) NOT NULL AUTO_INCREMENT,
		ip VARCHAR(40) NOT NULL,
		name VARCHAR(40) NOT NULL,
		address VARCHAR(100) NOT NULL,
		description TEXT NOT NULL,
		deleted BOOLEAN NOT NULL DEFAULT FALSE,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY(id)
	) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE
	store_histories (
		id INT(10) NOT NULL AUTO_INCREMENT,
		ip VARCHAR(40) NOT NULL,
		store_id INT(10),
		name VARCHAR(40),
		address VARCHAR(100),
		store_group_id INT(10),
		description TEXT,
		deleted BOOLEAN,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY(id)
	) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE
	menu (
		id INT(10) NOT NULL AUTO_INCREMENT,
		ip VARCHAR(40) NOT NULL,
		name VARCHAR(40) NOT NULL,
		store_id INT(10) DEFAULT NULL,
		deleted BOOLEAN NOT NULL DEFAULT FALSE,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY(id)
	) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE
	menu_histories (
		id INT(10) NOT NULL AUTO_INCREMENT,
		ip VARCHAR(40) NOT NULL,
		menu_id INT(10),
		name VARCHAR(40),
		store_id INT(10),
		deleted BOOLEAN,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY(id)
	) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE
	comments (
		id INT(10) NOT NULL AUTO_INCREMENT,
		ip VARCHAR(40) NOT NULL,
		title VARCHAR(40) NOT NULL,
		content TEXT NOT NULL,
		store_id INT(10) DEFAULT NULL,
		deleted BOOLEAN NOT NULL DEFAULT FALSE,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY(id)
	) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE
	menu_allergens (
		allergen_id VARCHAR(40) NOT NULL,
		menu_id INT(10) NOT NULL,
		deleted BOOLEAN NOT NULL DEFAULT FALSE,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY(allergen_id, menu_id)
	) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
