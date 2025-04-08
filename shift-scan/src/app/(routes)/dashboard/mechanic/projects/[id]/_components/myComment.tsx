import { setEngineerComment } from "@/actions/mechanicActions";
import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";
type MaintenanceLog = {
  id: string;
  userId: string;
  maintenanceId: string;
  startTime?: string;
  endTime?: string | null;
  comment?: string;
};

export default function CommentsTab({
  activeUsers,
  myComment,
  setMyComment,
  loading,
  onFinishProject,
  myMaintenanceLogs,
}: {
  activeUsers: number;
  myComment: string;
  setMyComment: (comment: string) => void;
  loading: boolean;
  onFinishProject: () => void;
  myMaintenanceLogs: MaintenanceLog | null;
}) {
  const t = useTranslations("MechanicWidget");
  if (loading)
    return (
      <Holds className="h-full py-2 justify-center items-center">
        <Spinner />
      </Holds>
    );

  const handleComment = async (comment: string) => {
    if (!myMaintenanceLogs) return;
    const { id } = myMaintenanceLogs;
    const res = await setEngineerComment(comment, id);
    if (res) {
      setMyComment(comment);
    }
  };

  return (
    <Holds background={"white"} className="h-full rounded-t-none py-2">
      <Contents width="section" className="h-full flex flex-col">
        <Grids rows="8" gap="5" className="h-full grid grid-rows-8">
          {/* Ensure TextArea Expands Fully */}
          <Holds className="row-start-1 row-end-8 h-full relative">
            <Labels size="p4" htmlFor="MyComments">
              {t("AdditionalNotes")}
            </Labels>
            <TextAreas
              name="MyComments"
              className="h-full w-full resize-none focus:outline-none"
              value={myComment}
              onChange={(e) => setMyComment(e.target.value)}
              onBlur={(e) => handleComment(e.target.value)}
              maxLength={40}
            />
            <Texts size="p2" className="absolute bottom-5 right-3">
              {`${myComment.length}/40`}
            </Texts>
          </Holds>
          {/* Ensure Button Stays at the Bottom */}
          <Holds className="row-start-8 row-end-9 h-full self-end">
            <Buttons
              background={activeUsers > 1 ? "lightGray" : "orange"}
              disabled={activeUsers > 1}
              onClick={() => {
                onFinishProject();
              }}
            >
              <Titles size="h2">{t("FinishProject")}</Titles>
            </Buttons>
          </Holds>
        </Grids>
      </Contents>
    </Holds>
  );
}
