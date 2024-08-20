"use client";
import { useState, useEffect } from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { Buttons } from "@/components/(reusable)/buttons";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { DeleteLogs, updateEmployeeEquipmentLog } from "@/actions/equipmentActions";
import { useRouter } from 'next/navigation';
import { Banners } from "@/components/(reusable)/banners";
import { useTranslations } from "next-intl";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";

type Props = {
    eqid: string | undefined;
    name: string | undefined;
    start_time: Date;
    completed: boolean | undefined;
    filled: boolean | undefined;
    fuelUsed: string | undefined;
    savedDuration: string | undefined;
    equipment_notes?: string | null | undefined;
    current? : number;
    total? : number;
};

export default function CombinedForm({ eqid, name, start_time, completed, filled, fuelUsed, savedDuration, equipment_notes }: Props) {
    const router = useRouter();
    const [refueled, setRefueled] = useState(filled || false);
    const [fuel, setFuel] = useState(fuelUsed ? parseInt(fuelUsed) : 0);
    const [notes, setNotes] = useState(equipment_notes || "");
    const [isEditMode, setIsEditMode] = useState(false);
    const end_time = new Date();
    const duration = ((end_time.getTime() - start_time.getTime()) / (1000 * 60 * 60)).toFixed(2);
    const [changedDuration, setChangedDuration] = useState(savedDuration);
    const t = useTranslations("EquipmentContent");

    useEffect(() => {
        if (completed) {
            setIsEditMode(false);
        }
    }, [completed, refueled, fuel, notes, changedDuration]);

    const handleRefueledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRefueled(event.target.checked);
    };

    const handleFuelValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFuel(event.target.valueAsNumber);
    };

    const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(event.target.value);
    };

    const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChangedDuration(event.target.value);
    };

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleSaveClick = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('end_time', end_time.toString());
        formData.append('id', eqid ?? "");
        formData.append('completed', "true");
        if (changedDuration !== undefined) {
            formData.append('duration', changedDuration);
        }

        formData.append('refueled', refueled.toString());
        formData.append('fuel_used', fuel.toString());
        formData.append('equipment_notes', notes || "");
        await updateEmployeeEquipmentLog(formData);

        setIsEditMode(false);
    };

    const deleteHandler = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formData1 = new FormData();
        formData1.append('id', eqid ?? "");
        await DeleteLogs(formData1);
        router.replace("/dashboard/equipment");
    }

    const confirmation = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('end_time', end_time.toString());
        formData.append('id', eqid ?? "");
        formData.append('completed', "true");
        formData.append('duration', duration);
        formData.append('refueled', refueled.toString());
        formData.append('fuel_used', fuel.toString());

        await updateEmployeeEquipmentLog(formData);
    };


    return (
        <Bases>   
        {completed ? (<Banners variant={"green"} >
        {t("Banner")}
        </Banners >) : null}
        
            <Sections size={"titleBox"}>
                <TitleBoxes
                    title={`${name}`}
                    type="noIcon"
                    titleImg="/current.svg"
                    titleImgAlt="Current"
                    variant={"default"}
                    size={"default"}
                />
            </Sections>
            <Forms action={updateEmployeeEquipmentLog}>
                <Sections size={"dynamic"}>
                    <Labels variant={"default"} size={"default"}></Labels>
                        {t("Refueled")}
                        <Inputs
                            name="refueled"
                            type="checkbox"
                            checked={refueled}
                            onChange={handleRefueledChange}
                            readOnly={!isEditMode && completed}
                        />
                </Sections>
                    {refueled ? (
                        <Sections size={"dynamic"}>
                            <Labels variant={"default"} size={"default"}></Labels>
                                {t("Gallons")}
                                <Inputs
                                    type="number"
                                    name="fuel_used"
                                    value={fuel}
                                    onChange={handleFuelValue}
                                    readOnly={!isEditMode && completed}
                                />
                        </Sections>
                    ) : (
                        <Inputs type="hidden" name="fuel_used" value="0" />
                    )}
                <Sections size={"dynamic"}>
                    <Labels variant={"default"} size={"default"}></Labels>
                        {t("CheckedTime")}
                        <Inputs
                            name={"duration"}
                            value={completed ? changedDuration : duration}
                            onChange={handleDurationChange}
                            readOnly={!isEditMode && completed}
                        />
                    <Labels variant={"default"} size={"default"}></Labels>
                        {t("Notes")}
                        <TextAreas
                            name="equipment_notes"
                            value={notes || ""}
                            onChange={handleNotesChange}
                            readOnly={!isEditMode && completed}
                        />
                </Sections>
                <Inputs type="hidden" name="end_time" value={end_time.toString()} />
                <Inputs type="hidden" name="id" value={eqid} />
                <Inputs type="hidden" name="completed" value="true" />
                {completed ? (
                    isEditMode ? (
                        <Buttons
                            type="submit"
                            onClick={handleSaveClick}
                            variant={"green"}
                            size={"default"}
                            value="Save"
                        >
                            {t("Save")}
                        </Buttons>
                    ) : (
                        <Buttons
                            type="button"
                            onClick={handleEditClick}
                            variant={"orange"}
                            size={"default"}
                            value="Edit"
                        >
                            {t("Edit")}
                        </Buttons>
                    )
                ) : (
                    <Buttons
                        type="submit"
                        onClick={confirmation}
                        variant={"green"}
                        size={"default"}
                        value="Submit"
                    >
                        {t("Submit")}
                    </Buttons>
                )}
                <Buttons href="/dashboard/equipment" variant={"red"} size={"default"} onClick={deleteHandler}>
                {t("Delete")}
                </Buttons>
            </Forms>
        </Bases>
    );
}
