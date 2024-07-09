    "use client";
    import { useFormStatus } from "react-dom";

    export const Button = () => {
    const { pending } = useFormStatus();
    return (
        <button className="bg-app-blue w-full h-1/6 py-4 px-5 rounded-lg text-black font-bold mb-5" 
        type="submit"
        aria-disabled={pending}
        >
        {pending ? "Looking..." : "Search"}
        </button>
    );
    };