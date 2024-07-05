import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import EditButton from "@/components/editButton";
import { formatTime } from "@/app/(routes)/dashboard/myTeam/[id]/formatDate";
import { TitleContainer } from "@/components/(text)/title_container";
import {HalfSplitContainer} from "@/components/(text)/halfSplitContainer";
import {ThirdSplitContainer} from "@/components/(text)/thirdSplitContainer";

export default async function EmployeeData({ params }: { params: Params }) {
    const id = params.id;
    const dbTimestampStart = "2024-07-05T11:30:00Z"; // Example timestamp from the database
    const dbTimestampEnd = "2024-07-05T17:30:00Z"; // Example timestamp from the database
    const breakTime = "00:30:00";
    // Helper function to format date timestamp to 12-hour format with AM/PM
    const leftData = [<div>Left Item 1</div>, <div>Left Item 2</div>];
    const centerData = [<div>Center Item 1</div>, <div>Center Item 2</div>];
    const rightData = [<div>Right Item 1</div>, <div>Right Item 2</div>];

    const formattedStartTime = [formatTime(dbTimestampStart)]; // made an array to use a universal function and not need to create a new function for strings and numbers.
    const formattedEndTime = [formatTime(dbTimestampEnd)];

    return (
        <div className="h-fit w-full lg:w-1/2 flex mx-auto justify-center bg-app-blue rounded-b-2xl border-b-2 border-l-2 border-r-2 border-black lg:p-5 text-center text-3xl">
            <div className="h-auto w-full flex flex-col mx-auto my-20 justify-center bg-white rounded-2xl p-5 text-center text-3xl">
                <EditButton />
                
                <HalfSplitContainer LeftTitle="Start Time" RightTitle="End Time" children_left={formattedStartTime} children_right={formattedEndTime} />
                
                <TitleContainer TitleofContainer="Total Break Time" > 
                    {breakTime}
                </TitleContainer>

                <ThirdSplitContainer LeftTitle="Job Sites" CenterTitle="Costcodes" RightTitle="Total Time" children_left={leftData} children_center={centerData} children_right={rightData} />

                <HalfSplitContainer LeftTitle="Equipment" RightTitle="Total Time" children_left={leftData} children_right={rightData} />

            </div>
        </div>
    );
}