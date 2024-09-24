"use client";

import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Holds } from "@/components/(reusable)/Holds";
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
    const [edit, setEdit] = useState(false);
    const router = useRouter();
    const user_Id = session?.user.id;


    const [initialContent, setInitialContent] = useState<sentContent[]>(sentContent);
    const [currentContent, setCurrentContent] = useState<sentContent[]>(sentContent);


    useEffect(() => {
        setInitialContent(sentContent); // Store initial values
    }, [sentContent]);
    
    
    const handleEdit = () => {
        setEdit(false); // Optionally exit edit mode
    };

    return (
        <>
        <Bases>
        <Contents>
        <Holds size={"titleBox"} variant={"orange"}>
        <TitleBoxes variant={null} title="leave request" titleImg="/Inbox.svg" titleImgAlt="Inbox" type="noIcon" >
        </TitleBoxes>
        {sentContent.map((item) => (
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
        )
        )}
        </Holds>
        <Forms action={EditLeaveRequest} >
        <Holds size={"titleBox"} >
            <Contents variant={"widgetButtonRow"} size={null}>
            {!edit &&
            <Buttons variant={"orange"} size={null} onClick={() => setEdit(!edit)}>
                <Images variant={"icon"} size={"iconSm"} titleImg={"/new/edit-form.svg"} titleImgAlt={"edit form"} />
            </Buttons>
            }
            {edit && <Buttons variant={"red"} size={null} onClick={() => handleEdit()}>
                <Images variant={"icon"} size={"iconSm"} titleImg={"/new/undo-edit.svg"} titleImgAlt={"delete form"} />
            </Buttons>
            }
            {edit &&
            <Buttons variant={"green"} size={null}  type="submit">
            <Images variant={"icon"} size={"iconSm"} titleImg={"/new/save-edit.svg"} titleImgAlt={"delete form"} />
            </Buttons>
            }
            </Contents>
        </Holds>
        {sentContent.map((item) => (
            <Holds size={"default"} key={item.id}>
            <Inputs type="hidden" name="id" value={item.id} disabled/>
            <Inputs type="hidden" name="status" value={item.status} disabled/>
            <Inputs type="hidden" name="date" value={item.date.toString()} disabled/>
            <Inputs type="hidden" name="employee_id" value={item.employeeId} disabled/>
            <Labels> Start Date
            <Inputs
            type="date"
            name="startDate"
            defaultValue={formatDate(item.requestedStartDate)}
            disabled={edit ? false : true}
            />
            </Labels>

            <Labels> End Date
            <Inputs
            type="date"
            name="endDate"
            defaultValue={formatDate(item.requestedEndDate)}
            disabled={edit ? false : true} 
            />
            </Labels>
            <Labels> Request Type
            <Selects
            name="requestType"
            defaultValue={item.requestType}
            disabled={edit ? false : true} 
            >
            <option value="">Choose a request</option>
            <option value="Vacation">Vacation</option>
            <option value="Family/Medical Leave">Family/Medical Leave</option>
            <option value="Military Leave">Military Leave</option>
            <option value="Non Paid Personal Leave">Non Paid Personal Leave</option>
            <option value="Sick Time">Sick Time</option>
            </Selects>
            </Labels>

            <Labels> Comments
            <TextAreas 
            name = "description"
            defaultValue={item.comment}
            disabled={edit ? false : true}
            rows={5} 
            />
            </Labels>
            {item.status === "APPROVED" || item.status === "DENIED" && (
            <Labels> Managers Comments
            <TextAreas
            name="mangerComments"
            defaultValue={item.managerComment ?? ""}
            disabled 
            />
            </Labels>
            )}
    
            <Contents>
                
                    <Texts variant={"default"} size={"p2"}>
                        signature here
                    </Texts>
                
            </Contents>

            <Texts variant={"default"} size={"p4"}>
            *By Signing I acknowledge that time leave request are subject to management approval and company policy. *
            </Texts>
            </Holds>
        ))}
        </Forms>
    
    {/* This button deletes the request from the db */}
            {edit && <Buttons 
            onClick={
                () =>
                {
                    DeleteLeaveRequest(params.id, user_Id);
                    setEdit(!edit);
                }
            } 
            variant={"red"} size={null}>
                <Titles variant={"default"} size={"h1"}>
                    Delete Request
                </Titles>
            </Buttons>}
        </Contents>
        </Bases>
        </>
    )
}