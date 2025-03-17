-- DropForeignKey
ALTER TABLE "FormApproval" DROP CONSTRAINT "FormApproval_signedBy_fkey";

-- AlterTable
ALTER TABLE "FormApproval" ALTER COLUMN "signedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "FormApproval" ADD CONSTRAINT "FormApproval_signedBy_fkey" FOREIGN KEY ("signedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
