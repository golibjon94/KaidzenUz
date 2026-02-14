/*
  Warnings:

  - You are about to drop the column `date` on the `business_cases` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `business_cases` table. All the data in the column will be lost.
  - Added the required column `sales_network_id` to the `business_cases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business_cases" DROP COLUMN "date",
DROP COLUMN "title",
ADD COLUMN     "date_from" TIMESTAMP(3),
ADD COLUMN     "date_to" TIMESTAMP(3),
ADD COLUMN     "sales_network_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "business_cases" ADD CONSTRAINT "business_cases_sales_network_id_fkey" FOREIGN KEY ("sales_network_id") REFERENCES "sales_networks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
