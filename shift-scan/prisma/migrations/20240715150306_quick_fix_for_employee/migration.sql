/*
  Warnings:

  - You are about to drop the `ContactJoin` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `truck_view` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tasco_view` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `labor_view` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mechanic_view` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ContactJoin" DROP CONSTRAINT "ContactJoin_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "ContactJoin" DROP CONSTRAINT "ContactJoin_employee_id_fkey";

-- AlterTable
ALTER TABLE "CrewMember" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "dob" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "truck_view" SET NOT NULL,
ALTER COLUMN "tasco_view" SET NOT NULL,
ALTER COLUMN "labor_view" SET NOT NULL,
ALTER COLUMN "mechanic_view" SET NOT NULL;

-- DropTable
DROP TABLE "ContactJoin";

-- CreateTable
CREATE TABLE "InjuryForm" (
    "id" SERIAL NOT NULL,
    "contactedSupervisor" BOOLEAN NOT NULL DEFAULT false,
    "incidentDescription" TEXT NOT NULL,
    "signedForm" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InjuryForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContactToEmployee" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContactToEmployee_AB_unique" ON "_ContactToEmployee"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactToEmployee_B_index" ON "_ContactToEmployee"("B");

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToEmployee" ADD CONSTRAINT "_ContactToEmployee_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToEmployee" ADD CONSTRAINT "_ContactToEmployee_B_fkey" FOREIGN KEY ("B") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
