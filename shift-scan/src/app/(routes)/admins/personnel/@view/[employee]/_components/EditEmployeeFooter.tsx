import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

export function EditEmployeeFooter({
  userId,
  user,
  userStatus,
  permission,
  handleSubmitClick,
  setIsOpen,
  setIsOpen2,
}: {
  userId: string | undefined;
  user: string;
  userStatus: boolean;
  permission: string | undefined;
  handleSubmitClick: (e: React.FormEvent) => Promise<void>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen2: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const t = useTranslations("Admins");
  return (
    <Holds background={"white"} className="w-full h-full col-span-2 p-3 ">
      <Grids cols={"6"} rows={"2"} className="w-full h-full ">
        <Holds className="col-start-6 col-end-7 row-start-1 row-end-3 ">
          <Buttons
            background="green"
            className="py-2"
            type="button"
            onClick={handleSubmitClick}
          >
            <Titles size="h5">{t("SubmitEdit")}</Titles>
          </Buttons>
        </Holds>
        {userId !== user || permission === "SUPERADMIN" ? (
          <Holds className="row-start-1 row-end-3 col-start-1 col-end-2 ">
            {userStatus === true ? (
              <Buttons
                background="red"
                className="py-2"
                onClick={() => setIsOpen(true)}
              >
                <Titles size="h5">{t("TerminateEmployee")}</Titles>
              </Buttons>
            ) : (
              <Buttons
                background="lightBlue"
                className="py-2"
                onClick={() => setIsOpen2(true)}
              >
                <Titles size="h5">{t("ActivateEmployee")}</Titles>
              </Buttons>
            )}
          </Holds>
        ) : null}
      </Grids>
    </Holds>
  );
}
