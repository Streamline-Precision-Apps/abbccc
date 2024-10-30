"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import Topbar from "./topbar";

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
  return (
    <Holds className={"w-[95%] h-full "}>
      <Topbar
        isOpen2={isOpen2}
        handleClockClick={handleClockClick}
        page={page}
        setPage={setPage}
      />

      <Holds className="h-full w-full mt-5">
        <Holds background={"lightBlue"} className="w-[95%] h-full">
          {/* Include the dashboard content here */}
          {page === 0 && <Texts>Home Dashboard</Texts>}

          {page === 1 && <Texts>Personnel Dashboard</Texts>}

          {page === 2 && <Texts>Assets Dashboard</Texts>}

          {page === 3 && <Texts>Report Dashboard</Texts>}
        </Holds>
      </Holds>
    </Holds>
  );
};

export default Dashboard;
