"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { useEffect, useState } from "react";
import { Filter } from "./_component/filter";
import { TimesheetView } from "./_component/timesheetView";
import Spinner from "@/components/(animations)/spinner";
import useFetchAllData from "@/app/(content)/FetchData";
import { useTranslations } from "next-intl";

export default function Timesheets({
  params,
}: {
  params: { employee: string };
}) {
  const t = useTranslations("Admins");
  const [user, setUser] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [loading, setLoading] = useState(true);
  useFetchAllData();

  useEffect(() => {
    const fetchUserName = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/employeeNameAndPhoto/${params.employee}`
        );

        const data = await response.json();
        setUser(data.firstName + " " + data.lastName);
        setProfilePic(data.image);
      } catch (error) {
        console.error(`${t("FailedToFetch")} ${t("EmployeeData")}`, error);
      }
      setLoading(false);
    };
    fetchUserName();
  }, [params.employee]);
  return (
    <Holds className="h-full w-full">
      {loading ? (
        <Holds className="bg-[#CACACA] rounded-[10px] h-full w-full justify-center items-center">
          <Titles size={"h1"}>{t("Loading")}</Titles>
          <Spinner />
        </Holds>
      ) : (
        <Grids rows={"10"} cols={"5"} gap={"3"} className="h-full w-full  p-4">
          {/*Title of time sheets */}
          <Holds className="col-span-2 row-start-1 row-end-3 h-full">
            <Holds position={"row"} className="h-full w-full">
              <Images
                titleImg={profilePic ? profilePic : "/person.svg"}
                titleImgAlt="Home Icon"
                className="rounded-full border-[3px] border-black"
                size={"40"}
                position={"left"}
              />

              <Titles className="ml-5" size={"h1"}>
                {user}
              </Titles>
            </Holds>
          </Holds>
          {/*Search of time sheets */}
          <Holds className="row-start-3 row-end-11 col-start-1 col-end-3  h-full ">
            <Filter params={params} />
          </Holds>
          {/*Result and display of time sheets */}
          <Holds className="row-start-1 row-end-11 col-start-3 col-end-6  h-full border-[3px] border-black rounded-[10px] p-4">
            <TimesheetView params={params} />
          </Holds>
        </Grids>
      )}
    </Holds>
  );
}
