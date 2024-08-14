"use client";

import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Modals } from "@/components/(reusable)/modals";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Props = {
    costCodes: costCodes[]
}

type costCodes = {
    id: number
    cost_code: string
    cost_code_description: string
}
export default function CostCodes( { costCodes }: Props ) {
    const t = useTranslations("admin-assets-costcode");
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);
    const [isOpen5, setIsOpen5] = useState(false);

    return (
        <>
            {/* We will mostlikly get ride of this section later on */}
            <Contents variant={"border"} size={"null"} >
            <Buttons variant={"icon"} size={"default"}  onClick={() => setIsOpen1(true)} >
            <Titles variant={"default"} size={"h1"}> All in DB Cost Codes</Titles> 
            </Buttons>
            <Modals handleClose={() => setIsOpen1(false)} isOpen={isOpen1} type={"expand"}>
            <Contents>
                    {costCodes.map((costCode: costCodes) => (
                        <ul key={costCode.id}>
                            <li>{costCode.cost_code} {costCode.cost_code_description}</li>
                        </ul>
                    ))}
                    </Contents>
            </Modals>
        </Contents>

        {/*Form for creating cost codes*/}
        <Contents variant={"border"} size={"null"} >
        <Buttons variant={"icon"} size={"default"}  onClick={() => setIsOpen2(true)} >
            <Titles variant={"default"} size={"h1"}>Create Cost Codes</Titles>
        </Buttons>
            <Modals handleClose={() => setIsOpen2(false)} isOpen={isOpen2} type={"expand"}>
            
            </Modals> 
        </Contents>

        {/*Form for creating cost codes*/}
        <Contents variant={"border"} size={"null"} >
        <Buttons variant={"icon"} size={"default"}  onClick={() => setIsOpen3(true)} >
            <Titles variant={"default"} size={"h1"}>Editing Cost Codes</Titles> 
        </Buttons>
            <Modals handleClose={() => setIsOpen3(false)} isOpen={isOpen3} type={"expand"}>

            </Modals>
        </Contents>
        {/*Form for deleting cost codes*/}
        <Contents variant={"border"} size={"null"} >
        <Buttons variant={"icon"} size={"default"}  onClick={() => setIsOpen4(true)} >
            <Titles variant={"default"} size={"h1"}>Delete Cost Codes</Titles> 
        </Buttons>
            <Modals handleClose={() => setIsOpen4(false)} isOpen={isOpen4} type={"expand"}>

            </Modals>
        </Contents>
            {/*will be an interactive table of cost codes under jobs, we will then assign costcodes by a list to a jobsite
             cost_code_type is how we can filter the costcodes its a string for now */}
            <Contents variant={"border"} size={"null"} >
            <Buttons variant={"icon"} size={"default"}  onClick={() => setIsOpen5(true)} >
            <Titles variant={"default"} size={"h1"}>Tag Costcodes to Jobs</Titles> 
            </Buttons>
            <Modals handleClose={() => setIsOpen5(false)} isOpen={isOpen5} type={"expand"}>

            </Modals>
        </Contents>
        </>
    )
}