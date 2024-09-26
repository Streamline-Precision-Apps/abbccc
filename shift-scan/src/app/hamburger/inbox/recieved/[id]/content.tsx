"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { receivedContent } from "@/lib/types";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { EditLeaveRequest, ManagerLeaveRequest } from "@/actions/inboxSentActions";
import { Images } from "@/components/(reusable)/images";
import { useRouter } from "next/navigation";
import {formatDate} from '@/utils/formatDateYMD';

type Props = {
    receivedContent:  receivedContent[]; // Define the type of sentContent prop
    session: Session | null;
    params: { id: string };
    name: string;
    manager: string;
}

export default function Content({ params,  receivedContent, session, name, manager } : Props) {
    const t = useTranslations("Hamburger");
    const router = useRouter();
    const user_Id = session?.user.id;
    const [decision, setDecision] = useState("APPROVED")
    const [managerComment, setManagerComment] = useState('');

    const [initialContent, setInitialContent] = useState<receivedContent[]>(receivedContent);
    const [currentContent, setCurrentContent] = useState<receivedContent[]>(receivedContent);


    useEffect(() => {
        setInitialContent(receivedContent); // Store initial values
    }, [receivedContent]);

const handleManagerCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setManagerComment(e.target.value); // Update the state with the new comment
    };

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        console.log(formData)
        EditLeaveRequest(formData);
    }

    return (
        <>
        <Bases>
            <Contents>
                <Holds 
                background={"orange"}
                className="mb-3">
                    <TitleBoxes 
                    title="leave request" 
                    titleImg="/Inbox.svg" 
                    titleImgAlt="Inbox" 
                    type="noIcon"/>
                    {receivedContent.map((item) => (
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
                {receivedContent.map((item) => (
                <Holds 
                background={"white"}
                className="mb-3" 
                key={item.id}>
                    <Inputs type="hidden" name="date" value={item.date.toString()} disabled/>
                    <Inputs type="hidden" name="employee_id" value={item.employeeId} disabled/>
                    <Labels>
                        Employee
                        <Inputs
                        defaultValue={name}
                        />
                    </Labels>
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

                    <Labels>Comments
                    <TextAreas 
                    name = "description"
                    defaultValue={item.comment}
                    disabled
                    rows={2} 
                    />
                    </Labels>
                <Holds>
                    <Labels>Managers Comments
                    <TextAreas
                    name="mangerComments"
                    value={managerComment}
                    rows={2}
                    onChange={handleManagerCommentChange}
                    maxLength={40}
                    />
                    </Labels>
                    <Texts>Employee signature</Texts>
                    <Texts>Manager signature here</Texts>
                    <Texts size={"p4"}>
                        *By Signing I acknowledge that time leave request are subject to management approval and company policy. *
                    </Texts>
                    <Holds position={"row"}>
                        <Forms action={ManagerLeaveRequest}>
                            <Inputs type="hidden" name="id" value={item.id} />
                            <Inputs type="hidden" name="decision" value="DENIED" />
                            <Inputs type="hidden" name="decidedBy" value={manager} />
                            <TextAreas 
                            name="mangerComments"
                            value={managerComment}
                            hidden
                            />
                            <Holds>
                                <Buttons 
                                background={"red"} 
                                type="submit"
                                size={"80"}
                                className="p-1">
                                    <Holds position={"row"}>
                                        <Holds>
                                            <Titles>Deny</Titles>
                                        </Holds>
                                        <Holds>
                                            <Images 
                                            titleImg={"/undo-edit.svg"} 
                                            titleImgAlt={"delete form"} 
                                            size={"30"}/>
                                        </Holds>
                                    </Holds>
                                </Buttons>
                            </Holds>
                        </Forms>
                        {/*Manger Approves his request with button */}
                        <Forms action={ManagerLeaveRequest}>
                            <Inputs type="hidden" name="id" value={item.id} />
                            <Inputs type="hidden" name="decision" value="APPROVED" />
                            <Inputs type="hidden" name="decidedBy" value={manager} />
                            <TextAreas
                            name="mangerComments"
                            value={managerComment}
                            hidden
                            />
                            <Holds>
                                <Buttons 
                                background={"green"} 
                                type="submit"
                                size={"80"}
                                className="p-1">
                                    <Holds position={"row"}>
                                        <Holds>
                                            <Titles>Approve</Titles>
                                        </Holds>
                                        <Holds>
                                            <Images 
                                            titleImg={"/save-edit.svg"} 
                                            titleImgAlt={"delete form"}
                                            size={"30"}/>
                                        </Holds>
                                    </Holds>
                                </Buttons>
                            </Holds>
                        </Forms>
                    </Holds>
                </Holds>
                </Holds>
                ))}
            </Contents>
        </Bases>
        </>
    )
}