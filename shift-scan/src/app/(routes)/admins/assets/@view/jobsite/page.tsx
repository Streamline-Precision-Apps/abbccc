import { Holds } from "@/components/(reusable)/holds";
import EmptyView from "../../../_pages/EmptyView";

export default function jobsitemain() {
  return (
    <Holds className="w-full h-full ">
      <EmptyView Children={<h1>Select A Jobsite to View</h1>} />
    </Holds>
  );
}
