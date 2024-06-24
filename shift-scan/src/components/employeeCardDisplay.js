import React from "react";
import ManagerButtons from "@/components/UI/manager-buttons";
import EmployeeButtons from "@/components/UI/employee-buttons";

const CardDisplay = (Props) => {
    const {role} = Props; 
    if (role =='Manager'){
        return (
            <div>
                <ManagerButtons />
            </div>
        )

    }
    else {
        return (
            <div>
                <EmployeeButtons />
            </div>
        )
    }
}

export default function EmployeeCardDisplay(props) {
    return (
            <CardDisplay role={props.role} />
    );
}
