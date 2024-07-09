    "use client";
    import { useRef } from "react";
    import { Button } from "./button";

    export const Form = ({ employeeId, onFormSubmit }: { employeeId: string, onFormSubmit: (date: string) => void }) => {
    const ref = useRef<HTMLFormElement>(null);

    return (
        <form
        ref={ref}
        onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(ref.current!);
            const date = formData.get('date') as string;
            onFormSubmit(date);
            console.log(date);
            ref.current?.reset();
        }}
        >
        <input
            type="date"
            name="date"
            id="date"
            className="flex justify-center m-auto text-black text-2xl bg-white p-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3"
        />
        <input type="hidden" name="id" value={employeeId} />
        <Button />
        </form>
    );
    };