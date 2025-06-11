import { CheckBox } from "@/components/(inputs)/checkBox";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";

export default function SafetyDocumentsAndPolicies() {
  return (
    <Holds className="w-full h-full p-2">
      <Holds position={"row"} className="w-full h-fit">
        <Holds background={"gray"} className="w-full h-fit p-2 ">
          <Texts position={"left"} size={"sm"}>
            Safety Documents and Policies
          </Texts>
        </Holds>
        <Holds className="w-fit h-fit p-2">
          <CheckBox height={35} width={35} shadow={false} id={""} name={""} />
        </Holds>
      </Holds>
    </Holds>
  );
}
