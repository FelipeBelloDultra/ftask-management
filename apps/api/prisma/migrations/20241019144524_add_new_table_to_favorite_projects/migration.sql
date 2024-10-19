-- CreateTable
CREATE TABLE "account_has_favorite_project" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "account_has_favorite_project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_has_favorite_project_account_id_project_id_key" ON "account_has_favorite_project"("account_id", "project_id");

-- AddForeignKey
ALTER TABLE "account_has_favorite_project" ADD CONSTRAINT "account_has_favorite_project_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_has_favorite_project" ADD CONSTRAINT "account_has_favorite_project_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
