"use server";

import Content from "@/app/(routes)/admin/assets/content";
import prisma from "@/lib/prisma";
import { Jobsites } from "@/lib/types";

export default async function Page() {

    return (
    <Content/>
    )
}