import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

type StateMileage = {
  id: string;
  truckingLogId: string;
  state: string;
  stateLineMileage: number;
  createdAt: Date;
};
export default function StateLog({
  StateMileage,
  setStateMileage,
}: {
  StateMileage: StateMileage | undefined;
  setStateMileage: React.Dispatch<
    React.SetStateAction<StateMileage | undefined>
  >;
}) {
  return (
    <Holds className="w-full h-full">
      <Grids rows={"8"}>
        <Holds position={"row"} className="w-full h-full row-start-1 row-end-2">
          <Holds size={"80"}>
            <Texts size={"p3"} className="font-bold">
              Did you leave Idaho?
            </Texts>
          </Holds>
          <Holds size={"20"}>
            <Buttons background={"green"} className="py-1.5" onClick={() => {}}>
              +
            </Buttons>
          </Holds>
        </Holds>
        <Holds className="w-full h-full row-start-2 row-end-9"></Holds>
      </Grids>
    </Holds>
  );
}
