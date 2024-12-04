"use client";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";

export default function UpdateCostCodes() {
  return (
    <Holds>
      <ReusableViewLayout />
    </Holds>
  );
}
