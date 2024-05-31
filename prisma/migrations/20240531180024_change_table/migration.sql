/*
  Warnings:

  - You are about to drop the `MenuPicture` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MenuPicture" DROP CONSTRAINT "MenuPicture_id_fkey";

-- DropForeignKey
ALTER TABLE "MenuPicture" DROP CONSTRAINT "MenuPicture_menu_id_fkey";

-- DropTable
DROP TABLE "MenuPicture";

-- CreateTable
CREATE TABLE "menu_pictures" (
    "id" STRING NOT NULL,
    "menu_id" STRING NOT NULL,

    CONSTRAINT "menu_pictures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "menu_pictures" ADD CONSTRAINT "menu_pictures_id_fkey" FOREIGN KEY ("id") REFERENCES "Picture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_pictures" ADD CONSTRAINT "menu_pictures_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
