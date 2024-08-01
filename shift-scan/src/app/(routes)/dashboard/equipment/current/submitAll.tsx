"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Submit } from "@/actions/equipmentActions";

export default function SubmitAll({ userid }: { userid: string | undefined }) {
    return (
        <form action={Submit}>
            <Buttons type="submit" variant={"orange"} size={"default"}>Submit All</Buttons>
            <input type="hidden" name="id" value={userid} />
            <input type="hidden" name="submitted" value={"true"} />
        </form>
    );
}