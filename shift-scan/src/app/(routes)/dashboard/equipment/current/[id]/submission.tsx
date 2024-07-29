"use client"

import { updateEmployeeEquipmentLog } from "@/actions/equipmentActions";
import { Buttons } from "@/components/(reusable)/buttons"
import { useEffect, useState } from "react";

export default function Submission() {

    const [Message, setMessage] = useState("");
    const [displayBtn, setdisplayBtn] = useState(true);

    const confirmation = () =>{
        const message ="Form saved!"
        setMessage(message)
        setdisplayBtn(false)
        const interval = setTimeout(() => {
        setMessage("");
        }, 3000);
    }

    return (
        <>
        <h2 className="text-3xl text-center bg-app-green">{Message}</h2>
            {displayBtn ? ( <Buttons type="submit" 
            onClick={() => confirmation()} variant={"green"} size={"default"} value="Submit"> Submit
                        </Buttons>
            ): ( <></>)}
            <Buttons href="/dashboard/equipment/current" variant={"red"} size={"default"}>
            Delete
            </Buttons>
                    </>
                )
            }