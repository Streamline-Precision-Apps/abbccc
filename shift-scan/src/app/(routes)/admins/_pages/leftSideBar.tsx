"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { NModals } from "@/components/(reusable)/newmodals";
import PasswordModal from "./sidebar/PasswordModal";
import LanguageModal from "./sidebar/LanguageModal";
import SignOutModal from "./sidebar/SignOutModal";
import { useTranslations } from "next-intl";

const LeftSideBar = () => {
  const t = useTranslations("Admins");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [username, setUsername] = useState<string>("");
  const { data: session } = useSession();
  const userId = session?.user.id;
  const permission = session?.user.permission;
  const router = useRouter();

  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const [isOpenLanguageSelector, setIsOpenLanguageSelector] = useState(false);
  const [isOpenSignOut, setIsOpenSignOut] = useState(false);

  const isPersonnelPage = pathname.includes("/admins/personnel");
  const isAssetsPage = pathname.includes("/admins/assets");
  const isReportsPage = pathname.includes("/admins/reports");
  const inboxPage = pathname.includes("/admins/inbox");

  useEffect(() => {
    setUsername(`${session?.user.firstName} ${session?.user.lastName}`);
  }, [session?.user.firstName, session?.user.lastName]);
  return (
    <Holds className="bg-white h-full bg-opacity-20">
      <Grids rows={"10"} gap={"5"} className="w-full h-full">
        <Holds className="h-full">
          <Images
            titleImg="/clock.svg"
            titleImgAlt="Assets Icon"
            className="m-auto h-[40px]"
          />
        </Holds>
        <Holds className="row-start-8 h-full">
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={() => {
              setIsOpenChangePassword(true);
            }}
          >
            <Images
              titleImg="/key.svg"
              titleImgAlt="Assets Icon"
              className="m-auto h-[30px]"
            />
          </Buttons>
          <NModals
            size={"medH"}
            isOpen={isOpenChangePassword}
            handleClose={() => setIsOpenChangePassword(false)}
          >
            <PasswordModal
              setIsOpenChangePassword={() => setIsOpenChangePassword(false)}
            />
          </NModals>
        </Holds>
        <Holds className="row-start-9 h-full">
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={() => {
              setIsOpenLanguageSelector(true);
            }}
          >
            <Images
              titleImg="/language.svg"
              titleImgAlt="Assets Icon"
              className="m-auto h-[30px]"
            />
          </Buttons>
          <NModals
            size={"medM"}
            isOpen={isOpenLanguageSelector}
            handleClose={() => setIsOpenLanguageSelector(false)}
          >
            <LanguageModal
              setIsOpenLanguageSelector={() => setIsOpenLanguageSelector(false)}
            />
          </NModals>
        </Holds>
        <Holds className="row-start-10 h-full">
          <Buttons
            background={"none"}
            shadow={"none"}
            onClick={() => {
              setIsOpenSignOut(true);
            }}
          >
            <Images
              titleImg="/endDay.svg"
              titleImgAlt="Assets Icon"
              className="m-auto h-[30px]"
            />
          </Buttons>
          <NModals
            isOpen={isOpenSignOut}
            handleClose={() => setIsOpenSignOut(false)}
          >
            <SignOutModal setOpen={setIsOpenSignOut} open={isOpenSignOut} />
          </NModals>
        </Holds>
      </Grids>
    </Holds>
  );
};
export default LeftSideBar;
