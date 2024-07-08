import React from "react";
import {Input} from "@nextui-org/react";

const Form = () => {
    // const t = useTranslations('');
    return (
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input type="email" label="" defaultValue="Email"/>
            <Input type="email" label="" placeholder="Enter your email" />
        </div>
    );
}

export default Form