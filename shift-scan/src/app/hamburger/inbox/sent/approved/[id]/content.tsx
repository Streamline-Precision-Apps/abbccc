"use client";

import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Sections } from "@/components/(reusable)/sections";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { sentContent } from "@/lib/types";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { startTransition, useEffect, useRef, useState } from "react";
import { DeleteLeaveRequest, EditLeaveRequest } from "@/actions/inboxSentActions";
import { Images } from "@/components/(reusable)/images";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import {formatDate} from '@/utils/formatDateYMD';

type Props = {
    sentContent: sentContent[]; // Define the type of sentContent prop
    session: Session | null;
    params: { id: string };
}

export default function Content({ params, sentContent, session } : Props) {
    const t = useTranslations("Hamburger");
    const router = useRouter();
    const user_Id = session?.user.id;


    const [initialContent, setInitialContent] = useState<sentContent[]>(sentContent);
    const [currentContent, setCurrentContent] = useState<sentContent[]>(sentContent);


    useEffect(() => {
        setInitialContent(sentContent); // Store initial values
    }, [sentContent]);
    

    return (
        <>
        <Bases>
        <Contents>
        <Sections size={"titleBox"} variant={"green"}>
        <TitleBoxes variant={null} title="leave request" titleImg="/Inbox.svg" titleImgAlt="Inbox" type="noIcon" >
        </TitleBoxes>
        {sentContent.map((item) => (<>
            <Titles key={item.id}>
            {item.date.toLocaleString("en-US", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: undefined,
                minute: undefined,
                second: undefined,
            })}
            </Titles>
            </>
        )
        )}
        </Sections>
        {sentContent.map((item) => (
            <>
            <Sections size={"titleBox"}>
            <Labels>
                Status
                <Inputs
                    type="text"
                    defaultValue={item?.status}
                    />
            </Labels>
            </Sections>

                <Sections size={"dynamic"} key={item.id}>
            <Labels>
                Employee
                <Inputs
                defaultValue={session?.user?.firstName + " " + session?.user?.lastName}
                disabled
                />
            </Labels>
            <Inputs type="hidden" name="id" value={item.id} disabled/>
            <Inputs type="hidden" name="status" value={item.status} disabled/>
            <Inputs type="hidden" name="date" value={item.date.toString()} disabled/>
            <Inputs type="hidden" name="employee_id" value={item.employee_id} disabled/>
            <Labels> Start Date
            <Inputs
            type="date"
            name="startDate"
            defaultValue={formatDate(item.requestedStartDate)}
            disabled
            />
            </Labels>

            <Labels> End Date
            <Inputs
            type="date"
            name="endDate"
            defaultValue={formatDate(item.requestedEndDate)}
            disabled
            />
            </Labels>
            <Labels> Request Type
            <Inputs
            type="text"
            name="requestType"
            defaultValue={item?.requestType}
            disabled
            />
            </Labels>

            <Labels> Comments
            <TextAreas 
            name = "description"
            defaultValue={item.comments}
            disabled
            rows={5} 
            />
            </Labels>
                </Sections>

                <Sections size={"dynamic"}>
            <Labels> Managers Comments
            <TextAreas
            name="mangerComments"
            defaultValue={item.mangerComments ?? ""}
            disabled 
            />
            </Labels>
            <Labels>
                Approved By
                <Inputs
                    name="decidedBy"
                    defaultValue={item.decidedBy?.toString()}
                    disabled
                    />
            </Labels>
            </Sections>
            </>
        ))}
        </Contents>
        </Bases>
        </>
    )
}