"use client";

import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { sentContent } from "@/lib/types";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import {
  FormEvent,
  startTransition,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DeleteLeaveRequest,
  EditLeaveRequest,
} from "@/actions/inboxSentActions";
import { Images } from "@/components/(reusable)/images";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { formatDate } from "@/utils/formatDateYMD";
import React from "react";
import Spinner from "@/components/(animations)/spinner";
import { Grids } from "@/components/(reusable)/grids";

type Props = {
  session: Session | null;
  params: { id: string };
};

export default function Content({ params, session }: Props) {
  const t = useTranslations("Hamburger");
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [cardDate, setCardDate] = useState<string>("");
  const [sentContent, setSentContent] = useState<sentContent[]>([]);
  const router = useRouter();
  const userId = session?.user.id;

  useEffect(() => {
    const fetchSentContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/getTimeoffRequests/${params.id}?type=sent`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch sent content");
        }
        const data = await response.json();
        if (data.length > 0) {
          setCardDate(
            `${new Date(data[0].date).getMonth() + 1}/${new Date(
              data[0].date
            ).getDate()}/${new Date(data[0].date).getFullYear()}`
          );
          setSentContent(data);
        }
      } catch (err) {
        console.error("Error fetching sent content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSentContent();
  }, [params.id]);

  const handleEdit = () => {
    setEdit(!edit);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await EditLeaveRequest(new FormData(event.currentTarget));
    setEdit(false);
    router.push("/hamburger/inbox");
  };

  const handleDelete = async () => {
    const isDeleted = await DeleteLeaveRequest(params.id, userId);
    if (isDeleted) {
      router.push("/hamburger/inbox");
    }
  };

  if (loading)
    return (
      <>
        <Holds background={"orange"}>
          <TitleBoxes
            title="leave request"
            titleImg="/Inbox.svg"
            titleImgAlt="Inbox"
            type="noIcon"
          />
          <Holds className="py-2">
            <Titles>Loading...</Titles>
          </Holds>
        </Holds>

        <Holds background={"white"} className="h-screen mt-5">
          <Contents height={"page"} width={"section"}>
            <Holds className="my-5">
              <Spinner />
            </Holds>
          </Contents>
        </Holds>
      </>
    );

  return (
    <Holds>
      <Grids className="grid-rows-10 gap-5">
        <Holds background={"orange"} className="row-span-2">
          <TitleBoxes
            title="leave request"
            titleImg="/Inbox.svg"
            titleImgAlt="Inbox"
            type="noIcon"
          />
          <Holds className="py-2">
            <Titles size={"h3"}> Created on {cardDate}</Titles>
          </Holds>
        </Holds>

        <Holds background={"white"} className="row-span-8">
          <Contents height={"page"} width={"section"}>
            <Forms onSubmit={handleSubmit}>
              <Inputs type="hidden" name="id" value={params.id} />
              <Holds className="my-3">
                {!edit && (
                  <Holds size={"20"}>
                    <Buttons background={"orange"} onClick={handleEdit}>
                      <Holds className="py-2">
                        <Images
                          size={"50"}
                          titleImg={"/edit-form.svg"}
                          titleImgAlt={"edit form"}
                        />
                      </Holds>
                    </Buttons>
                  </Holds>
                )}

                {edit && (
                  <Holds position={"row"} className="justify-between px-5">
                    <Holds size={"20"}>
                      <Buttons background={"red"} onClick={handleEdit}>
                        <Holds className="py-2">
                          <Images
                            size={"50"}
                            titleImg={"/undo-edit.svg"}
                            titleImgAlt={"undo edit"}
                          />
                        </Holds>
                      </Buttons>
                    </Holds>
                    <Holds size={"20"}>
                      <Buttons background={"green"} type="submit">
                        <Holds className="py-2">
                          <Images
                            size={"50"}
                            titleImg={"/save-edit.svg"}
                            titleImgAlt={"save edit"}
                          />
                        </Holds>
                      </Buttons>
                    </Holds>
                  </Holds>
                )}
              </Holds>

              {sentContent.map((item) => (
                <Holds key={item.id}>
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
                  <Inputs type="hidden" name="userId" value={userId} disabled />
                  <Labels>
                    Start Date
                    <Inputs
                      type="date"
                      name="startDate"
                      defaultValue={formatDate(item.requestedStartDate)}
                      disabled={!edit}
                    />
                  </Labels>

                  <Labels>
                    End Date
                    <Inputs
                      type="date"
                      name="endDate"
                      defaultValue={formatDate(item.requestedEndDate)}
                      disabled={!edit}
                    />
                  </Labels>
                  <Labels>
                    Request Type
                    <Selects
                      name="requestType"
                      defaultValue={item.requestType}
                      disabled={!edit}
                      key={item.requestType}
                    >
                      <option value="">Choose a request</option>
                      <option value="Vacation">Vacation</option>
                      <option value="Family/Medical Leave">
                        Family/Medical Leave
                      </option>
                      <option value="Military Leave">Military Leave</option>
                      <option value="Non Paid Personal Leave">
                        Non Paid Personal Leave
                      </option>
                      <option value="Sick Time">Sick Time</option>
                    </Selects>
                  </Labels>

                  <Labels>
                    Comments
                    <TextAreas
                      name="description"
                      defaultValue={item.comment}
                      disabled={!edit}
                      rows={5}
                    />
                  </Labels>
                  {(item.status === "APPROVED" || item.status === "DENIED") && (
                    <Labels>
                      Managers Comments
                      <TextAreas
                        name="managerComments"
                        defaultValue={item.managerComment ?? ""}
                        disabled
                      />
                    </Labels>
                  )}

                  <Texts size={"p2"}>Signature here</Texts>

                  <Texts size={"p5"}>
                    By Signing I acknowledge that time leave request is subject
                    to management approval & company policy.
                  </Texts>
                </Holds>
              ))}
            </Forms>
            {edit && (
              <Holds position={"row"} className="mt-5">
                <Buttons
                  onClick={handleDelete}
                  background={"red"}
                  className="p-2"
                >
                  <Titles size={"h3"}>Delete Request</Titles>
                </Buttons>
              </Holds>
            )}
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
