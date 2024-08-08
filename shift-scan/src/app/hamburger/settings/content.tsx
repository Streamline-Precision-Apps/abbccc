"use client";
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import LocaleToggleSwitch from '@/components/(inputs)/toggleSwitch';
import { Sections } from '@/components/(reusable)/sections';
import { Buttons } from '@/components/(reusable)/buttons';
import SwitchWithLabel from '@/components/(inputs)/switchWithLabel';
import { Titles } from '@/components/(reusable)/titles';
import { TitleBoxes } from '@/components/(reusable)/titleBoxes';
import { Bases } from '@/components/(reusable)/bases';
import '@/app/globals.css';
import { Images } from '@/components/(reusable)/images';
import { Texts } from '@/components/(reusable)/texts';
import { Modals } from '@/components/(reusable)/modals';
import { updateSettings } from '@/actions/hamburgerActions';

type Data = {
userId: string;
language?: string;
approvedRequests?: boolean;
timeoffRequests?: boolean;
GeneralReminders?: boolean;
Biometric?: boolean;
cameraAccess?: boolean;
LocationAccess?: boolean;
};

export default function Index({ data }: { data: Data }) {
const t = useTranslations('Hamburger');
const [isModalOpen, setIsModalOpen] = useState(false);
const [updatedData, setUpdatedData] = useState(data);
const [initialData, setInitialData] = useState(data);

useEffect(() => {
setInitialData(data); // Store initial data when component mounts
}, [data]);

const handleSave = async () => {
await updateSettings(updatedData);
setIsModalOpen(false);
};

const handleChange = (key: keyof Data, value: boolean) => {
setUpdatedData((prev) => ({ ...prev, [key]: value }));
setIsModalOpen(true);
};

const handleCancel = () => {
setUpdatedData(initialData); // Revert to initial state on cancel
setIsModalOpen(false);
};

return (
<div>
    <Bases>
    <Sections size={"titleBox"}>
        <TitleBoxes
        title={t("Title")}
        titleImg="/Settings.svg"
        titleImgAlt="Settings"
        variant={"default"}
        size={"default"}
        />
    </Sections>

    <Sections size={"dynamic"}>
        <Titles>{t("Notifications")}</Titles>
        <SwitchWithLabel>
        <Texts size={"left"}>{t("ApprovedRequests")}</Texts>
        <LocaleToggleSwitch
            data={updatedData.approvedRequests}
            onChange={(value: boolean) => handleChange('approvedRequests', value)}
        />
        </SwitchWithLabel>
        <SwitchWithLabel>
        <Texts>{t("TimeOffRequests")}</Texts>
        <LocaleToggleSwitch
            data={updatedData.timeoffRequests}
            onChange={(value: boolean) => handleChange('timeoffRequests', value)}
        />
        </SwitchWithLabel>
        <SwitchWithLabel>
        <Texts>{t("GeneralReminders")}</Texts>
        <LocaleToggleSwitch
            data={updatedData.GeneralReminders}
            onChange={(value: boolean) => handleChange('GeneralReminders', value)}
        />
        </SwitchWithLabel>
    </Sections>

    <Sections size={"dynamic"}>
        <Titles>{t("Security")}</Titles>
        <SwitchWithLabel>
        <Texts>{t("Biometrics")}</Texts>
        <LocaleToggleSwitch
            data={updatedData.Biometric}
            onChange={(value: boolean) => handleChange('Biometric', value)}
        />
        </SwitchWithLabel>
        <SwitchWithLabel>
        <Texts>{t("CameraAccess")}</Texts>
        <LocaleToggleSwitch
            data={updatedData.cameraAccess}
            onChange={(value: boolean) => handleChange('cameraAccess', value)}
        />
        </SwitchWithLabel>
        <SwitchWithLabel>
        <Texts>{t("LocationAccess")}</Texts>
        <LocaleToggleSwitch
            data={updatedData.LocationAccess}
            onChange={(value: boolean) => handleChange('LocationAccess', value)}
        />
        </SwitchWithLabel>
    </Sections>

    <Buttons onClick={() => setIsModalOpen(true)} variant={'orange'} size={'default'}>
        <Titles>{t("ChangePassword")}</Titles>
    </Buttons>
    </Bases>

    <Modals
    isOpen={isModalOpen}
    handleClose={handleCancel}
    size="clock"
    >
    <Sections size={"dynamic"} className="p-4">
        <h2>{t("SaveChanges")}</h2>
        <Buttons onClick={handleSave} variant={'green'} size={'default'}>
        <Titles>{t("Yes")}</Titles>
        </Buttons>
        <Buttons onClick={handleCancel} variant={'red'} size={'default'}>
        <Titles>{t("Cancel")}</Titles>
        </Buttons>
    </Sections>
    </Modals>
</div>
);
}