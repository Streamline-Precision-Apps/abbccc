"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Sections } from "@/components/(reusable)/sections";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { RequestForm } from "@/lib/types";
import { useState } from "react";
import {createLeaveRequest} from '@/actions/inboxSentActions';
import { useRouter } from "next/navigation";


export default function Form( { signature, session } : RequestForm) {
const [sign, setSign] = useState(false);
const [message, setMessage] = useState("");
const [closeBanner, showBanner] = useState(false);
const router = useRouter();
    const handleSubmit = async () => {
    showBanner(true);
    setMessage("Time off request submitted");

    const timer = setTimeout(() => {
        showBanner(false);
        setMessage("");
        clearTimeout(timer);
        router.replace("/hamburger/inbox");
    }, 5000);
    
    }
    return (
    <Bases>
    <Contents>
    <Sections size={"titleBox"} variant={"green"}>
        <TitleBoxes
        title="Leave Request Form" 
        titleImg="/new/Inbox.svg"
        titleImgAlt="Inbox"
        type="noIcon"
        />
    </Sections>
    {
    closeBanner && (
    <Titles>{message}</Titles>
    )
    }
        <Forms action={createLeaveRequest} onSubmit={handleSubmit}>
    <Sections size={"dynamic"}>
        <Labels >Start Date
        <Inputs
        type="date"
        name="startDate"
        id="startDate"
        required
        />
        </Labels>

        <Labels >End Date
        <Inputs
        type="date"
        name="endDate"
        id="endDate"
        required
        />
        </Labels>

        <Labels >Request Type
        <Selects
        id="requestType"
        name="requestType"
        defaultValue=""
        required
        >
        <option value="">Choose a request</option>
        <option value="Vacation">Vacation</option>
        <option value="Medical">Family/Medical Leave</option>
        <option value="Military">Military Leave</option>
        <option value="Personal">Non Paid Personal Leave</option>
        <option value="Sick">Sick Time</option>
        </Selects>
        </Labels>
        <Labels>Comments
        <TextAreas 
        name="description"
        id="description"
        rows={5}
        maxLength={40}
        required
        />
        </Labels>
        <Inputs type="hidden" name="user_id" value={session?.user?.id} />
        <Inputs type="hidden" name="status" value="PENDING" />
        <Inputs type="hidden" name="date" value={new Date().toISOString()} />
        {sign ? (
            <Buttons variant={"default"} size={"tapToSign"} onClick={(event) => {event.preventDefault(); setSign(false) }}>
                <Images titleImg={""} titleImgAlt="signature" />
            </Buttons>
        ):
        (
            <Buttons variant={"default"} size={"tapToSign"} onClick={(event) => {event.preventDefault(); setSign(true) }}>
            <Titles variant={"default"} size={"h1"}>
                Tap to sign
            </Titles>
            
            </Buttons>
        
)}
        <Texts variant={"default"} size={"p4"}>
            *By Signing I acknowledge that time leave request are subject to management approval and company policy. *
        </Texts>
        </Sections>
        <Buttons type="submit" variant={"green"} size={"maxBtn"}>
            <Titles variant={"default"} size={"h1"}>
                Submit
            </Titles>
        </Buttons>
        </Forms>
    </Contents>
    </Bases>
    )
}