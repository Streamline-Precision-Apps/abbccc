"use server";
import prisma from "@/lib/prisma";
import { Input } from "@nextui-org/react";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

export default async function EmployeeInfo() {

    const employee = await prisma.user.findUnique(
        {
            where: {
                id: "1"
            },
            include: {
                // users: true, // we want the saved user data here
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
        <div>
            <Sections size={"titleBox"}>
                <TitleBoxes
                title={employee?.firstName + " " + employee?.lastName}
                titleImg="/profile.svg"
                titleImgAlt="Profile Image"
                />
            </Sections>
            <Sections size={"dynamic"}>
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
            
            </Sections>
        </div>
    );
}

    