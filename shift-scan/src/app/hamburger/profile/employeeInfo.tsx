"use server";
import prisma from "@/lib/prisma";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import TitleBox from "@/components/titleBox";
import { TitleContainer } from "@/components/(text)/title_container";
import Image from "next/image";
import { Input } from "@nextui-org/react";
import DynamicSection from "@/components/dynamicSection";

export default async function EmployeeInfo() {

    const employee = await prisma.employee.findUnique(
        {
            where: {
                id: 1
            },
            include: {
                users: true, // we want the saved user data here
            }
        },
    );

    const contacts = await prisma.contact.findUnique(
        {
            where: {
                id: 1
            },
    })

    return (
        <div className=' h-auto w-full lg:w-1/2 m-auto border-t-2 border-l-2 border-r-2 p-5 border-black rounded-t-2xl'>
            <TitleBox
            title={employee?.first_name + " " + employee?.last_name}
            titleImg="/profile-icon.png"
            titleImgAlt="Profile Image"
            />
            <DynamicSection>
                <form action="" className=" p-5 mx-10 flex flex-col gap-5">
                    <div className='flex flex-col justify-center gap-1 items-center' >
                        <label htmlFor="">
                            EmployeeID
                        </label>
                        <Input
                            isDisabled
                            type="text"
                            defaultValue={employee?.id?.toString()}
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
                            defaultValue={contacts?.email?.toString()}
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
                            defaultValue={contacts?.phone_number}
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
        </div>
    );
}

    