import { Holds } from "@/components/(reusable)/holds";
import EmptyView from "../../_pages/EmptyView";

export default function Page() {
  return (
    <Holds background="white" className="w-full h-full ">
      <EmptyView Children={undefined} />
    </Holds>
  );
}
