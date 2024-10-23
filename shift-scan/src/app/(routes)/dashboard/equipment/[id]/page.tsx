"use server";

import CombinedForm from "./content";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
type Params = Promise<{ id: string }>;
// Parameters are passed as props in Next.js server components.
export default async function Page(props: { params: Promise<Params> }) {
  const session = await auth();
  if (!session) return null;

  // Render the content based on the formId.
  return (
    <Bases>
      <Contents>
        <CombinedForm id={(await props.params).id} />
      </Contents>
    </Bases>
  );
}
