-- CreateTable
CREATE TABLE "user_recovery_codes" (
    "id" STRING NOT NULL,
    "email" STRING NOT NULL,
    "code" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_recovery_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_recovery_codes_code_key" ON "user_recovery_codes"("code");
