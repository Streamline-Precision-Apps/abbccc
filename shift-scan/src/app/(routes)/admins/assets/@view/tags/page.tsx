import { Holds } from "@/components/(reusable)/holds";
import EmptyView from "../../../_pages/EmptyView";

export default function Page() {
  return (
    <Holds className="h-full w-full">
      <EmptyView Children={<h1>Select A Tag to View</h1>} />
    </Holds>
  );
}
