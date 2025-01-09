import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

type EditEmployeeHeaderProps = {
  userId: string | undefined;
  user: string;
  image: string;
  setIsProfilePic: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPersonalProfile: React.Dispatch<React.SetStateAction<boolean>>;
  userStatus: boolean;
  firstName: string;
  lastName: string;
};
export function EditEmployeeHeader({
  userId,
  user,
  image,
  setIsProfilePic,
  setIsPersonalProfile,
  userStatus,
  firstName,
  lastName,
}: EditEmployeeHeaderProps) {
  const t = useTranslations("Admins");
  return (
    <Holds
      background={"white"}
      className="w-full h-full col-span-2 row-span-2 flex flex-row justify-between items-center"
    >
      <Grids cols={"5"} rows={"1"} className="w-full h-full">
        <Holds
          position="left"
          className="col-start-1 col-end-2 h-full cursor-pointer"
          title={t("ChangeProfilePicture")}
          onClick={
            userId !== user
              ? () => setIsProfilePic(true)
              : () => setIsPersonalProfile(true)
          }
        >
          <Images
            titleImg={image || "/person.svg"}
            titleImgAlt="personnel"
            className="rounded-full my-auto p-4"
          />
        </Holds>
        <Holds className="col-start-2 col-end-5 ">
          {userId !== user ? (
            <Inputs
              type="text"
              value={`${firstName} ${lastName}`}
              readOnly={true}
              className="h-20 text-3xl font-bold px-5"
            />
          ) : (
            <Inputs
              type="text"
              value={`${t("YourProfile")}`}
              readOnly={true}
              className="h-20 text-3xl font-bold px-5"
            />
          )}
        </Holds>

        <Holds className="h-full p-3">
          <Texts
            position="right"
            size="p6"
            text={userStatus ? "green" : "red"}
            className="my-auto"
          >
            {userStatus ? null : `${t("Terminated")}`}
          </Texts>
        </Holds>
      </Grids>
    </Holds>
  );
}
