"use client"
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { inboxContent } from "@/lib/types";

export default function STab({ sentContent} : inboxContent) {
    const approved = sentContent.filter((item) => item.status === "APPROVED");
    const pending = sentContent.filter((item) => item.status === "PENDING");
    const denied = sentContent.filter((item) => item.status === "DENIED");
return (
<>
{/*This map show all approved requests on top */}
{approved.map((item) => (
    <Buttons background={"green"} key={item.id} href={`/hamburger/inbox/sent/approved/${item.id}`}>      
        <Titles>
            {item.requestType} 
        </Titles>
        {item.date.toLocaleString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: undefined,
            minute: undefined,
            second: undefined,
        })}
    </Buttons>
))}
{/*This map show pending requests in the middle*/}
{pending.map((item) => (
    <Buttons background={"orange"} key={item.id} href={`/hamburger/inbox/sent/${item.id}`}>
    <Titles>
        {item.requestType} 
    </Titles>
        {item.date.toLocaleString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: undefined,
            minute: undefined,
            second: undefined,
        })}
    </Buttons>
))}

{/*This map show denined requests on the bottom*/}
{denied.map((item) => (
    <Buttons background={"red"} key={item.id} href={`/hamburger/inbox/sent/denied/${item.id}`}>
    <Titles>
        {item.requestType} 
    </Titles>
        {item.date.toLocaleString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: undefined,
            minute: undefined,
            second: undefined,
        })}
    </Buttons>
))}

    {/*This is the request button*/}
    <Buttons 
    href="/hamburger/inbox/form" 
    background={"green"}
    >
        <Texts size={"p2"}>Request</Texts>
    </Buttons>
</>
)}