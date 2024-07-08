
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import EmployeeInfo from "./employee-info";
import EmployeeHourInfo from "./employee-hour-info";
import EmployeeData from "./employeeData";

export default async function crewMember({params} : Params) {

    return (
        <>
        <EmployeeInfo params={params} />
        <EmployeeHourInfo params={params}/>
        </> 
    );
}