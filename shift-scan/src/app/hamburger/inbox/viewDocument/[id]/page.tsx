// src/app/hamburger/inbox/viewDocument/[id]/page.tsx
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { ViewDocumentContent } from "../../_components/viewDocumentContent";

export default function ViewDocumentPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Bases>
      <Contents height="page">
        <Grids rows="6" gap="5">
          <ViewDocumentContent id={params.id} />
        </Grids>
      </Contents>
    </Bases>
  );
}