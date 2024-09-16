"use client";

import { createJobsite, deleteJobsite, editGeneratedJobsite, fetchByNameJobsite, updateJobsite } from "@/actions/adminActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Expands } from "@/components/(reusable)/expands";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Modals } from "@/components/(reusable)/modals";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import SearchBar from "@/components/(search)/searchbar";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import { ChangeEvent, useState } from "react";
import { Jobsite as JobsiteType } from "@/lib/types";


type Props = {
    jobsites: JobsiteType[];
    setBanner: Dispatch<SetStateAction<string>>;
    setShowBanner:  Dispatch<SetStateAction<boolean>>
}
export default function Jobsite( { jobsites, setBanner, setShowBanner }: Props ) {
    const formRef = React.createRef<HTMLFormElement>();
    const t = useTranslations("admin-assets-jobsite");
    const [searchTerm1, setSearchTerm1] = useState<string>("");
    const [searchTerm2, setSearchTerm2] = useState<string>("");
    const [jobsiteList, setJobsiteList] = useState<JobsiteType[]>(jobsites);
    const [Response, setResponse] = useState<JobsiteType | null>(null);
    const [editForm, setEditForm] = useState<boolean>(true);
    
    // Reset the form when the modal is closed

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
        const value = e.target.value.toLowerCase();
        if (id === '2') {
            setSearchTerm2(value);
        }
        if (id === '1') {
            setSearchTerm1(value);
        }
        const filteredList = jobsites.filter((item) =>
            item.jobsite_name.toLowerCase().includes(value) ||
            item.jobsite_id.toLowerCase().includes(value)
        );
        setJobsiteList(filteredList);
        setEditForm(true);
    };

    async function handleEditForm(id: string) {
        setEditForm(false);
        if (id === '2') {
            const response = await fetchByNameJobsite(searchTerm2);
            if (response) {
                setResponse(response as unknown as JobsiteType); // No need to access the first element of an array
            } else {
                console.log("Error fetching equipment.");
            }
        }
        if (id === '1') {
            }
        const response = await fetchByNameJobsite(searchTerm1);
        if (response) {
          setResponse(response as unknown as JobsiteType); // No need to access the first element of an array
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


    return(
        <> 
        <Contents variant={"default"} size={null} >
        <Expands title="Active Jobsites" divID={"1"}>
                <Contents size={null}>
                    <table>
                        <thead>
                            <tr>
                                <th>{t("JobsiteName")}</th>
                                <th>{t("StreetNumber")}</th>
                                <th>{t("StreetName")}</th>
                                <th>{t("City")}</th>
                                <th>{t("State")}</th>
                                <th>{t("Country")}</th>
                                <th>{t("IsActive")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobsites.map((jobsite) => (
                                <tr key={jobsite.id}>
                                { jobsite.jobsite_active ? (    
                                    
                                    <>
                                    <td>{jobsite.jobsite_name}</td>
                                    <td>{jobsite.street_number}</td>
                                    <td>{jobsite.street_name}</td>
                                    <td>{jobsite.city}</td>
                                    <td>{jobsite.state}</td>
                                    <td>{jobsite.country}</td>  
                                    <td>{jobsite.jobsite_active ? "Active" : "Inactive"}</td>
                                    </>
                                ) : (null)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Contents>
            </Expands>
            </Contents>
        {/* This section is used to create a new jobsite */}
        <Contents variant={"default"} size={null} >
        <Expands title= "Create New Jobsite" divID={"2"} >
                <Forms action={createJobsite} onSubmit={() => handleBanner("Created Successfully")}>

                <Labels variant="default" type="">{t("JobsiteName")} *</Labels>
                <Inputs variant="default" type="text" name="jobsite_name" required />

                <Labels variant="default" type="">{t("StreetNumber")} *</Labels>
                <Inputs variant="default" type="text" name="street_number" required />

                <Labels variant="default" type="">{t("StreetName")} *</Labels>
                <Inputs variant="default" type="text" name="street_name" required/>

                <Labels variant="default" type="">{t("City")}*</Labels>
                <Inputs variant="default" type="text" name="city" required />

                <Labels variant="default" type="">{t("State")} *</Labels>
                <Inputs variant="default" type="text" name="state" required />

                <Labels variant="default" type="">{t("Country")} *</Labels>
                <Inputs variant="default" type="text" name="country" required />

                <Labels variant="default" type="">{t("Description")} *</Labels>
                <Inputs variant="default" type="text" name="jobsite_description" required />

                <Labels variant="default" type="">{t("Comments")} *</Labels>
                <Inputs variant="default" type="text" name="comments" required />

                    <Buttons variant="green" size={"minBtn"} type="submit">
                        <Texts>Create Jobsite</Texts>
                    </Buttons>
                </Forms>
            </Expands>
            </Contents>
        {/* This section is used to search and update an existing  jobsite */}
            <Contents variant={"default"} size={null} >   
            <Expands title="Edit Existing Jobsite" divID={"3"}>
                <Contents variant={"rowCenter"} size={null}>
                <SearchBar
                    searchTerm={searchTerm1}
                    onSearchChange={(e) => handleSearchChange(e, "1")}
                    placeholder="Search equipment..."
                    />
                </Contents>
                {searchTerm1 && editForm && (
                    <ul>
                        {jobsiteList.map((item) => (
                            <Buttons variant="orange" size="listLg" onClick={() => {setSearchTerm1(item.jobsite_name);setEditForm(false);}} key={item.id}>
                                <Texts>
                                    {item.jobsite_name} ({item.jobsite_id})    
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
                    <Forms action={updateJobsite} onSubmit={() => handleBanner("Updated Successfully")} >

                        <Inputs type="text" name="id" hidden defaultValue={Response.id} />

                        <Labels variant="default" type="">{t("IsActive")} *</Labels>
                        <Inputs variant="default" type="checkbox" defaultValue={Response.jobsite_active ? "true" : "false"} name="jobsite_active" />

                        <Labels variant="default" type="">{t("JobsiteName")} *</Labels>
                        <Inputs variant="default" type="text"  defaultValue={Response.jobsite_name} name="jobsite_name" required />

                        <Labels variant="default" type="">{t("StreetNumber")} *</Labels>
                        <Inputs variant="default" type="text" name="street_number"  defaultValue={Response.street_number ?? " " } required />

                        <Labels variant="default" type="">{t("StreetName")} *</Labels>
                        <Inputs variant="default" type="text" name="street_name"  defaultValue={Response.street_name} required/>

                        <Labels variant="default" type="">{t("City")}*</Labels>
                        <Inputs variant="default" type="text" name="city"  defaultValue={Response.city} required />

                        <Labels variant="default" type="">{t("State")} *</Labels>
                        <Inputs variant="default" type="text" name="state"  defaultValue={Response.state ?? " "} required />

                        <Labels variant="default" type="">{t("Country")} *</Labels>
                        <Inputs variant="default" type="text" name="country"  defaultValue={Response.country} required />

                        <Labels variant="default" type="">{t("Description")} *</Labels>
                        <Inputs variant="default" type="text" name="jobsite_description"  defaultValue={Response.jobsite_description ?? " "} required />

                        <Labels variant="default" type="">{t("Comments")} *</Labels>
                        <Inputs variant="default" type="text" name="comments"  defaultValue={Response.comments ?? " "} required />
                

                        <Buttons variant="orange" size={"minBtn"} type="submit">
                            <Texts>Edit Selected Job Site</Texts>
                        </Buttons>
                    </Forms>
                )} 
                </Expands>
            </Contents>

{/* Delete Existing Jobsites */}
<Contents variant={"default"} size={null} > 
            <Expands title="Delete Existing Jobsite" divID={"4"}>
                <Contents variant={"rowCenter"} size={null}>
                <SearchBar
                    searchTerm={searchTerm2}
                    onSearchChange={(e) => handleSearchChange(e, "2")}
                    placeholder="Search equipment..."
                    />
                </Contents>
                {searchTerm2 && editForm && (
                    <ul>
                        {jobsiteList.map((item) => (
                            <Buttons variant="orange" size="listLg" onClick={() => {setSearchTerm2(item.jobsite_name);setEditForm(false);}} key={item.id}>
                                <Texts>{item.jobsite_name} ({item.jobsite_id})</Texts>
                            </Buttons>
                        ))}
                    </ul>
                )}
                {Response === null && 
                <Buttons variant="orange" size={"minBtn"} onClick={() => handleEditForm("2")} >
                    <Texts>Search</Texts>
                </Buttons>
                }
                {/* Display the form for editing the selected equipment */}
                {Response !== null &&  !editForm && (
                    <Forms action={deleteJobsite} onSubmit={() => handleBanner("Deleted jobsite Successfully")} >
                        <Inputs type="hidden" name="id" defaultValue={Response.id} />
                        <Buttons variant="orange" size={"minBtn"} type="submit">
                            Delete Equipment
                        </Buttons>
                    </Forms>
                )} 
                </Expands>
            </Contents>
            {/* Add New Jobsite */}
        <Contents variant={"default"} size={null}>
        <Expands title="Edit Existing Jobsite" divID={"5"}>
        {jobsites.filter((item) => item.jobsite_id.slice(0, 3) === "J-T") .length > 0 ? (
                <>
                    <Texts variant="default" className="bg-app-orange">
                    Banner appears when Equipment is Created from QR Generator. Please Edit the Temporary Equipment to a Permanent Equipment.
                    </Texts>
                    </>
            ) : null}

                    <ul>
                        {jobsiteList.map((item) => (
                            item.jobsite_id.slice(0, 3) === "J-T" ? 
                            <Buttons onClick={() => {setSearchTerm2(item.jobsite_name);setResponse(item);}} key={item.id}>
                                {item.jobsite_name} ({item.jobsite_id})
                            </Buttons>
                            : null
                        ))}
                    </ul>
                    {jobsites.filter((item) => item.jobsite_id.slice(0, 3) === "J-T") .length >  0 ? (
                        <>
                {/* Display the form for editing the selected equipment */}
                    <Forms action={editGeneratedJobsite} onSubmit={() => handleBanner("Edited jobsite Successfully")} >
                        <Inputs type="hidden" name="id" defaultValue={Response?.id} />

                        <Labels variant="default" type="">Previous {t("JobsiteID")} </Labels>
                        <Inputs variant="default" disabled defaultValue={Response?.jobsite_id}  />

                        <Labels variant="default" type="">{t("JobsiteID")} </Labels>
                        <Inputs variant="default" type="text"  defaultValue={Response?.jobsite_id} name="jobsite_id" required />


                        <Labels variant="default" type="">Previous {t("JobsiteName")}</Labels>
                        <Inputs disabled variant="default" readOnly defaultValue={Response?.jobsite_name}/>        

                        <Labels variant="default" type="">{t("JobsiteName")} *</Labels>
                        <Inputs variant="default" type="text"  defaultValue={Response?.jobsite_name} name="jobsite_name" required />                       

                        <Buttons variant="orange" size="default" type="submit">
                            Edit Equipment
                        </Buttons>
                    </Forms>
                    </> ) : (<Texts variant="default">No Jobsites with Temporary ID</Texts>
                )} 
                </Expands>
            </Contents>
            </>
    ) 
}