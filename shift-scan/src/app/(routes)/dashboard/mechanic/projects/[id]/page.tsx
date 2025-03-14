"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  findUniqueUser,
  LeaveEngineerProject,
  SubmitEngineerProject,
  updateDelay,
} from "@/actions/mechanicActions";
import ReceivedInfo from "./_components/receivedInfo";
import MyCommentFinishProject from "./_components/myComment";
import { useSession } from "next-auth/react";
import { NModals } from "@/components/(reusable)/newmodals";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Inputs } from "@/components/(reusable)/inputs";
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { setMechanicProjectID } from "@/actions/cookieActions";
import { useTranslations } from "next-intl";
import { NewTab } from "@/components/(reusable)/newTabs";
import { set } from "date-fns";

// ✅ Define a full type for each maintenance log returned by the API
interface MaintenanceLog {
  id: string;
  userId: string;
  maintenanceId: string;
  startTime?: string;
  endTime?: string | null;
  comment?: string;
}

// ✅ Define the expected shape of the data from /api/getReceivedInfo/:id
interface ReceivedInfoData {
  equipment: {
    name: string;
  };
  equipmentIssue: string;
  additionalInfo: string;
  delayReasoning?: string;
  delay: string;
  hasBeenDelayed: boolean;
  maintenanceLogs: MaintenanceLog[];
}

// ✅ Define a type for the minimal maintenance log used in state
type MaintenanceLogSchema = Pick<
  MaintenanceLog,
  "id" | "userId" | "maintenanceId" | "comment"
>;

export default function Project({ params }: { params: { id: string } }) {
  const t = useTranslations("MechanicWidget");
  const router = useRouter();
  const session = useSession();
  const userId = session.data?.user?.id;
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
    useState<MaintenanceLogSchema | null>(null);
  const [hasBeenDelayed, setHasBeenDelayed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [diagnosedProblem, setDiagnosedProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [totalLaborHours, setTotalLaborHours] = useState<number>(0);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/getReceivedInfo/${params.id}`)
      .then((res) => res.json())
      .then((data: ReceivedInfoData) => {
        setTitles(data.equipment.name);
        setProblemReceived(data.equipmentIssue);
        setAdditionalNotes(data.additionalInfo);
        setDelayReasoning(data.delayReasoning || "");
        setExpectedArrival(data.delay);
        setHasBeenDelayed(data.hasBeenDelayed);

        const userMaintenanceLog = data.maintenanceLogs.find(
          (log) => log.userId === userId && log.endTime === null
        );

        if (userMaintenanceLog) {
          setMyMaintenanceLogs({
            id: userMaintenanceLog.id,
            userId: userMaintenanceLog.userId,
            maintenanceId: userMaintenanceLog.maintenanceId,
          });
          setMyComment(userMaintenanceLog.comment || "");
        }

        // Calculate and set total labor hours
        const totalMilliseconds = data.maintenanceLogs
          .filter((log) => log.startTime)
          .reduce((sum, log) => {
            const start = new Date(log.startTime!).getTime();
            const end = log.endTime
              ? new Date(log.endTime).getTime()
              : new Date().getTime();
            return sum + (end - start);
          }, 0);

        const totalHours = parseFloat(
          (totalMilliseconds / 1000 / 60 / 60).toFixed(2)
        );
        setTotalLaborHours(totalHours);

        const uniqueUserCount = data.maintenanceLogs.filter(
          (log) => log.userId && log.endTime === null
        ).length; // ✅ Only keep logs where endTime is null

        console.log(
          "Unique user count:",
          uniqueUserCount,
          data.maintenanceLogs.map((log) => log.endTime === null) // Debugging output
        );

        // ✅ Set the updated count
        setActiveUsers(uniqueUserCount || 0);
      })
      .catch((error) => {
        console.log(t("ErrorReceivedInfo"), error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id, userId, activeUsers]);

  const openFinishProject = () => {
    setModalOpen(true);
  };

  const finishProject = async () => {
    try {
      if (!session.data) {
        return;
      }
      const userForm = new FormData();

      userForm.append("userId", session.data.user?.id || "");
      userForm.append("maintenanceId", params.id);
      const uniqueUserCount = await findUniqueUser(userForm);

      if (!uniqueUserCount) {
        return;
      }

      const formData = new FormData();
      formData.append("comment", myComment);
      formData.append("maintenanceId", uniqueUserCount?.id || "");
      formData.append("userId", session.data.user?.id || "");

      const clock = await LeaveEngineerProject(formData);
      if (clock) {
        const submitProject = new FormData();
        submitProject.append("id", params.id);
        submitProject.append("solution", solution);
        submitProject.append("diagnosedProblem", diagnosedProblem);
        submitProject.append("totalHoursLaboured", totalLaborHours?.toString());
        const res = await SubmitEngineerProject(submitProject);
        await setMechanicProjectID("");
        if (res) {
          router.push("/dashboard/mechanic");
        }
      }
    } catch (error) {}
  };

  const LeaveProject = async () => {
    try {
      const userForm = new FormData();
      if (session.data) {
        userForm.append("userId", session.data.user?.id || "");
      }
      userForm.append("maintenanceId", params.id);

      const uniqueUserCount = await findUniqueUser(userForm);

      if (!uniqueUserCount) {
        throw new Error(t("NoMaintenanceLogFoundForCurrentUser"));
      }

      // We are sure myMaintenanceLogs is not null here.
      const { id, userId } = myMaintenanceLogs as MaintenanceLogSchema;

      // ✅ Save mechanic log before leaving
      const formData = new FormData();
      formData.append("comment", myComment);
      formData.append("maintenanceId", id);
      formData.append("userId", userId);

      const submitMechanicLog = await LeaveEngineerProject(formData);

      if (delayReasoning !== "") {
        const delayForm = new FormData();
        delayForm.append("maintenanceId", id);
        delayForm.append("delayReasoning", delayReasoning);
        delayForm.append("delay", expectedArrival);

        await updateDelay(delayForm);
      }
      await setMechanicProjectID("");
      if (submitMechanicLog) {
        router.push("/dashboard/mechanic");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Format total labor hours for display
  const hours = Math.floor(totalLaborHours);
  const minutes = Math.round((totalLaborHours - hours) * 60);
  const formattedLaborTime = `${hours} hrs ${minutes} min`;

  return (
    <Bases>
      <Contents>
        <Grids rows="7" gap={"5"} className="h-full">
          <Holds background="white" className="row-span-1 h-full ">
            <TitleBoxes
              title={loading ? "" : titles}
              titleImg=""
              titleImgAlt=""
              onClick={() => router.push("/dashboard")}
              type="noIcon-NoHref"
            />
          </Holds>
          <Holds className="h-full row-span-6 ">
            <Holds
              className={
                loading
                  ? "animate-pulse h-full row-span-7"
                  : "h-full row-span-7"
              }
            >
              <Grids rows="10" className="">
                <Holds position="row" className="row-span-1 gap-1">
                  <NewTab
                    onClick={() => setActiveTab(1)}
                    isActive={activeTab === 1}
                    titleImage="/information.svg"
                    titleImageAlt={""}
                    isComplete={true}
                  >
                    {t("ReceivedInfo")}
                  </NewTab>
                  <NewTab
                    onClick={() => setActiveTab(2)}
                    isActive={activeTab === 2}
                    titleImage="/comment.svg"
                    titleImageAlt={""}
                    isComplete={true}
                  >
                    {t("MyComments")}
                  </NewTab>
                </Holds>
                <Holds
                  background="white"
                  className="rounded-t-none row-span-9 h-full py-2"
                >
                  {activeTab === 1 && (
                    <ReceivedInfo
                      loading={loading}
                      leaveProject={LeaveProject}
                      problemReceived={problemReceived}
                      additionalNotes={additionalNotes}
                      delayReasoning={delayReasoning}
                      expectedArrival={expectedArrival}
                      setDelayReasoning={setDelayReasoning}
                      setExpectedArrival={setExpectedArrival}
                      myComment={myComment}
                      hasBeenDelayed={hasBeenDelayed}
                    />
                  )}
                  {activeTab === 2 && (
                    <MyCommentFinishProject
                      activeUsers={activeUsers}
                      myComment={myComment}
                      setMyComment={setMyComment}
                      loading={loading}
                      openFinishProject={openFinishProject}
                      id={params.id}
                      myMaintenanceLogs={myMaintenanceLogs}
                    />
                  )}
                </Holds>
              </Grids>
            </Holds>
          </Holds>
          <NModals
            isOpen={modalOpen}
            handleClose={() => setModalOpen(false)}
            size="screen"
            background="takeABreak"
          >
            <Holds background="white" className="w-full h-full py-2">
              <Grids rows="8" gap="5">
                {/* Modal Header */}
                <Holds className="row-span-1 h-full justify-center">
                  <TitleBoxes
                    title={titles.slice(0, 20) + "..."}
                    titleImg="/mechanic.svg"
                    titleImgAlt={t("Mechanic")}
                    onClick={() => setModalOpen(false)}
                    type="noIcon-NoHref"
                  />
                </Holds>
                <Holds className="row-start-2 row-end-8 h-full">
                  <Contents width="section">
                    <Holds className="py-1">
                      <Labels size="p3">{t("DiagnosedProblem")}</Labels>
                      <TextAreas
                        value={diagnosedProblem}
                        onChange={(e) => setDiagnosedProblem(e.target.value)}
                        rows={3}
                      />
                    </Holds>
                    <Holds className="py-1 relative">
                      <Labels size="p3">{t("Solution")}</Labels>
                      <TextAreas
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        rows={3}
                        maxLength={40}
                      />
                      <Texts
                        size="p4"
                        className={`absolute bottom-5 right-3 ${
                          solution.length >= 40 ? "text-red-500" : ""
                        }`}
                      >
                        {`${solution.length}/40`}
                      </Texts>
                    </Holds>
                    <Holds className="py-1">
                      <Labels size="p3">{t("TotalLaborHours")}</Labels>
                      <Inputs
                        type="text"
                        placeholder={t("TotalLaborHoursPlaceholder")}
                        value={formattedLaborTime}
                        disabled
                        className="py-2"
                      />
                    </Holds>
                  </Contents>
                </Holds>
                <Holds className="row-start-8 row-end-9">
                  <Contents width="section">
                    <Buttons
                      onClick={() => finishProject()}
                      background="green"
                      className="py-3"
                    >
                      <Titles>{t("SubmitProject")}</Titles>
                    </Buttons>
                  </Contents>
                </Holds>
              </Grids>
            </Holds>
          </NModals>
        </Grids>
      </Contents>
    </Bases>
  );
}
