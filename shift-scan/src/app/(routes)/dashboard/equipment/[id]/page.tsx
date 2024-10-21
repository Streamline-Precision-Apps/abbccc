"use server";

import Content from "./content";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";

// Parameters are passed as props in Next.js server components.
export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return null;

  // Render the content based on the formId.
  return (
    <Bases>
      <Contents>
        <Content params={params} />
      </Contents>
    </Bases>
  );
}
