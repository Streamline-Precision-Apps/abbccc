"use server";
import { auth } from "@/auth";
import ClockProcessor from "@/components/(clock)/clockProcess";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/Holds";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function Clock() {
const session = await auth();
const userId = session?.user.id;
const lang = cookies().get("locale");
const locale = lang ? lang.value : "en"; // Default to English
return (
<Bases>
<Contents size={"default"} variant={"default"}>
<Holds size={"default"}>
<ClockProcessor
        type={"jobsite"}
        id={userId}
        scannerType={"jobsite"}
        locale={locale}
        returnpath="/"
        />
</Holds>
</Contents>
</Bases>
)
}
