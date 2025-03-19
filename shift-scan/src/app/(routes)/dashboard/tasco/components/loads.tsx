import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Loads } from "@/lib/types";
import { createLoad } from "@/actions/tascoActions";
import LoadsList from "./LoadsList";
import { Labels } from "@/components/(reusable)/labels";
import Counter from "./counter";

export default function LoadsLayout({
  tascoLog,
  loads,
  setLoads,
  loadCount,
  setLoadCount,
}: {
  tascoLog: string | undefined;
  loads: Loads[] | undefined;
  setLoads: React.Dispatch<React.SetStateAction<Loads[] | undefined>>;
  loadCount: number;
  setLoadCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const AddLoad = async () => {
    const formData = new FormData();
    formData.append("tascoLogId", tascoLog ?? "");
    try {
      const temp = await createLoad(formData);
      setLoads((prev) => [
        ...(prev ?? []),
        {
          id: temp.id,
          tascoLogId: temp.tascoLogId ?? "",
          loadType: "",
          loadWeight: 0,
        },
      ]);
    } catch (error) {
      console.log("error adding Load", error);
    }
  };

  return (
    <Holds className="w-full h-full">
      <Grids rows={"8"}>
        <Holds className="w-full items-center row-start-1 row-end-2" background={"white"}>
          <Labels>Load Counter</Labels>
          <Counter
            count={loadCount}
            setCount={setLoadCount}
            addAction={AddLoad}
            allowRemove={false}
          />
        </Holds>
        <Holds className="w-full h-full row-start-3 row-end-9">
          <LoadsList loads={loads} setLoads={setLoads} loadCount={loadCount} setLoadCount={setLoadCount} />
        </Holds>
      </Grids>
    </Holds>
  );
}
