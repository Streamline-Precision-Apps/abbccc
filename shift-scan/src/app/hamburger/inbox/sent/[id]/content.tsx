"use client";

import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { sentContent } from "@/lib/types";
import { Session } from "next-auth";
import { FormEvent, useEffect, useState } from "react";
import {
  DeleteLeaveRequest,
  EditLeaveRequest,
} from "@/actions/inboxSentActions";
import { Images } from "@/components/(reusable)/images";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDateYMD";
import { Grids } from "@/components/(reusable)/grids";
import { z } from "zod";
import Spinner from "@/components/(animations)/spinner";

// Define Zod schema for form validation
const editLeaveRequestSchema = z.object({
  id: z.string().nonempty("Request ID is required"),
  startDate: z.string().nonempty("Start date is required"),
  endDate: z.string().nonempty("End date is required"),
  requestType: z.string().nonempty("Request type is required"),
  description: z.string().max(200, "Comments must be at most 200 characters"),
});

type Props = {
  session: Session | null;
};

export default function Content({ session }: Props) {
  const { id } = useParams();

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
        const response = await fetch(`/api/getTimeoffPendingRequests`);
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
          setSentContent([data[0]]); // Only keep the first item
        }
      } catch (err) {
        console.error("Error fetching sent content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSentContent();
  }, [id]);

  const handleEdit = () => {
    setEdit(!edit);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues = {
      id: formData.get("id") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      requestType: formData.get("requestType") as string,
      description: formData.get("description") as string,
    };

    // Validate using Zod
    try {
      editLeaveRequestSchema.parse(formValues);
      await EditLeaveRequest(formData);
      setEdit(false);
      router.push("/hamburger/inbox");
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors[0].message);
      } else {
        console.error("Failed to submit form:", error);
      }
    }
  };

  const handleDelete = async () => {
    const isDeleted = await DeleteLeaveRequest(id as string, userId);
    if (isDeleted) {
      router.push("/hamburger/inbox");
    }
  };

  if (loading) {
    return (
      <>
        <Holds background={"orange"}>
          <TitleBoxes
            title="Leave Request"
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
  }

  return (
    <Holds>
      <Grids className="grid-rows-10 gap-5">
        <Holds background={"orange"} className="row-span-2">
          <TitleBoxes
            title="Leave Request"
            titleImg="/Inbox.svg"
            titleImgAlt="Inbox"
            type="noIcon"
          />
          <Holds className="py-2">
            <Titles size={"h3"}>Created on {cardDate}</Titles>
          </Holds>
        </Holds>

        <Holds background={"white"} className="row-span-8">
          <Contents height={"page"} width={"section"}>
            <Forms onSubmit={handleSubmit}>
              <Inputs type="hidden" name="id" value={id} />
              <Holds className="my-3">
                {!edit ? (
                  <Holds size={"20"}>
                    <Buttons background={"orange"} onClick={handleEdit}>
                      <Holds className="py-2">
                        <Images
                          size={"50"}
                          titleImg="/edit-form.svg"
                          titleImgAlt="Edit form"
                        />
                      </Holds>
                    </Buttons>
                  </Holds>
                ) : (
                  <Holds position={"row"} className="justify-between px-5">
                    <Holds size={"20"}>
                      <Buttons background={"red"} onClick={handleEdit}>
                        <Holds className="py-2">
                          <Images
                            size={"50"}
                            titleImg="/undo-edit.svg"
                            titleImgAlt="Undo edit"
                          />
                        </Holds>
                      </Buttons>
                    </Holds>
                    <Holds size={"20"}>
                      <Buttons background={"green"} type="submit">
                        <Holds className="py-2">
                          <Images
                            size={"50"}
                            titleImg="/save-edit.svg"
                            titleImgAlt="Save edit"
                          />
                        </Holds>
                      </Buttons>
                    </Holds>
                  </Holds>
                )}
              </Holds>

              {sentContent.length > 0 && (
                <Holds key={sentContent[0].id}>
                  <Inputs
                    type="hidden"
                    name="id"
                    value={sentContent[0].id}
                    disabled
                  />
                  <Inputs
                    type="hidden"
                    name="status"
                    value={sentContent[0].status}
                    disabled
                  />
                  <Inputs
                    type="hidden"
                    name="date"
                    value={sentContent[0].date.toString()}
                    disabled
                  />
                  <Inputs type="hidden" name="userId" value={userId} disabled />

                  <Labels>
                    Start Date
                    <Inputs
                      type="date"
                      name="startDate"
                      defaultValue={formatDate(
                        sentContent[0].requestedStartDate
                      )}
                      disabled={!edit}
                    />
                  </Labels>

                  <Labels>
                    End Date
                    <Inputs
                      type="date"
                      name="endDate"
                      defaultValue={formatDate(sentContent[0].requestedEndDate)}
                      disabled={!edit}
                    />
                  </Labels>

                  <Labels>
                    Request Type
                    <Selects
                      name="requestType"
                      defaultValue={sentContent[0].requestType}
                      disabled={!edit}
                      key={sentContent[0].requestType}
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
                      defaultValue={sentContent[0].comment}
                      disabled={!edit}
                      rows={5}
                    />
                  </Labels>
                  {(sentContent[0].status === "APPROVED" ||
                    sentContent[0].status === "DENIED") && (
                    <Labels>
                      {`Manager's Comments`}
                      <TextAreas
                        name="managerComments"
                        defaultValue={sentContent[0].managerComment ?? ""}
                        disabled
                      />
                    </Labels>
                  )}
                </Holds>
              )}
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
