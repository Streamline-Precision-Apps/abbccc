"use client";
import { Sections } from "@/components/(reusable)/sections";
import React from "react";

type Equipment = {
    id: string;
    name: string;
    qr_id: string;
    description: string;
    status: string;
    equipment_tag: string;
    last_inspection: Date | null;
    last_repair: Date | null;
    is_active: boolean;
};

type EquipmentLog = {
    id: string;
    employee_id: string;
    equipment_id: string;
    start_time: Date;
    end_time: Date | null;
    duration: number | null;
    Equipment: Equipment;
};

type EquipmentSheetsProps = {
    equipmentData: EquipmentLog[];
};

export default function EquipmentSheets({ equipmentData }: EquipmentSheetsProps) {
    return (
        <Sections size={"dynamic"}>
            <h1>Equipment Sheets</h1>
            <ul>
                {equipmentData.map((log) => (
                    <li key={log.id}>
                        <p>{log.Equipment.name}</p>
                        <p>{log.Equipment.qr_id}</p>
                    </li>
                ))}
            </ul>
        </Sections>
    );
}