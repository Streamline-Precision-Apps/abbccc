"use server";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/Holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import Content from "@/app/(routes)/dashboard/forms/content";

export default async function Forms() {
// TODO: import Forms from database here and pass to Content

    return (
    <Bases>
    <Contents>
        <Holds size={"titleBox"}>
            <TitleBoxes
            title="Forms"
            titleImg="/new/form.svg"
            titleImgAlt="Forms"
            variant="default"
            size="default"
            />
        </Holds>
        <Content/>
    </Contents>
    </Bases>
);
}