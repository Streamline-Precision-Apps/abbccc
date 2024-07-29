"use client";

import { Sections } from "@/components/(reusable)/sections";
import { useState } from "react";

export default function Refueled() {
const [refueled, setRefueled] = useState(false);

const handleRefueledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRefueled(event.target.checked);
    };

return (
<div>
    <Sections size={"dynamic"}>
    <label>
        Did you refuel?
        <input name="refueled" type="checkbox" checked={refueled} onChange={handleRefueledChange} />
    </label>
    </Sections>
    <Sections size={"dynamic"}>
    {refueled ? (
        <label>
        Total gallons refueled
        <input type="number" name="refueling_gallons" />
        </label>
    ) : (
        <input type="hidden" name="refueling_gallons" value={0} />
    )}
    </Sections>
</div>
);
}