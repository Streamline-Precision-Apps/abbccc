// this is a rest api endpoint
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    // include in finally
    // if (!session ) {
    //     return NextResponse.json({
    //         message: 'Not authenticated'
    //     })
    // }

    const id = params.id
    const result = await prisma.user.findUnique({
        where: {
            id : id
        }
    })
    return NextResponse.json(result)
}



// I am replacing the entire reqsource with this, anything unchanged
// will be replaced with null...
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const id = params.id
    const body = await req.json()

    const updated = await prisma.user.update({
        where: {
            id : id
        },
        data: {
            ...body,
            firstName : body.firstName || null,
            lastName : body.lastName || null,
            username : body.username || null,
            password : body.password || null,
            truck_view : body.truck_view || null,
            tasco_view : body.tasco_view || null,
            labor_view : body.labor_view || null,
            mechanic_view : body.mechanic_view || null,
            permission : body.permission || null,
            email : body.email || null,
            emailVerified : body.emailVerified || null,
            phone : body.phone || null,
            image : body.image || null,
            
        }
    })
    return NextResponse.json(updated)
}



//patch is we fix a little bit here
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const id = params.id
    const body = await req.json()

    const updated = await prisma.user.update({
        where: {
            id : id
        },
        data: {
            ...body,            
        }
    })
    return NextResponse.json(updated)

}




export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const id = params.id
    const deleted = await prisma.user.delete({
        where: {
            id : id
        }
    })
    return NextResponse.json(deleted)
}