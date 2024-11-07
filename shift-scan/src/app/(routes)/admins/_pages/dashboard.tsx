"use client";
import { Holds } from "@/components/(reusable)/holds";
import Topbar from "./topbar";
import AdminHome from "./admin-home";
import { Modals } from "@/components/(reusable)/modals";
import { useState } from "react";
import AdminClock from "./AdminClock";
import AdminSwitch from "./AdminSwitch";
import AddEmployeeContent from "../../admin/employees/content";
import Content from "@/app/(routes)/admin/assets/content";
import Reports from "../../admin/reports/page.tsx";
import { AdminClockOut } from "./AdminClockOut";
import { AdminSettings } from "./AdminSettings";

const Dashboard = ({
  isOpen2,
  handleClockClick,
  page,
  setPage,
}: {
  isOpen2: boolean;
  handleClockClick: () => void;
  page: number;
  setPage: (page: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitch, setIsSwitch] = useState(false);
  const [isEndofDay, setIsEndofDay] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <Holds className={"w-[95%] h-full"}>
      <Topbar
        isOpen2={isOpen2}
        handleClockClick={handleClockClick}
        page={page}
        setPage={setPage}
        setIsOpen={setIsOpen}
        setIsSwitch={setIsSwitch}
        setIsEndofDay={setIsEndofDay}
      />

      <Holds
        background={page === 0 || page === 4 ? null : "white"}
        className={page === 0 ? "h-full w-full" : "w-[98%] h-full white mt-5"}
      >
        {/* Include the dashboard content here */}
        {page === 0 && <AdminHome />}

        {page === 1 && <AddEmployeeContent />}

        {page === 2 && <Content />}

        {page === 3 && <Reports />}

        {page === 4 && <AdminSettings />}
      </Holds>

      {/* Include the modals here */}

      {/* Start day modal */}
      <Modals
        isOpen={isOpen}
        handleClose={handleClose}
        type={"StartDay"}
        size={"lg"}
      >
        <AdminClock handleClose={() => setIsOpen(false)} />
      </Modals>

      {/* Switch modal */}
      <Modals
        isOpen={isSwitch}
        handleClose={() => setIsSwitch(false)}
        type={"StartDay"}
        size={"lg"}
      >
        <AdminSwitch handleClose={() => setIsSwitch(false)} />
      </Modals>

      {/* End of day modal */}
      <Modals
        isOpen={isEndofDay}
        handleClose={() => setIsEndofDay(false)}
        type={"StartDay"}
        size={"lg"}
      >
        <AdminClockOut handleClose={() => setIsEndofDay(false)} />
      </Modals>
    </Holds>
  );
};

export default Dashboard;
