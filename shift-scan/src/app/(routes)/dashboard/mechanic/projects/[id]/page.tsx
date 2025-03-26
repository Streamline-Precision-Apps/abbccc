"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import useProjectData from "./_components/useProjectData";
import ProjectLayout from "./_components/ProjectLayout";
import ProjectTabs from "./_components/ProjectTabs";
import ReceivedInfoTab from "./_components/receivedInfo";
import CommentsTab from "./_components/myComment";
import FinishProjectModal from "./_components/FinishProjectModal";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const t = useTranslations("MechanicWidget");
  const [activeTab, setActiveTab] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    loading,
    projectData,
    laborHours,
    activeUsers,
    myMaintenanceLogs,
    myComment,
    setMyComment,
    handleLeaveProject,
    handleFinishProject,
    setSolution,
    solution,
    diagnosedProblem,
    setDiagnosedProblem,
  } = useProjectData(params.id);

  return (
    <ProjectLayout title={projectData?.title || ""}>
      <ProjectTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loading={loading}
        t={t}
      />

      {activeTab === 1 && (
        <ReceivedInfoTab
          loading={loading}
          problemReceived={projectData?.problemReceived || ""}
          additionalNotes={projectData?.additionalNotes || ""}
          myComment={myComment}
          hasBeenDelayed={projectData?.hasBeenDelayed || false}
          onLeaveProject={handleLeaveProject}
        />
      )}

      {activeTab === 2 && (
        <CommentsTab
          activeUsers={activeUsers}
          myComment={myComment}
          setMyComment={setMyComment}
          loading={loading}
          onFinishProject={() => setModalOpen(true)}
          myMaintenanceLogs={myMaintenanceLogs}
        />
      )}

      <FinishProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={projectData?.title || ""}
        laborHours={laborHours}
        onSubmit={handleFinishProject}
        solution={solution}
        diagnosedProblem={diagnosedProblem}
        setDiagnosedProblem={setDiagnosedProblem}
        setSolution={setSolution}
      />
    </ProjectLayout>
  );
}
