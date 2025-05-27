import EmployeeRow from "./EmployeeRow";
import { UserData, PersonnelView } from "./types/personnel";

interface EmployeeListProps {
  loading: boolean;
  filteredList: UserData[];
  view: PersonnelView;
  selectedUsers: {
    readonly id: string;
  }[];
  teamLead: string | null | undefined;
  handleEmployeeClick: (employee: UserData) => void;
  handleCrewLeadToggle: (employeeId: string) => void;
  handleEmployeeCheck: (employee: UserData) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  loading,
  filteredList,
  view,
  selectedUsers,
  teamLead,
  handleEmployeeClick,
  handleCrewLeadToggle,
  handleEmployeeCheck,
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="w-full h-full flex flex-col p-3 pb-5 space-y-10 overflow-y-auto scrollbar-thin"
      dir="rtl"
    >
      {filteredList.map((employee) => (
        <EmployeeRow
          key={employee.id}
          employee={employee}
          isSelected={
            (view.mode === "user" && view.userId === employee.id) ||
            (view.mode === "user+crew" && view.userId === employee.id) ||
            (view.mode === "registerCrew+user" && view.userId === employee.id)
          }
          isCrew={
            view.mode === "registerUser+crew" ||
            view.mode === "crew" ||
            view.mode === "user+crew" ||
            view.mode === "registerCrew" ||
            view.mode === "registerCrew+user" ||
            view.mode === "registerBoth"
          }
          isManager={employee.permission !== "USER"}
          isCrewMember={selectedUsers.some((u) => u.id === employee.id)}
          isCurrentLead={teamLead === employee.id}
          onEmployeeClick={handleEmployeeClick}
          onCrewLeadToggle={handleCrewLeadToggle}
          onEmployeeCheck={handleEmployeeCheck}
        />
      ))}
    </div>
  );
};

export default EmployeeList;
