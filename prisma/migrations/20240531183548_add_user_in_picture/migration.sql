-- AlterTable
ALTER TABLE "Picture" ADD COLUMN     "created_user_id" STRING;
ALTER TABLE "Picture" ADD COLUMN     "updated_user_id" STRING;

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_created_user_id_fkey" FOREIGN KEY ("created_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_updated_user_id_fkey" FOREIGN KEY ("updated_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
