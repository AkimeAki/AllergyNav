-- CreateTable
CREATE TABLE "users" (
    "id" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING,
    "role" STRING NOT NULL DEFAULT 'normal',
    "verified" BOOL NOT NULL DEFAULT false,
    "deleted" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_verify_codes" (
    "user_id" STRING NOT NULL,
    "code" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_verify_codes_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_ips" (
    "user_id" STRING NOT NULL,
    "ip" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_ips_pkey" PRIMARY KEY ("user_id","ip")
);

-- CreateTable
CREATE TABLE "access_ips" (
    "ip" STRING NOT NULL,
    "count" INT4 NOT NULL,
    "path" STRING NOT NULL,
    "block" BOOL NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_ips_pkey" PRIMARY KEY ("ip","path")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "address" STRING NOT NULL,
    "description" STRING NOT NULL,
    "created_user_id" STRING NOT NULL,
    "updated_user_id" STRING NOT NULL,
    "url" STRING,
    "allergy_menu_url" STRING,
    "tabelog_url" STRING,
    "gurunavi_url" STRING,
    "hotpepper_url" STRING,
    "deleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_histories" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "store_id" STRING NOT NULL,
    "address" STRING NOT NULL,
    "description" STRING NOT NULL,
    "updated_user_id" STRING NOT NULL,
    "url" STRING,
    "allergy_menu_url" STRING,
    "tabelog_url" STRING,
    "gurunavi_url" STRING,
    "hotpepper_url" STRING,
    "deleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_store_goods" (
    "user_id" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_store_goods_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_store_bads" (
    "user_id" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_store_bads_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "store_id" STRING NOT NULL,
    "description" STRING NOT NULL,
    "deleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_user_id" STRING NOT NULL,
    "updated_user_id" STRING NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_histories" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "menu_id" STRING NOT NULL,
    "store_id" STRING NOT NULL,
    "description" STRING NOT NULL,
    "deleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_user_id" STRING NOT NULL,

    CONSTRAINT "menu_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Picture" (
    "id" STRING NOT NULL,
    "url" STRING NOT NULL,
    "store_id" STRING NOT NULL,
    "description" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuPicture" (
    "id" STRING NOT NULL,
    "menu_id" STRING NOT NULL,

    CONSTRAINT "MenuPicture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_comments" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "store_id" STRING NOT NULL,
    "user_id" STRING NOT NULL,
    "content" STRING NOT NULL,
    "deleted" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allergens" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,

    CONSTRAINT "allergens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_allergens" (
    "allergen_id" STRING NOT NULL,
    "menu_id" STRING NOT NULL,
    "status" STRING NOT NULL,

    CONSTRAINT "menu_allergens_pkey" PRIMARY KEY ("allergen_id","menu_id")
);

-- CreateTable
CREATE TABLE "menu_allergen_histories" (
    "id" STRING NOT NULL,
    "menu_history_id" STRING NOT NULL,
    "allergen_id" STRING NOT NULL,
    "menu_id" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" STRING NOT NULL,

    CONSTRAINT "menu_allergen_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_verify_codes_code_key" ON "user_verify_codes"("code");

-- AddForeignKey
ALTER TABLE "user_verify_codes" ADD CONSTRAINT "user_verify_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ips" ADD CONSTRAINT "user_ips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_created_user_id_fkey" FOREIGN KEY ("created_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_updated_user_id_fkey" FOREIGN KEY ("updated_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_store_goods" ADD CONSTRAINT "user_store_goods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_store_bads" ADD CONSTRAINT "user_store_bads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_created_user_id_fkey" FOREIGN KEY ("created_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_updated_user_id_fkey" FOREIGN KEY ("updated_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuPicture" ADD CONSTRAINT "MenuPicture_id_fkey" FOREIGN KEY ("id") REFERENCES "Picture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuPicture" ADD CONSTRAINT "MenuPicture_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_comments" ADD CONSTRAINT "store_comments_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_comments" ADD CONSTRAINT "store_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_allergens" ADD CONSTRAINT "menu_allergens_allergen_id_fkey" FOREIGN KEY ("allergen_id") REFERENCES "allergens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_allergens" ADD CONSTRAINT "menu_allergens_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_allergen_histories" ADD CONSTRAINT "menu_allergen_histories_menu_history_id_fkey" FOREIGN KEY ("menu_history_id") REFERENCES "menu_histories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
