"use client"
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
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
    <Buttons variant={"green"} size={"maxBtn"} key={item.id} href={`/hamburger/inbox/${item.id}`}>      
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
    <Buttons variant={"orange"} size={"maxBtn"} key={item.id} href={`/hamburger/inbox/${item.id}`}>
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
    <Buttons variant={"red"} size={"maxBtn"} key={item.id} href={`/hamburger/inbox/${item.id}`}>
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
    size={"minBtn"} 
    variant={"green"}
    >
    <Texts variant={"default"} size={"p2"}>
        Request
        </Texts>
    </Buttons>
</>
)}