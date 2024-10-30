"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import Topbar from "./topbar";

const Dashboard = ({
  isOpen,
  isOpen2,
  handleClockClick,
}: {
  isOpen: boolean;
  isOpen2: boolean;
  handleClockClick: () => void;
}) => {
  return (
    <Holds className={"w-[95%] h-full py-5"}>
      <Topbar
        isOpen={isOpen}
        isOpen2={isOpen2}
        handleClockClick={handleClockClick}
      />

      <Holds className="h-full w-full mt-5">
        <Holds background={"lightBlue"} className="w-[95%] h-full">
          {/* Include the dashboard content here */}
          <Texts>Dashboard</Texts>
        </Holds>
      </Holds>
    </Holds>
  );
};

export default Dashboard;
