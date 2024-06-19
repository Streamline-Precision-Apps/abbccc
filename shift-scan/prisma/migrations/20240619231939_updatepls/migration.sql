/*
  Warnings:

  - The primary key for the `CrewMember` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "CrewJobsite_crew_id_jobsite_id_key";

-- DropIndex
DROP INDEX "EmployeePosition_id_key";

-- AlterTable
ALTER TABLE "CrewJobsite" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CrewJobsite_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CrewMember" DROP CONSTRAINT "CrewMember_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CrewMember_pkey" PRIMARY KEY ("id");
