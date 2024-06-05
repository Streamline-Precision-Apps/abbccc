/*
  Warnings:

  - A unique constraint covering the columns `[employee_id,view_id]` on the table `EmployeeView` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmployeeView_employee_id_view_id_key" ON "EmployeeView"("employee_id", "view_id");
