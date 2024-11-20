"use client";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Holds } from "@/components/(reusable)/holds";
import { TextAreas } from "@/components/(reusable)/textareas";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { sentContent } from "@/lib/types";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/formatDateYMD";

type Props = {
  sentContent: sentContent[]; // Define the type of sentContent prop
  session: Session | null;
  params: { id: string };
};

export default function Content({ sentContent, session }: Props) {
  const [, setInitialContent] = useState<sentContent[]>(sentContent);

  useEffect(() => {
    setInitialContent(sentContent); // Store initial values
  }, [sentContent]);

  return (
    <>
      <Bases>
        <Contents>
          <Holds background={"red"}>
            <TitleBoxes
              variant={null}
              title="leave request"
              titleImg="/Inbox.svg"
              titleImgAlt="Inbox"
              type="noIcon"
            ></TitleBoxes>
            {sentContent.map((item) => (
              <>
                <Titles key={item.id}>
                  {item.date.toLocaleString("en-US", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour: undefined,
                    minute: undefined,
                    second: undefined,
                  })}
                </Titles>
              </>
            ))}
          </Holds>
          {sentContent.map((item) => (
            <>
              <Holds>
                <Labels>
                  Status
                  <Inputs type="text" defaultValue={item?.status} />
                </Labels>
              </Holds>

              <Holds key={item.id}>
                <Labels>
                  Employee
                  <Inputs
                    defaultValue={
                      session?.user?.firstName + " " + session?.user?.lastName
                    }
                    disabled
                  />
                </Labels>
                <Inputs type="hidden" name="id" value={item.id} disabled />
                <Inputs
                  type="hidden"
                  name="status"
                  value={item.status}
                  disabled
                />
                <Inputs
                  type="hidden"
                  name="date"
                  value={item.date.toString()}
                  disabled
                />
                <Inputs
                  type="hidden"
                  name="employeeId"
                  value={item.employeeId}
                  disabled
                />
                <Labels>
                  {" "}
                  Start Date
                  <Inputs
                    type="date"
                    name="startDate"
                    defaultValue={formatDate(item.requestedStartDate)}
                    disabled
                  />
                </Labels>

                <Labels>
                  {" "}
                  End Date
                  <Inputs
                    type="date"
                    name="endDate"
                    defaultValue={formatDate(item.requestedEndDate)}
                    disabled
                  />
                </Labels>
                <Labels>
                  {" "}
                  Request Type
                  <Inputs
                    type="text"
                    name="requestType"
                    defaultValue={item?.requestType}
                    disabled
                  />
                </Labels>

                <Labels>
                  {" "}
                  Comments
                  <TextAreas
                    name="description"
                    defaultValue={item.comment}
                    disabled
                    rows={5}
                  />
                </Labels>
              </Holds>
              <Holds>
                <Labels>
                  {" "}
                  Managers Comments
                  <TextAreas
                    name="mangerComments"
                    defaultValue={item.managerComment ?? ""}
                    disabled
                  />
                </Labels>
                <Labels>
                  Denied By
                  <Inputs
                    name="decidedBy"
                    defaultValue={item.decidedBy?.toString()}
                    disabled
                  />
                </Labels>
              </Holds>
            </>
          ))}
        </Contents>
      </Bases>
    </>
  );
}
