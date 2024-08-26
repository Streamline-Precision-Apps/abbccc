"use client";

import { Contents } from "@/components/(reusable)/contents";
import { Expands } from "@/components/(reusable)/expands";
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
    return (
        <>
            {/* We will mostlikly get ride of this section later on */}
            <Contents variant={"border"} size={"null"} >
            <Expands title="All in DB Cost Codes" divID={"1"}>
            <Contents>
                    {costCodes.map((costCode: costCodes) => (
                        <ul key={costCode.id}>
                            <li>{costCode.cost_code} {costCode.cost_code_description}</li>
                        </ul>
                    ))}
                    </Contents>
            </Expands>
        </Contents>
        {/*Form for creating cost codes*/}
        <Contents variant={"border"} size={"null"} >
        <Expands title="Create Cost Codes" divID={"2"}>

        </Expands> 
        </Contents>
        {/*Form for creating cost codes*/}
        <Contents variant={"border"} size={"null"} >
        <Expands title="Edit Cost Codes" divID={"3"}>

        </Expands> 
        </Contents>
        {/*Form for deleting cost codes*/}
        <Contents variant={"border"} size={"null"} >
        <Expands title="Delete Cost Codes" divID={"4"}>

        </Expands> 
        </Contents>
            {/*will be an interactive table of cost codes under jobs, we will then assign costcodes by a list to a jobsite
             cost_code_type is how we can filter the costcodes its a string for now */}
            <Contents variant={"border"} size={"null"} >
            <Expands title="Tag Costcodes to Jobs" divID={"5"}>
            </Expands> 
        </Contents>
        </>
    )
}