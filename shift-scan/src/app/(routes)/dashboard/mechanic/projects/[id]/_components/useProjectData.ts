"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  findUniqueUser,
  LeaveEngineerProject,
  SubmitEngineerProject,
} from "@/actions/mechanicActions";
import { setMechanicProjectID } from "@/actions/cookieActions";

interface MaintenanceLog {
  id: string;
  userId: string;
  maintenanceId: string;
  startTime?: string;
  endTime?: string | null;
  comment?: string;
}

interface ProjectData {
  title: string;
  problemReceived: string;
  additionalNotes: string;
  hasBeenDelayed: boolean;
  maintenanceLogs: MaintenanceLog[];
}

interface ApiResponse {
  equipment: {
    name: string;
  };
  equipmentIssue: string;
  additionalInfo: string;
  hasBeenDelayed: boolean;
  maintenanceLogs: MaintenanceLog[];
}

export default function useProjectData(projectId: string) {
  const router = useRouter();
  const session = useSession();
  const userId = session.data?.user?.id;

  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [laborHours, setLaborHours] = useState<string>("0 hrs 0 min");
  const [activeUsers, setActiveUsers] = useState(0);
  const [myMaintenanceLogs, setMyMaintenanceLogs] =
    useState<MaintenanceLog | null>(null);
  const [myComment, setMyComment] = useState("");
  const [diagnosedProblem, setDiagnosedProblem] = useState("");
  const [solution, setSolution] = useState("");

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        const response = await fetch(`/api/getReceivedInfo/${projectId}`);
        const data: ApiResponse = await response.json();

        // Process and set project data
        const processedData: ProjectData = {
          title: data.equipment.name,
          problemReceived: data.equipmentIssue,
          additionalNotes: data.additionalInfo,
          hasBeenDelayed: data.hasBeenDelayed,
          maintenanceLogs: data.maintenanceLogs,
        };
        setProjectData(processedData);

        // Find and set user's maintenance log
        const userMaintenanceLog = data.maintenanceLogs.find(
          (log) => log.userId === userId && log.endTime === null
        );

        if (userMaintenanceLog) {
          setMyMaintenanceLogs(userMaintenanceLog);
          setMyComment(userMaintenanceLog.comment || "");
        }

        // Calculate total labor hours
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
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
        setLaborHours(`${hours} hrs ${minutes} min`);

        // Count active users
        const uniqueUserCount = data.maintenanceLogs.filter(
          (log) => log.userId && log.endTime === null
        ).length;
        setActiveUsers(uniqueUserCount || 0);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, userId]);

  const handleLeaveProject = async () => {
    if (!session.data || !myMaintenanceLogs) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("comment", myComment);
      formData.append("maintenanceId", myMaintenanceLogs.id);
      formData.append("userId", myMaintenanceLogs.userId);

      const submitMechanicLog = await LeaveEngineerProject(formData);
      await setMechanicProjectID("");

      if (submitMechanicLog) {
        router.push("/dashboard/mechanic");
      }
    } catch (error) {
      console.error("Error leaving project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishProject = async () => {
    if (!session.data || !myMaintenanceLogs) return;
    setLoading(true);

    try {
      // First leave the project (save comment)
      const leaveFormData = new FormData();
      leaveFormData.append("comment", myComment);
      leaveFormData.append("maintenanceId", myMaintenanceLogs.id);
      leaveFormData.append("userId", myMaintenanceLogs.userId);

      const clockOut = await LeaveEngineerProject(leaveFormData);

      if (clockOut) {
        // Then submit the project solution
        const submitFormData = new FormData();
        submitFormData.append("id", projectId);
        submitFormData.append("solution", solution);
        submitFormData.append("diagnosedProblem", diagnosedProblem);
        submitFormData.append("totalHoursLaboured", laborHours);

        const res = await SubmitEngineerProject(submitFormData);
        await setMechanicProjectID("");

        if (res) {
          router.push("/dashboard/mechanic");
        }
      }
    } catch (error) {
      console.error("Error finishing project:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    projectData,
    laborHours,
    activeUsers,
    myMaintenanceLogs,
    myComment,
    setMyComment,
    handleLeaveProject,
    handleFinishProject,
    diagnosedProblem,
    setDiagnosedProblem,
    solution,
    setSolution,
  };
}
