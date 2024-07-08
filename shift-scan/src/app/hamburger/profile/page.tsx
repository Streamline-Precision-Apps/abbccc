"use client";
import React, {useState} from 'react';
import { useTranslations} from 'next-intl';
import DynamicSection from '@/components/dynamicSection';
import BasicButton from '@/components/button';
import TitleBox from '@/components/titleBox';
import {Input} from "@nextui-org/react";
import '@/app/globals.css';
import EmptyBase from '@/components/emptyBase';
import Form from '@/components/(inputs)/formEmpty';
import { Label } from 'recharts';
import Modal from '@/components/modal';


export default function Index() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('PortalLogin');
return (
    <div> 
        <EmptyBase>
            <TitleBox>John Doe</TitleBox>
            <DynamicSection>
                <form action="" className=" p-5 mx-10 flex flex-col gap-5">
                    <div className='flex flex-col justify-center gap-1 items-center' >
                        <label htmlFor="">
                            EmployeeID
                        </label>
                        <Input
                            isDisabled
                            type="text"
                            defaultValue="DurDevu"
                            className="border-2 border-black rounded-md"
                        />
                    </div>
                    <div className="flex flex-col justify-center gap-3 items-center">
                        <label htmlFor="">
                            Contact Email
                        </label>
                        <Input
                            isDisabled
                            type="email"
                            defaultValue="devuntheguy@yahoo.com"
                            className="border-2 border-black rounded-md"
                        />
                    </div>
                    <div className="flex flex-col justify-center gap-3 items-center">
                        <label htmlFor="">
                            Contact Phone #
                        </label>
                        <Input
                            isDisabled
                            type="phone"
                            defaultValue="232-543-8999"
                            className="border-2 border-black rounded-md"
                        />
                    </div>
                    <div className="flex flex-col justify-center gap-3 items-center">
                        <label htmlFor="">
                            Safety Training
                        </label>
                        <Input
                            isDisabled
                            type=""
                            defaultValue=""
                            className="border-2 border-black rounded-md"
                        />
                    </div>
                </form>
            
            </DynamicSection>
            <button onClick={() => setIsOpen(true)}>
                <BasicButton>Sign Out</BasicButton>
            </button>

            <Modal handleClose={() => setIsOpen(false)} isOpen={isOpen}>
                Are you sure you want to sign out of your account?
            </Modal>
        </EmptyBase>
    </div>
);
};