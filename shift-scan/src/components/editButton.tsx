"use client";
import React, { useState } from "react";

export default function EditButton () {
    const [edit, setEdit] = useState(false);

    const editHandler = () => {
        setEdit(!edit);
        console.log(edit);
        
    }

    const buttonClass = edit
    ? "bg-app-red text-4xl font-semibold text-white w-fit h-fit p-2 rounded-lg mb-10 border-2 border-black flex m-auto"
    : "bg-app-orange text-4xl font-semibold text-black w-fit h-fit p-2 rounded-lg mb-10 border-2 border-black flex m-auto";

    const word = edit ? "Cancel" : "Edit";

    return (
        <>
        <button 
        className={buttonClass}
        onClick={editHandler}
        >
            {word}
        </button>
        </>
    )
}