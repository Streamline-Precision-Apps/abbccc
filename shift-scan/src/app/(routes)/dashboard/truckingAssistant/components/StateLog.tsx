import { createStateMileage } from "@/actions/truckingActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import StateMileageList from "./StateMileageList";

type StateMileage = {
  id: string;
  truckingLogId: string;
  state?: string;
  stateLineMileage?: number;
  createdAt?: Date;
};
export default function StateLog({
  StateMileage,
  setStateMileage,
  truckingLog,
}: {
  truckingLog: string | undefined;
  StateMileage: StateMileage[] | undefined;
  setStateMileage: React.Dispatch<
    React.SetStateAction<StateMileage[] | undefined>
  >;
}) {
  const AddStateMileage = async () => {
    const formData = new FormData();
    formData.append("truckingLogId", truckingLog ?? "");
    try {
      const tempStateMileage = await createStateMileage(formData);
      setStateMileage((prev) => [
        {
          id: tempStateMileage.id,
          truckingLogId: tempStateMileage.truckingLogId ?? "",
          state: tempStateMileage.state ?? "",
          stateLineMileage: tempStateMileage.stateLineMileage ?? 0,
          createdAt: new Date(),
        },
        ...(prev ?? []),
      ]);
    } catch (error) {
      console.log("error adding state Mileage", error);
    }
  };
  const StateOptions = [
    { value: "Alabama", label: "Alabama" },
    { value: "Alaska", label: "Alaska" },
    { value: "Arizona", label: "Arizona" },
    { value: "Arkansas", label: "Arkansas" },
    { value: "California", label: "California" },
    { value: "Colorado", label: "Colorado" },
    { value: "Connecticut", label: "Connecticut" },
    { value: "Delaware", label: "Delaware" },
    { value: "Florida", label: "Florida" },
    { value: "Georgia", label: "Georgia" },
    { value: "Hawaii", label: "Hawaii" },
    { value: "Idaho", label: "Idaho" },
    { value: "Illinois", label: "Illinois" },
    { value: "Indiana", label: "Indiana" },
    { value: "Iowa", label: "Iowa" },
    { value: "Kansas", label: "Kansas" },
    { value: "Kentucky", label: "Kentucky" },
    { value: "Louisiana", label: "Louisiana" },
    { value: "Maine", label: "Maine" },
    { value: "Maryland", label: "Maryland" },
    { value: "Massachusetts", label: "Massachusetts" },
    { value: "Michigan", label: "Michigan" },
    { value: "Minnesota", label: "Minnesota" },
    { value: "Mississippi", label: "Mississippi" },
    { value: "Missouri", label: "Missouri" },
    { value: "Montana", label: "Montana" },
    { value: "Nebraska", label: "Nebraska" },
    { value: "Nevada", label: "Nevada" },
    { value: "New Hampshire", label: "New Hampshire" },
    { value: "New Jersey", label: "New Jersey" },
    { value: "New Mexico", label: "New Mexico" },
    { value: "New York", label: "New York" },
    { value: "North Carolina", label: "North Carolina" },
    { value: "North Dakota", label: "North Dakota" },
    { value: "Ohio", label: "Ohio" },
    { value: "Oklahoma", label: "Oklahoma" },
    { value: "Oregon", label: "Oregon" },
    { value: "Pennsylvania", label: "Pennsylvania" },
    { value: "Rhode Island", label: "Rhode Island" },
    { value: "South Carolina", label: "South Carolina" },
    { value: "South Dakota", label: "South Dakota" },
    { value: "Tennessee", label: "Tennessee" },
    { value: "Texas", label: "Texas" },
    { value: "Utah", label: "Utah" },
    { value: "Vermont", label: "Vermont" },
    { value: "Virginia", label: "Virginia" },
    { value: "Washington", label: "Washington" },
    { value: "West Virginia", label: "West Virginia" },
    { value: "Wisconsin", label: "Wisconsin" },
    { value: "Wyoming", label: "Wyoming" },
  ];

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
            <Buttons
              background={"green"}
              className="py-1.5"
              onClick={() => {
                AddStateMileage();
              }}
            >
              +
            </Buttons>
          </Holds>
        </Holds>
        <Holds className="w-full h-full row-start-2 row-end-9">
          <StateMileageList
            StateOptions={StateOptions}
            StateMileage={StateMileage}
            setStateMileage={setStateMileage}
          />
        </Holds>
      </Grids>
    </Holds>
  );
}
