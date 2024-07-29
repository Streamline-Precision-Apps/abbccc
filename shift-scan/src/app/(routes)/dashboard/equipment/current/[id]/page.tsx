import TextBox from "@/components/(inputs)/textBox";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { Buttons } from "@/components/(reusable)/buttons";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import prisma from "@/lib/prisma";
import { Textarea } from "@nextui-org/input";
import Refueled from "./refueled";
import { updateEmployeeEquipmentLog} from "@/actions/equipmentActions";
import Submission from "./submission";
import { revalidatePath } from "next/cache";

export default async function Page({ params }: { params: { id: string } }) {
const equipmentform = await prisma.employeeEquipmentLog.findUnique({
where: {
    id: Number(params.id),
},
include: {
    Equipment: true,
},
});

const start_time = new Date(equipmentform?.start_time ?? "");
const end_time = new Date() ;
const duration = ((end_time.getTime() - start_time.getTime()) / (1000 * 60 * 60)).toFixed(2);
revalidatePath(`/dashboard/equipment/current/${params.id}`)

return (
<Bases>
    <Sections size={"titleBox"}>
    <TitleBoxes
        title={`${equipmentform?.Equipment?.name}`}
        type="noIcon"
        titleImg="/current.svg"
        titleImgAlt="Current"
        variant={"default"}
        size={"default"}
    />
    { equipmentform?.completed ? 
    (<>
    <h2>Form Completed</h2>
    </>)
    :
    (<></>) }
    </Sections>
    <form action={updateEmployeeEquipmentLog}>
    <Sections size={"dynamic"}>
        <Refueled />
    </Sections>
    <Sections size={"dynamic"}>
        <label>
        Total Time used
        <input name="duration" value={`${duration} hours`}/>
        </label>
        <label>
        Additional notes
        <Textarea  name="equipment_notes" />
        </label>
    </Sections>

    <input type="hidden" name="end_time" value={(end_time).toString()} />
    <input type="hidden" name="id" value={ equipmentform?.id} />
    <input type="hidden" name="completed" value={"true"} />
    <Submission />
    </form>
</Bases>
);
}