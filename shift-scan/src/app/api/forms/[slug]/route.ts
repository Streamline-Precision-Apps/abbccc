// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET(req: Request, { params }: { params: { slug: string } }) {
//   try {
//     const formTemplate = await prisma.formTemplate.findUnique({
//       where: { slug: params.slug },
//       include: { fields: { orderBy: { order: "asc" } } }, // Load fields sorted by `order`
//     });

//     if (!formTemplate) {
//       return NextResponse.json({ error: "Form not found" }, { status: 404 });
//     }

//     return NextResponse.json(formTemplate);
//   } catch (error) {
//     return NextResponse.json({ error: "Error fetching form" }, { status: 500 });
//   }
// }
