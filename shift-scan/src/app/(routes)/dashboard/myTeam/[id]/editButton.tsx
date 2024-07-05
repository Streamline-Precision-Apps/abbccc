"use client";
import React, { useState } from "react";

export default function EditButton () {
    const [edit, setEdit] = useState(false);

    const editHandler = () => {
        setEdit(!edit);
        console.log(edit);
        
    }

    return (
        <>
        <button 
        className="bg-app-orange text-4xl font-semibold text-black w-fit h-fit p-2 rounded-lg mb-10 border-2 border-black flex m-auto "
        onClick={editHandler}
        >
            Edit
        </button>
        </>
    )
}