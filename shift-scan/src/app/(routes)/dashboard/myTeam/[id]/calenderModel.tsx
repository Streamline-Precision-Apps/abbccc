"use client"
import React,{ useEffect, useState } from 'react';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'; 

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Props {
    setDate: React.Dispatch<React.SetStateAction<Date>>

}

export default function Calendercomponent( {setDate}: Props) {
    const [value, onChange] = useState<Value>(new Date());

    useEffect(() => {
        setDate(value as Date);
        console.log(value);
    }, [value]);

    return (    
        <div className="bg-white h-full w-full flex justify-center items-center p-5 rounded-2xl">

            <Calendar 
            onChange={onChange}
            value={value}
            />
        </div>
    );
}