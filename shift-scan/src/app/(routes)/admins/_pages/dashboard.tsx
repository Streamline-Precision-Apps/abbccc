"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import Topbar from "./topbar";
import AdminHome from "./admin-home";

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
    <Holds className={"w-[95%] h-full"}>
      <Topbar
        isOpen2={isOpen2}
        handleClockClick={handleClockClick}
        page={page}
        setPage={setPage}
      />

      <Holds
        background={page === 0 ? null : "white"}
        className={page === 0 ? "h-full w-full" : "w-[98%] h-full white mt-5"}
      >
        {/* Include the dashboard content here */}
        {page === 0 && <AdminHome />}

        {page === 1 && <Texts>Personnel Dashboard</Texts>}

        {page === 2 && <Texts>Assets Dashboard</Texts>}

        {page === 3 && <Texts>Report Dashboard</Texts>}
      </Holds>
    </Holds>
  );
};

export default Dashboard;
