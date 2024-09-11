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
import { useState } from "react";
import { DeleteLeaveRequest, EditLeaveRequest } from "@/actions/inboxSentActions";
import { Images } from "@/components/(reusable)/images";
type Props = {
    sentContent: sentContent[]; // Define the type of sentContent prop
    session: Session | null;
    params: { id: string };
}

export default function Content({ params, sentContent, session } : Props) {
    const t = useTranslations("Hamburger");
    const [edit, setEdit] = useState(false);
    
    return (
        <>
        <Bases>
        <Sections size={"titleBox"}>
        <TitleBoxes variant={"orange"} title="leave request" titleImg="/Inbox.svg" titleImgAlt="Inbox" type="noIcon" >
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
        </Sections>
        <Sections size={"titleBox"}>
            {!edit &&
            <Buttons variant={"orange"} size={"minBtn"} onClick={() => setEdit(!edit)}>
                <Images variant={"icon"} size={"iconSm"} titleImg={"/new/edit-form.svg"} titleImgAlt={"edit form"} />
            </Buttons>
            }
            {edit &&
            <Contents variant={"widgetButtonRow"}>
            <Buttons variant={"red"} size={"minBtn"} onClick={() => setEdit(!edit)}>
                <Images variant={"icon"} size={"iconSm"} titleImg={"/new/undo-edit.svg"} titleImgAlt={"delete form"} />
            </Buttons>
            <Buttons variant={"green"} size={"minBtn"} onClick={() => console.log("saved")}>
            <Images variant={"icon"} size={"iconSm"} titleImg={"/new/save-edit.svg"} titleImgAlt={"delete form"} />
            </Buttons>
            </Contents>
            }
        </Sections>
        {sentContent.map((item) => (
        <Forms action={edit ? EditLeaveRequest : DeleteLeaveRequest}>
            <Sections size={"dynamic"} key={item.id}>
            <Inputs type="hidden" name="id" value={item.id} disabled/>
            <Inputs type="hidden" name="status" value={item.status} disabled/>
            <Inputs type="hidden" name="date" value={item.date.toString()} disabled/>
            <Inputs type="hidden" name="employee_id" value={item.employee_id} disabled/>
            <Labels> Start Date
            <Inputs
            value={item.requestedStartDate.toLocaleString("en-US", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: undefined,
                minute: undefined,
                second: undefined,
            })}
            disabled={edit ? false : true} 
            />
            </Labels>

            <Labels> End Date
            <Inputs
            value={item.requestedEndDate.toLocaleString("en-US", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: undefined,
                minute: undefined,
                second: undefined,
            })}
            disabled={edit ? false : true} 
            />
            </Labels>
            <Labels> Request Type
            <Selects
            value={item.requestType}
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
            defaultValue={item.comments}
            disabled={edit ? false : true}
            rows={5} 
            />
            </Labels>
            {item.status === "APPROVED" || item.status === "DENIED" && (
            <Labels> Managers Comments
            <TextAreas
            defaultValue={item.mangerComments ?? ""}
            disabled 
            />
            </Labels>
            )}
    
            <Contents>
                <Buttons variant={"default"} size={"tapToSign"} >
                    <Texts variant={"default"} size={"p2"}>
                        signature here
                    </Texts>
                </Buttons>
            </Contents>

            <Texts variant={"default"} size={"p4"}>
            *By Signing I acknowledge that time leave request are subject to management approval and company policy. *
            </Texts>
            </Sections>
        </Forms>
        ))}
            <Forms action={DeleteLeaveRequest}>
            <Inputs type="hidden" name="id" defaultValue={params.id} disabled/>
            <Buttons type="submit" variant={"red"} size={"minBtn"}>
                <Titles variant={"default"} size={"h1"}>
                    Delete Request
                </Titles>
            </Buttons>
            </Forms>
        </Bases>
        </>
    )
}