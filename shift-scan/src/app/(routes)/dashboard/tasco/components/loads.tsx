import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Loads } from "@/lib/types";
import { createLoad } from "@/actions/tascoActions";
import LoadsList from "./LoadsList";

export default function LoadsLayout({
  tascoLog,
  loads,
  setLoads
}: {
  tascoLog: string | undefined;
  loads: Loads[] | undefined;
  setLoads: React.Dispatch<React.SetStateAction<Loads[] | undefined>>;
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
        <Holds position={"row"} className="w-full h-full row-start-1 row-end-2">
          <Holds size={"80"}>
            <Texts size={"p3"} className="font-bold">
              Did you Refuel?
            </Texts>
          </Holds>
          <Holds size={"20"}>
            <Buttons
              background={"green"}
              className="py-1.5"
              onClick={() => {
                AddLoad();
              }}
            >
              +
            </Buttons>
          </Holds>
        </Holds>
        <Holds className="w-full h-full row-start-2 row-end-9">
          <LoadsList
            loads={loads}
            setLoads={setLoads}
          />
        </Holds>
      </Grids>
    </Holds>
  );
}
