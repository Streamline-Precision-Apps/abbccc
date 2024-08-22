"use client";

import { createCostCode, EditCostCode, fetchByNameCostCode } from "@/actions/adminActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Expands } from "@/components/(reusable)/expands";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import SearchBar from "@/components/(search)/searchbar";
import { useTranslations } from "next-intl";
import { ChangeEvent, useState } from "react";

type Props = {
    costCodes: costCodes[]
}

type costCodes = {
    id: number
    cost_code: string
    cost_code_description: string
    cost_code_type: string
}
export default function CostCodes( { costCodes }: Props ) {
    const t = useTranslations("admin-assets-costcode");
    const [Banner, setBanner] = useState<string>("");
    const [showBanner, setShowBanner] = useState<boolean>(false);
    const [searchTerm1, setSearchTerm1] = useState<string>("");
    const [searchTerm2, setSearchTerm2] = useState<string>("");
    const [editForm, setEditForm] = useState<boolean>(true);
    const [costCodeList, setCostCodeList] = useState<costCodes[]>(costCodes);
    const [Response, setResponse] = useState<costCodes | null>(null);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
        const value = e.target.value.toLowerCase();
        if (id === '2') {
            setSearchTerm2(value);
        }
        if (id === '1') {
            setSearchTerm1(value);
        }
        const filteredList = costCodes.filter((item) =>
            item.cost_code.toLowerCase().includes(value) ||
            item.cost_code_description.toLowerCase().includes(value)
        );
        setCostCodeList(filteredList);
        setEditForm(true);
    };

    async function handleEditForm(id: string) {
        setEditForm(false);
        if (id === '2') {
            const response = await fetchByNameCostCode(searchTerm2);
            if (response) {
                setResponse(response as unknown as costCodes); // No need to access the first element of an array
            } else {
                console.log("Error fetching equipment.");
            }
        }
        if (id === '1') {
            }
        const response = await fetchByNameCostCode(searchTerm1);
        if (response) {
          setResponse(response as unknown as costCodes); // No need to access the first element of an array
        } else {
            console.log("Error fetching equipment.");
        }
    }


    async function handleBanner( words: string ) {
        
        setShowBanner(true);
        setBanner(words);
        setSearchTerm1("");
        setSearchTerm2("");
        setEditForm(true);
        // Trigger interval to hide the banner after 4 seconds
        const intervalId = setInterval(() => {
            setShowBanner(false);
            setBanner("");
            clearInterval(intervalId); 
            window.location.reload();
        }, 4000);
    }
    

    return (
        <>
        { showBanner && (
                    <Contents size={null} variant={"header"}>
                        <Texts>{Banner}</Texts>
                    </Contents>     
                    )
                }    
            {/* We will mostlikly get ride of this section later on */}
            <Contents variant={"default"} size={null} >
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
        <Contents variant={"default"} size={null} >
        <Expands title="Create Cost Codes" divID={"2"}>
        <Forms action={createCostCode} onSubmit={() => handleBanner("Created Successfully")}>

        <Labels variant="default" type="">Cost Code *</Labels>
        <Inputs variant="default" type="text" name="cost_code"  required />

        <Labels variant="default" type="">Cost Code Description *</Labels>
        <Inputs variant="default" type="text" name="cost_code_description" required />

        <Labels variant="default" type="">Cost code Tag *</Labels>
        <Inputs variant="default" type="text" name="cost_code_type" required/>

        <Buttons variant="green" size={"minBtn"} type="submit">
            <Texts>Create Jobsite</Texts>
        </Buttons>
        </Forms>
        </Expands> 
        </Contents>
        {/*Form for creating cost codes*/}
        <Contents variant={"default"} size={null} >
        <Expands title="Edit Cost Codes" divID={"3"}>
        <Contents variant={"rowCenter"} size={null}>
                <SearchBar
                    searchTerm={searchTerm1}
                    onSearchChange={(e) => handleSearchChange(e, "1")}
                    placeholder="Search equipment..."
                    />
                </Contents>
                {searchTerm1 && editForm && (
                    <ul>
                        {costCodes.map((item) => (
                            <Buttons variant="orange" size="listLg" onClick={() => {setSearchTerm1(item.cost_code);setEditForm(false);}} key={item.id}>
                                <Texts>
                                    {item.cost_code} ({item.cost_code_description})    
                                </Texts>
                            </Buttons>
                        ))}
                    </ul>
                )}
                {Response === null && 
                <Buttons variant="orange" size={"minBtn"} onClick={() => handleEditForm("1")} >
                    <Texts>Search</Texts>
                </Buttons>
                }
                {/* Display the form for editing the selected equipment */}
                {Response !== null &&  !editForm && (
                <Forms action={EditCostCode} onSubmit={() => handleBanner("update Successfully")}>

                <Labels variant="default" type="" defaultValue={Response.cost_code}>Cost Code *</Labels>
                <Inputs variant="default" type="text" name="cost_code" required />

                <Labels variant="default" type="" >Cost Code Description *</Labels>
                <Inputs variant="default" type="text" name="cost_code_description" 
                defaultValue={Response.cost_code_description}
                required />

                <Labels variant="default" type="">Cost code Tag *</Labels>
                <Inputs variant="default" type="text" name="cost_code_type"
                defaultValue={Response.cost_code_type} required/>

                <Buttons variant="green" size={"minBtn"} type="submit">
                <Texts>Edit</Texts>
                </Buttons>
                </Forms>
                )}
        </Expands> 
        </Contents>
        {/*Form for deleting cost codes*/}
        <Contents variant={"default"} size={null} >
        <Expands title="Delete Cost Codes" divID={"4"}>

        </Expands> 
        </Contents>
            {/*will be an interactive table of cost codes under jobs, we will then assign costcodes by a list to a jobsite
             cost_code_type is how we can filter the costcodes its a string for now */}
            <Contents variant={"default"} size={null} >
            <Expands title="Tag Costcodes to Jobs" divID={"5"}>
            </Expands> 
        </Contents>
        </>
    )
}