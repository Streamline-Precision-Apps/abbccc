"use client";
import { Sections } from "@/components/(reusable)/sections";
import { Texts } from "@/components/(reusable)/texts";
import { Forms} from "@/components/(reusable)/forms";
import { ChangeEvent, useState } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { createEquipment, deleteEquipmentbyId, fetchByNameEquipment, updateEquipment, updateEquipmentID } from "@/actions/equipmentActions";
import SearchBar from "@/components/(search)/searchbar";
import { Content } from "next/font/google";
import { Contents } from "@/components/(reusable)/contents";
import { Banners } from "@/components/(reusable)/banners";
import { Titles } from "@/components/(reusable)/titles";
import { Modals } from "@/components/(reusable)/modals";
import { Expands } from "@/components/(reusable)/expands";

type Equipment = {
    id: string;
    qr_id: string;
    name: string;
    equipment_tag: string;
    description?: string;
    status?: string;
    last_inspection?: Date | null;
    last_repair?: Date | null;
    make?: string;
    model?: string;
    year?: string;
    license_plate?: string;
    registration_expiration?: Date | null;
    mileage?: string;
    image?: string | null;
};

type Props = {
    equipment: Equipment[];
};

export default function Equipment({ equipment }: Props) {
    const [equipmentList, setEquipmentList] = useState<Equipment[]>(equipment);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [editForm, setEditForm] = useState<boolean>(true);
    const [showBanner, setShowBanner] = useState<boolean>(false);
    const [banner, setBanner] = useState("");
    const [equipmentResponse, setEquipmentResponse] = useState<Equipment | null>(null);
    const [equipmentTag, setEquipmentTag] = useState<string>("EQUIPMENT");
    const t = useTranslations("addEquipmentForm");
    const [qr_id, setQr_id] = useState<string>("");

// Handle form changes mainly the search feature for getting the equipment by name and setting the target value to that equipment
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setEquipmentTag(e.target.value);
    };

    // ths handler enables us to search for the equipment by name. We then can select the item from the list and set it as the target value
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filteredList = equipment.filter((item) =>
            item.name.toLowerCase().includes(value) ||
            item.qr_id.toLowerCase().includes(value)
        );
        setEquipmentList(filteredList);
        setEditForm(true);
    };

    // this lets us do the server action and provides error handling if there is an error
    async function handleEditForm() {
        setEditForm(false);
        const response = await fetchByNameEquipment(searchTerm);
        if (response) {
          setEquipmentResponse(response as unknown as Equipment); // No need to access the first element of an array
        } else {
            console.log("Error fetching equipment.");
        }
    }

    async function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
        setShowBanner(true)
        setBanner("Equipment was Created successfully");

        const intervalId = setInterval(() => {
            setShowBanner(false);
            setBanner("");
            clearInterval(intervalId); 
            window.location.reload();
        }, 4000);
    }

    async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // Prevent the default form submission
        setShowBanner(true);
        setBanner("Equipment was edited successfully");
        setSearchTerm("");
        setEditForm(true);
        // Trigger interval to hide the banner after 4 seconds
        const intervalId = setInterval(() => {
            setShowBanner(false);
            setBanner("");
            clearInterval(intervalId); 
            window.location.reload();
        }, 4000);
    }
    const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        const formData = new FormData();
        formData.append( "id", searchTerm)
        const data = await deleteEquipmentbyId(formData)
        if ( data ===  true){
        setShowBanner(true);
        setBanner("Equipment was deleted successfully");

        const intervalId = setInterval(() => {
            setShowBanner(false);
            setBanner("");
            clearInterval(intervalId);
            window.location.reload();
        }, 4000);
        setSearchTerm("");
    }
    else {
        setShowBanner(true);
        setBanner("Error deleting equipment");

        const intervalId = setInterval(() => {
            setShowBanner(false);
            setBanner("");
            clearInterval(intervalId);
            window.location.reload();
        }, 4000);
        setSearchTerm("");
    }
    }



    return(
        <>

        <Contents variant={"border"} size={"null"} >
        <Expands title="Create New Equipment" divID={"1"} >
                <Forms action={createEquipment} onSubmit={handleCreateSubmit}>
                    <Labels variant="default" type="title">Equipment Code *</Labels>
                    <Inputs variant="default" type="default" name="qr_id" state="default" />
                    <Labels variant="default" type="title">{t("Tag")} *</Labels>
                    <select
                        id="equipment_tag"
                        name="equipment_tag"
                        onChange={handleChange}
                        className="block w-full border border-black rounded p-2"
                    >
                        <option value="">{t("Select")}</option>
                        <option value="TRUCK">{t("Truck")}</option>
                        <option value="TRAILER">{t("Trailer")}</option>
                        <option value="EQUIPMENT">{t("Equipment")}</option>
                    </select>

                    <Labels variant="default" type="title">{t("Name")} *</Labels>
                    <Inputs variant="default" type="default" id="name" name="name" state="default" />
                    
                    <Labels variant="default" type="title">{t("Description")}</Labels>
                    <textarea
                        id="description"
                        name="description"
                        className="block w-full border border-black rounded p-2"
                    />

                    <Labels variant="default" type="title">{t("Status")} *</Labels>
                    <select
                        id="equipment_status"
                        name="equipment_status"
                        className="block w-full border border-black rounded p-2"
                    >
                        <option value="">{t("Select")}</option>
                        <option value="OPERATIONAL">{t("Operational")}</option>
                        <option value="NEEDS_REPAIR">{t("NeedsRepair")}</option>
                    </select>
                    
                    {/* Conditional fields based on equipmentTag */}
                    {equipmentTag === "TRUCK" || equipmentTag === "TRAILER" ? (
                        <>
                            <Labels variant="default" type="title">{t("Make")} *</Labels>
                            <Inputs variant="default" type="default" id="make" name="make" state="default" />
                            <Labels variant="default" type="title">{t("Model")} *</Labels>
                            <Inputs variant="default" type="default" id="model" name="model" state="default" />
                            <Labels variant="default" type="title">{t("Year")} *</Labels>
                            <Inputs variant="default" type="default" id="year" name="year" state="default" />
                            <Labels variant="default" type="title">{t("LicensePlate")} *</Labels>
                            <Inputs variant="default" type="default" id="license_plate" name="license_plate" state="default" />
                            <Labels variant="default" type="title">{t("RegistrationExpiration")} *</Labels>
                            <Inputs variant="default" type="date" id="registration_expiration" name="registration_expiration" state="default" />
                            <Labels variant="default" type="title">{t("Mileage")} *</Labels>
                            <Inputs variant="default" type="default" id="mileage" name="mileage" state="default" />
                        </>
                    ) : null}

                    <Buttons variant="green" size="default" type="submit">
                        {t("Submit")}
                    </Buttons>
                </Forms>
                </Expands>
            </Contents>
            <Contents variant={"border"} size={"null"} >
            <Expands title="Edit Existing Equipment" divID={"2"} >
                <Contents variant={"searchBar"} size="null">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    placeholder="Search equipment..."
                    />
                </Contents>
                {searchTerm && editForm && (
                    <ul>
                        {equipmentList.map((item) => (
                            <Buttons onClick={() => {setSearchTerm(item.name); setEditForm(false);}} key={item.id}>
                                {item.name} ({item.qr_id})
                            </Buttons>
                        ))}
                    </ul>
                )}
                {equipmentResponse === null && 
                <Buttons variant="orange" size="default" onClick={handleEditForm}>
                    {t("Submit")}
                </Buttons>
                }

                {/* Display the form for editing the selected equipment */}
                {equipmentResponse !== null &&  !editForm && (
                    <Forms action={updateEquipment} onSubmit={handleEditSubmit}>
                        <Inputs type="hidden" name="id" defaultValue={equipmentResponse.id} />
                        <Labels variant="default" type="title">Equipment Code *</Labels>
                        <Inputs
                            variant="default"
                            type="default"
                            name="qr_id"
                            defaultValue={equipmentResponse.qr_id}
                            state="default"
                        />
                        <Labels variant="default" type="title">{t("Name")}</Labels>
                        <Inputs
                            variant="default"
                            type="default"
                            name="name"
                            defaultValue={equipmentResponse.name}
                            state="default"
                        />
                        <Labels variant="default" type="title">{t("Description")}</Labels>
                        <textarea
                            id="description"
                            name="description"
                            className="block w-full border border-black rounded p-2"
                            defaultValue={equipmentResponse.description || ""}
                        />
                        <Labels variant="default" type="title">{t("Status")}</Labels>
                        <select
                            id="equipment_status"
                            name="equipment_status"
                            className="block w-full border border-black rounded p-2"
                            defaultValue={equipmentResponse.status || ""}
                        >
                            <option value="">{t("Select")}</option>
                            <option value="OPERATIONAL">{t("Operational")}</option>
                            <option value="NEEDS_REPAIR">{t("NeedsRepair")}</option>
                        </select>
                        
                        {/* Conditional fields based on equipmentTag */}
                        {equipmentResponse.equipment_tag === "TRUCK" || equipmentResponse.equipment_tag === "TRAILER" ? (
                            <>
                                <Labels variant="default" type="title">{t("Make")}</Labels>
                                <Inputs
                                    variant="default"
                                    type="default"
                                    id="make"
                                    name="make"
                                    defaultValue={equipmentResponse.make || ""}
                                    state="default"
                                />
                                <Labels variant="default" type="title">{t("Model")}</Labels>
                                <Inputs
                                    variant="default"
                                    type="default"
                                    id="model"
                                    name="model"
                                    defaultValue={equipmentResponse.model || ""}
                                    state="default"
                                />
                                <Labels variant="default" type="title">{t("Year")}</Labels>
                                <Inputs
                                    variant="default"
                                    type="default"
                                    id="year"
                                    name="year"
                                    defaultValue={equipmentResponse.year || ""}
                                    state="default"
                                />
                                <Labels variant="default" type="title">{t("LicensePlate")}</Labels>
                                <Inputs
                                    variant="default"
                                    type="default"
                                    id="license_plate"
                                    name="license_plate"
                                    defaultValue={equipmentResponse.license_plate || ""}
                                    state="default"
                                />
                                <Labels variant="default" type="title">{t("RegistrationExpiration")}</Labels>
                                <Inputs
                                    variant="default"
                                    type="date"
                                    id="registration_expiration"
                                    name="registration_expiration"
                                    defaultValue={equipmentResponse.registration_expiration ? equipmentResponse.registration_expiration.toISOString() : ""}
                                    state="default"
                                />
                                <Labels variant="default" type="title">{t("Mileage")}</Labels>
                                <Inputs
                                    variant="default"
                                    type="default"
                                    id="mileage"
                                    name="mileage"
                                    defaultValue={equipmentResponse.mileage || ""}
                                    state="default"
                                />
                            </>
                        ) : null}

                        <Buttons variant="orange" size="default" type="submit">
                            Edit Equipment
                        </Buttons>
                    </Forms>
                )} 
                </Expands>
            </Contents>
        {showBanner && <Banners>{banner}</Banners>}
        <Contents variant={"border"} size={"null"} >
        <Expands title="Temporary Equipment" divID={"3"} >
            {equipment.filter((item) => item.qr_id.slice(0, 4) === "EQ-T") .length > 0 ? (
                    <>
                    <Texts variant="default" className="bg-app-orange">
                    Banner appears when Equipment is Created. Please Edit the Temporary Equipment to a Permanent Equipment.
                    </Texts>
                    </>
            ) : null}

                <ul>
                {equipmentList.map((item) => (
                    item.qr_id.slice(0, 4) === "EQ-T" ? 
                        <Buttons key={item.id} onClick={() => {setQr_id(item.qr_id); setEquipmentResponse(item); }}>
                        {item.name} ({item.qr_id})
                        </Buttons>
                        : null
                    ))}

                </ul> 
                {equipment.filter((item) => item.qr_id.slice(0, 4) === "EQ-T") .length > 0 ? (
                <>
                    <Forms action={updateEquipmentID}>
                        <Inputs type="hidden" name="id" defaultValue={equipmentResponse?.id} />
                        <Labels variant="default"  type="title">Current Equipment ID <span className="text-red-500 text-xs">4 Charater cannot be capital T </span></Labels>
                        <Inputs type="text" readOnly defaultValue={equipmentResponse?.qr_id} state="disabled"  />
                        <Labels variant="default" type="title">New Equipment ID</Labels>
                        <Inputs type="text" name="qr_id" defaultValue={equipmentResponse?.qr_id} />

                        <Labels variant="default" type="title">Current Equipment Name</Labels>
                        <Inputs type="text" readOnly state="disabled"  defaultValue={equipmentResponse?.name} />
                        
                        <Labels variant="default" type="title">New Equipment name</Labels>
                        <Inputs type="text" name="name" defaultValue={equipmentResponse?.name} />

                        <Buttons variant="orange" size="default" type="submit">
                            Edit Equipment ID
                        </Buttons>
                    </Forms>
            </>
                ) : <Texts variant="default">No Equipment with Temporary ID</Texts>}
            </Expands>
        </Contents>
            <Contents variant={"border"} size={"null"} >
                <Expands title="Delete Equipment" divID={"4"} >
                {showBanner && <Banners>{banner}</Banners>}
                <Contents variant={"searchBar"} size="null">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    placeholder="Search equipment..."
                    />
                </Contents>
                {searchTerm && editForm && (
                    <ul>
                        {equipmentList.map((item) => (
                            <Buttons onClick={() => {setSearchTerm(item.id); setEditForm(false);}} key={item.id}>
                                {item.name} ({item.qr_id})
                            </Buttons>
                        ))}
                    </ul>
                )}
                {equipmentResponse === null && 
                <Forms onSubmit={handleDelete}>
                <Inputs type="hidden" name="id" defaultValue={searchTerm} />
                <Buttons variant="red" size="default" type="submit">
                    <Texts>Delete</Texts>
                </Buttons>
                </Forms>
                }
                </Expands>
            </Contents>
            </>
    ) 
}
