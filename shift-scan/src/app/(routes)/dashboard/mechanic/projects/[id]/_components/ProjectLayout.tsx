import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useRouter } from "next/navigation";

export default function ProjectLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const router = useRouter();

  return (
    <Bases>
      <Contents>
        <Grids rows="7" gap="5" className="h-full">
          <Holds background="white" className="row-span-1 h-full">
            <TitleBoxes
              title={title}
              titleImg=""
              titleImgAlt=""
              onClick={() => router.push("/dashboard")}
              type="noIcon-NoHref"
            />
          </Holds>
          <Holds className="h-full row-span-6">{children}</Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
