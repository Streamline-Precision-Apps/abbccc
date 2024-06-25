// this is a rest api endpoint
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const result = await prisma.user.update({
        where: {
            id : params.id
        },
        data: {
            ...req.body
        }
    })
    return Response.json({
        message: 'ok',
        status: 200,
        data: result
    })
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const result = await prisma.user.delete({
        where: {
            id : params.id
        }
    })
    return Response.json({
        message: 'ok',
        status: 204,
        data: result
    })
}