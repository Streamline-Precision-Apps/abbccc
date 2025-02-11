import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";

export default function MechanicManagerPriority() {
  return (
    <Holds>
      <Titles>Manager Priority</Titles>
      <Buttons href="/dashboard/mechanic/createProject">
        Create Equipment Page
      </Buttons>
    </Holds>
  );
}
