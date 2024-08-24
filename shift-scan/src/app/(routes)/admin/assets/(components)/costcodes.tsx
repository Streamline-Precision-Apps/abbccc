"use client";

import { createCostCode, deleteCostCode, EditCostCode, fetchByNameCostCode, findAllCostCodesByTags, TagCostCodeChange } from "@/actions/adminActions";
import { Form } from "@/app/(routes)/dashboard/clock-out/(components)/injury-report/form";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Expands } from "@/components/(reusable)/expands";
import { Forms } from "@/components/(reusable)/forms";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import SearchBar from "@/components/(search)/searchbar";
import { useTranslations } from "next-intl";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";

type costCodes = {
    id: number
    cost_code: string
    cost_code_description: string
    cost_code_type: string
}

type Props = {
    costCodes: costCodes[]
    setBanner: Dispatch<SetStateAction<string>>;
    setShowBanner:  Dispatch<SetStateAction<boolean>>
}
export default function CostCodes( { costCodes, setBanner, setShowBanner }: Props ) {

const t = useTranslations("admin-assets-costcode");

// edit costcode state
const [searchTerm1, setSearchTerm1] = useState<string>("");
// delete costcode state
const [searchTerm2, setSearchTerm2] = useState<string>("");


// sets the state for edits in costcode edit section
const [editForm, setEditForm] = useState<boolean>(true);
// helps search bar component show items based on user input and filter all items
const [costCodeList, setCostCodeList] = useState<costCodes[]>(costCodes);

// holds reponse value for the edit to re submit the form with current data filled out.
const [Response, setResponse] = useState<costCodes | null>(null);
// array of costcode types of a certain tag
const [TagsRes, setTagsRes] = useState<costCodes[]>([]);
const [editTags, setEditTags] = useState<boolean>(true);

// makes a unique list of costcode types
const uniqueCostCodes = costCodes.filter(
    (item, index, self) =>
        index === self.findIndex(t => t.cost_code_type === item.cost_code_type)
);
// handles search outputs
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
    // edits the costcode in current db
async function handleEditForm(id: string, TagsId: string) {
        // this handles the edit form sever action for the second search bar
        setResponse(null);
    if (id === '3') {
        const response = await fetchByNameCostCode(TagsId);
        if (response) {
            setResponse(response as unknown as costCodes); // No need to access the first element of an array
        } else {
            console.log("Error fetching equipment.");
        }
    }
    if (id === '2') {
        const response = await fetchByNameCostCode(searchTerm2);
        if (response) {
            setResponse(response as unknown as costCodes); // No need to access the first element of an array
        } else {
            console.log("Error fetching equipment.");
        }
    }
    // this handles the edit form sever action for the first search bar
    if (id === '1') {
        }
    const response = await fetchByNameCostCode(searchTerm1);
    if (response) {
        setResponse(response as unknown as costCodes); 
    } else {
        console.log("Error fetching costcode.");
    }
}


    async function handleBanner( words: string ) {
        window.scrollTo({ top: 0, behavior: 'smooth' });

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
            setResponse(null);
            setTagsRes([]);
            setEditTags(true);
        }, 4000);
    }
    

    async function handleTags(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const costCodes = await findAllCostCodesByTags(formData);
        setTagsRes(costCodes);
        setEditTags(false);
        setResponse(null);
    }

    return (
        <>   
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
<Contents variant={"default"} size={null}>
    <Expands title="Edit Cost Codes" divID={"3"}>
    <Contents variant={"rowCenter"} size={null}>
        <SearchBar
            searchTerm={searchTerm1}
            onSearchChange={(e) => handleSearchChange(e, "1")}
            placeholder="Search for cost code..."
            />
    </Contents>
{/* Display Search options for editing cost codes if search term is not empty and form is not in edit mode*/}
{searchTerm1 && editForm && (
<ul>
    {costCodeList.map((item) => (
        <Buttons variant="orange" size="listLg" onClick={() => {setSearchTerm1(item.cost_code_description);setEditForm(false);}} key={item.id}>
                <Texts>
                {item.cost_code} ({item.cost_code_description})    
                </Texts>
                </Buttons>
    ))}
</ul>
)}
{/*Displays edit submit button when reponse is null*/}
{Response === null && 
    <Buttons variant="orange" size={"minBtn"} onClick={() => handleEditForm("1","")} >
        <Texts>Search</Texts>
    </Buttons>
}
{/* Display the form for editing the selected equipment */}
{Response !== null &&  !editForm && (
    <Forms action={EditCostCode} onSubmit={() => handleBanner("update Successfully")}>

    <Inputs type="text" name="id" hidden defaultValue={Response.id} /> 

    <Labels variant="default" type="">Cost Code *</Labels>
    <Inputs variant="default" type="text" name="cost_code" defaultValue={Response.cost_code} required />

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
<Contents variant={"rowCenter"} size={null}>
    <SearchBar
        searchTerm={searchTerm2}
        onSearchChange={(e) => handleSearchChange(e, "2")}
        placeholder="Search equipment..."
    />
</Contents>

{/* Displays the list of delete options if there is a search term and form is not in edit mode*/}

{searchTerm2 && editForm && (
<ul>
{costCodeList.map((item) => (
    <Buttons variant="orange" size="listLg" onClick={() => {setSearchTerm2(item.cost_code_description);setEditForm(false);}} key={item.id}>
        <Texts>{item.cost_code} ({item.cost_code_description})</Texts>
    </Buttons>
))}
</ul>
)}

{/*Displays edit submit button when reponse is null*/}

{Response === null && 
<Buttons variant="orange" size={"minBtn"} onClick={() => handleEditForm("2", "")} >
    <Texts>Search</Texts>
</Buttons>
}

{/* Display the form for editing the selected equipment */}

{Response !== null &&  !editForm && (
<Forms action={deleteCostCode} onSubmit={() => handleBanner("Deleted jobsite Successfully")} >
    <Labels variant="default" type="">Are you sure you want to delete this cost code?</Labels>
    <Inputs type="hidden" name="id" defaultValue={Response.id} />
    <Buttons variant={"red"} size={"minBtn"} type="submit">
        <Texts>Yes Delete</Texts>
    </Buttons>
</Forms>
)}
</Expands> 
</Contents>
{/**************************************************************************/}

{/*will be an interactive table of cost codes under jobs, we will then assign costcodes by a list to a jobsite
    cost_code_type is how we can filter the costcodes its a string for now */}

{/**************************************************************************/}

<Contents variant={"default"} size={null} >
    <Expands title="Tag Costcodes to Jobs" divID={"5"}>
<Contents variant={"rowCenter"} size={null}>

{/*step 1: Display the option created by the user*/}
<Forms onSubmit={handleTags}> {/* setTagsRes() & setEditForm(false) , setEditTags(false); */}
    <Labels variant="default">Select Cost Code Type</Labels>
    <Selects 
    variant="default" 
    name="cost_code_type"
    onChange={(e) => {
    e.currentTarget.form?.requestSubmit();
    }}
    >
    <option value="default" >Select Cost Code Type</option>
    {uniqueCostCodes.map((item, index) => (
    <option key={index} value={item.cost_code_type}>
    {item.cost_code_type}
    </option>
    ))}
    </Selects>
</Forms>

</Contents>

{/* Displays the list of costcodes if there is a search term and form is not in edit mode*/}
{Response === null &&
<Contents variant={"rowCenter"} size={null}>
{editTags == false && (
<ul>
{TagsRes.map((item) => (
    <Buttons variant="orange" size="listLg" key={item.id} 
    onClick={() =>{
        handleEditForm("3",item.cost_code_description);
    }}>
        <Texts>{item.cost_code} ({item.cost_code_description})</Texts>
    </Buttons>
))}
</ul>
)}
</Contents>
}

{/*Displays a form to change costcodes tags*/}
<Contents variant={"center"} size={null}>
{Response !== null && !editTags && (
    <>
    <Contents variant={"rowCenter"} size={"listTitle"}>
<Buttons variant="orange" size={"default"} onClick={() => {setEditTags(false);; handleEditForm("3", ""); }}>
    <Images variant={"icon"} size={"logo"} titleImg="/backArrow.svg" titleImgAlt="search" />
</Buttons>
    </Contents>

<Forms action={TagCostCodeChange} onSubmit={() => handleBanner("Tagged Successfully changed")}>
    <Inputs type="hidden" name="id" defaultValue={Response.id} />

    <Labels variant="default" type="">Cost Code Id *</Labels>
    <Inputs variant="default" type="text" name="cost_code"
    defaultValue={Response.cost_code}
    state="disabled"
    />
<Labels variant="default" type="">Cost Code Description*</Labels>
<Inputs variant="default" type="text" name="cost_code_description"
    defaultValue={Response.cost_code_description}
    state="disabled"
    />

<Inputs variant="default" type="text" name="cost_code_type"
    defaultValue={Response.cost_code_type}
    />
    
    <Buttons variant="green" size={"minBtn"} type="submit">
        <Texts>Tag</Texts>
    </Buttons>
</Forms>
    </>
)}
</Contents>

    </Expands> 
</Contents>
        </>
    )
}