import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function ServerRender() {
    const session = await getServerSession(authOptions);
    return (
        <>
            <pre> {JSON.stringify(session)}</pre>
        </>
    )
}