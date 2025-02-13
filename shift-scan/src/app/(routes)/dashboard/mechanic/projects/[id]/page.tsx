"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";

export default function Project({ params }: { params: { id: string } }) {
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
