"use server";
import { auth } from "@/auth";
import ViewTimeSheets from "@/app/(routes)/timesheets/view-timesheets";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { redirect } from "next/navigation";

export default async function Timesheets() {
    const session = await auth();
    if (!session) {
        redirect('/signin');
    }
    const id = session?.user.id;
    
    
    return (
        <Bases>
        <Contents height={"page"}>
            <Holds background={"white"} size={"full"} className="mb-10">
                <TitleBoxes title={"View Timesheets"} titleImg={"/form.svg"} titleImgAlt={"Timesheets"}  size={"default"} />
            </Holds>
        <ViewTimeSheets user={id} />
        </Contents>
        </Bases>
    )
}