
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import EmployeeInfo from "./employee-info";
import {EmployeeTimeSheets} from "../[id]/employee-timesheet";

export default async function crewMember({ params }: { params: Params }) {

    return (
        <>
        <EmployeeInfo params={params} />
        <EmployeeTimeSheets employeeId={params.id}/>
        </> 
    );
}