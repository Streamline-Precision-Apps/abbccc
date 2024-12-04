"use client";

import { Holds } from "@/components/(reusable)/holds";
import EmptyView from "../../../_pages/EmptyView";

export default function Crew() {
  return (
    <Holds className="w-full h-full ">
      <EmptyView Children={undefined} />
    </Holds>
  );
}
