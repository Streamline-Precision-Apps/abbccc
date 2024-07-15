"use client";
    import { useRef } from "react";
import { button } from "@nextui-org/react";
    export const Form = ({ employeeId, onFormSubmit }: { employeeId: string, onFormSubmit: (date: string) => void }) => {
    const ref = useRef<HTMLFormElement>(null);
        const button = () => {
            ref.current?.requestSubmit();
        }
    return (
        <form
        ref={ref}
        onChange={button}
        onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(ref.current!);
            const date = formData.get('date') as string;
            onFormSubmit(date);
        }}
        >
        <input
            type="date"
            name="date"
            id="date"
            className="flex justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3"
        />
        <input type="hidden" name="id" value={employeeId} />
        </form>
    );
    };