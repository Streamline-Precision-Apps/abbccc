"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";

export default function TagView({ params }: { params: { id: string } }) {
  return (
    <Holds>
      <Texts>Tag View {params.id}</Texts>
    </Holds>
  );
}
