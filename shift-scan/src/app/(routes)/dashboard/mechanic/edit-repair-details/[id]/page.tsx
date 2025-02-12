"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { useEffect, useState } from "react";

type RepairDetails = {
  id: string;
};

export default function EditRepairDetails({
  params,
}: {
  params: { id: string };
}) {
  const [repairDetails, setRepairDetails] = useState<RepairDetails>();
  useEffect(() => {
    const fetchRepairDetails = async () => {
      try {
        // Fetch repair details
        const response = await fetch(`/api/getRepairDetails/${params.id}`);
        const data = await response.json();
        setRepairDetails(data);
      } catch (error) {
        console.error("Error fetching repair details:", error);
      }
    };
    fetchRepairDetails();
  }, [params.id]);
  return (
    <Bases>
      <Contents>
        <Holds background="white" className="h-full w-full">
          <Texts>Project {params.id}</Texts>
        </Holds>
      </Contents>
    </Bases>
  );
}
