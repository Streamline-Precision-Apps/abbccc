"use client";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Tab } from "@/components/(reusable)/tab";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  findUniqueUser,
  LeaveEngineerProject,
  updateDelay,
} from "@/actions/mechanicActions";
import ReceivedInfo from "./_components/receivedInfo";
import MyCommentFinishProject from "./_components/myComment";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import { user } from "@nextui-org/theme";

type maintenanceLogSchema = {
  id: string;
  userId: string;
};
export default function Project({ params }: { params: { id: string } }) {
  const router = useRouter();

  const session = useSession();
  const userId = session.data?.user.id;

  // ✅ Ensure hooks always run in the same order
  const [activeTab, setActiveTab] = useState(1);
  const [problemReceived, setProblemReceived] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [delayReasoning, setDelayReasoning] = useState("none");
  const [expectedArrival, setExpectedArrival] = useState("");
  const [titles, setTitles] = useState("");
  const [myComment, setMyComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [myMaintenanceLogs, setMyMaintenanceLogs] =
    useState<maintenanceLogSchema>();

  useEffect(() => {
    const fetchReceivedInfo = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/getReceivedInfo/${params.id}`);
        const data = await res.json();

        // ✅ Set project information
        setTitles(data.equipment.name);
        setProblemReceived(data.equipmentIssue);
        setAdditionalNotes(data.additionalInfo);
        setDelayReasoning(data.delayReasoning || "");
        setExpectedArrival(data.delay);

        // ✅ Find the log associated with the current logged-in user
        const userMaintenanceLog = data.maintenanceLogs.find(
          (log: any) => log.userId === userId && log.endTime === null
        );

        // ✅ Update state only if the log exists
        if (userMaintenanceLog) {
          setMyMaintenanceLogs({
            id: userMaintenanceLog.id,
            userId: userMaintenanceLog.userId,
          });
        }

        // ✅ Unique user count calculation
        const uniqueUserCount = new Set(
          data.maintenanceLogs.map((log: any) => log.userId)
        ).size;
        setActiveUsers(uniqueUserCount || 0);

        console.log(
          "Current User Log ID:",
          userMaintenanceLog?.id,
          "User ID:",
          userMaintenanceLog?.userId
        );
      } catch (e) {
        console.log("Error fetching received info:", e);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchReceivedInfo();
    }
  }, [params.id, userId]); // ✅ Added `userId` to dependency array

  const finishProject = async () => {
    try {
      await LeaveProject();
    } catch (e) {
      console.log(e);
    }
  };

  const LeaveProject = async () => {
    try {
      // verify if there are multiple users in the project
      const res = await fetch(`/api/getReceivedInfo/${params.id}`);
      const data = await res.json();
      const userForm = new FormData();

      session && userForm.append("userId", session.data?.user.id || "");
      userForm.append("maintenanceId", params.id);

      const uniqueUserCount = await findUniqueUser(userForm);

      if (!uniqueUserCount) {
        throw new Error("No maintenance log found for the current user");
      }

      const { id, userId } = myMaintenanceLogs as maintenanceLogSchema;

      // ✅ Save mechanic log before leaving
      const formData = new FormData();
      formData.append("comment", myComment);
      formData.append("maintenanceId", id);
      formData.append("userId", userId);
      formData.append("endTime", new Date().toISOString());

      const submitMechanicLog = await LeaveEngineerProject(formData);

      if (delayReasoning !== "") {
        const delay = new FormData();

        delay.append("maintenanceId", id);
        delay.append("delayReasoning", delayReasoning);
        delay.append("delay", expectedArrival);

        await updateDelay(formData);
      }

      if (submitMechanicLog) {
        router.push("/dashboard/mechanic");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Bases>
      <Contents>
        <Grids rows={"8"} gap={"5"}>
          <Holds background={"white"}>
            <TitleBoxes
              title={loading ? "" : titles}
              titleImg={""}
              titleImgAlt={""}
              type={"noIcon-NoHref"}
            />
          </Holds>
          <Holds className="h-full row-span-7">
            <Holds
              className={
                loading
                  ? "animate-pulse h-full row-span-7"
                  : "h-full row-span-7"
              }
            >
              <Grids rows={"10"} className="h-full">
                <Holds position={"row"} className="row-span-1 gap-2">
                  <Tab
                    onClick={() => setActiveTab(1)}
                    isActive={activeTab === 1}
                    size={"md"}
                  >
                    Received Info
                  </Tab>
                  <Tab
                    onClick={() => setActiveTab(2)}
                    isActive={activeTab === 2}
                    size={"md"}
                  >
                    My Comments
                  </Tab>
                </Holds>
                <Holds
                  background={"white"}
                  className={
                    loading
                      ? " rounded-t-none row-span-9 h-full py-2"
                      : "rounded-t-none row-span-9 h-full py-2"
                  }
                >
                  {activeTab === 1 && (
                    <>
                      <ReceivedInfo
                        loading={loading}
                        leaveProject={LeaveProject}
                        problemReceived={problemReceived}
                        additionalNotes={additionalNotes}
                        delayReasoning={delayReasoning}
                        expectedArrival={expectedArrival}
                        setDelayReasoning={setDelayReasoning}
                        setExpectedArrival={setExpectedArrival}
                      />
                    </>
                  )}
                  {activeTab === 2 && (
                    <MyCommentFinishProject
                      activeUsers={activeUsers}
                      myComment={myComment}
                      setMyComment={setMyComment}
                      loading={loading}
                    />
                  )}
                </Holds>
              </Grids>
            </Holds>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
