"use client"
import { inboxContent } from "@/lib/types";

export default function RTab({sentContent} : inboxContent) {
    
    return (
        <>
        { sentContent ? <></> : null}
        </>
    )
}