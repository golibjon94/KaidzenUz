/*
  Warnings:

  - You are about to drop the column `score` on the `options` table. All the data in the column will be lost.
  - You are about to drop the column `recommendation` on the `test_results` table. All the data in the column will be lost.
  - You are about to drop the column `result_text` on the `test_results` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `test_results` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `tests` table. All the data in the column will be lost.
  - You are about to drop the `result_logic` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `result` to the `test_results` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "result_logic" DROP CONSTRAINT "result_logic_test_id_fkey";

-- AlterTable
ALTER TABLE "options" DROP COLUMN "score",
ADD COLUMN     "feedback_text" TEXT,
ADD COLUMN     "is_terminal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "next_question_id" TEXT;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "is_start_question" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "test_results" DROP COLUMN "recommendation",
DROP COLUMN "result_text",
DROP COLUMN "score",
ADD COLUMN     "result" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tests" DROP COLUMN "description",
ADD COLUMN     "start_question_id" TEXT;

-- DropTable
DROP TABLE "result_logic";

-- CreateTable
CREATE TABLE "diagnostics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagnostics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_networks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_networks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_next_question_id_fkey" FOREIGN KEY ("next_question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
