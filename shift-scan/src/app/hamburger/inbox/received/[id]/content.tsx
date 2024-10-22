"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Holds } from "@/components/(reusable)/holds";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { receivedContent } from "@/lib/types";
import { Session } from "next-auth";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ManagerLeaveRequest } from "@/actions/inboxSentActions";
import { Images } from "@/components/(reusable)/images";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDateYMD";
import { Grids } from "@/components/(reusable)/grids";
import { z } from "zod";
import Spinner from "@/components/(animations)/spinner";

// Define Zod schema for validation
const managerLeaveRequestSchema = z.object({
  id: z.string().nonempty({ message: "Request ID is required" }),
  decision: z.enum(["APPROVED", "DENIED"], {
    errorMap: () => ({ message: "Invalid decision" }),
  }),
  decidedBy: z.string().nonempty({ message: "Manager ID is required" }),
  managerComments: z.string().max(40, {
    message: "Manager comments must be at most 40 characters",
  }),
  signature: z.string().nonempty({ message: "Manager signature is required" }),
});

type Props = {
  params: { id: string };
  session: Session | null;
};

export default function Content({ params }: Props) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [decision, setDecision] = useState<string | null>(null);
  const [cardDate, setCardDate] = useState<string>("");
  const [manager, setManager] = useState<string>("");
  const [managerComment, setManagerComment] = useState<string>("");
  const [employeeName, setEmployeeName] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [managerSignature, setManagerSignature] = useState<string>("");
  const [signed, setSigned] = useState(false);
  const [receivedContent, setReceivedContent] = useState<receivedContent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetch(`/api/getTimeoffRequests/?type=received`);
        const data = await result.json();

        setCardDate(
          `${new Date(data[0].date).getMonth() + 1}/${new Date(
            data[0].date
          ).getDate()}/${new Date(data[0].date).getFullYear()}`
        );

        const employee = data[0].employee;
        setEmployeeName(employee?.firstName + " " + employee?.lastName || "");
        setSignature(employee?.signature || "");
        setManager(data[0]?.manager || "");
        setManagerComment(data[0]?.managerComment || "");
        setReceivedContent(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  useEffect(() => {
    const fetchSignatureData = async () => {
      try {
        const result = await fetch(`/api/getUserSignature`);
        const data = await result.json();
        setManagerSignature(data.signature);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSignatureData();
  }, [params.id]);

  const handleManagerCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setManagerComment(e.target.value);
  };

  useEffect(() => {
    if (decision !== null) {
      setDecision(null);
      router.push("/hamburger/inbox");
    }
  }, [router, decision]);

  const handleApproval = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues = {
      id: formData.get("id") as string,
      decision: formData.get("decision") as string,
      decidedBy: formData.get("decidedBy") as string,
      managerComments: managerComment,
      signature: managerSignature,
    };

    // Validate using Zod
    try {
      managerLeaveRequestSchema.parse(formValues);
      await ManagerLeaveRequest(formData);
      router.replace("/hamburger/inbox");
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors[0].message);
      } else {
        console.error("Failed to submit form:", error);
      }
    }
  };

  if (loading) {
    return (
      <Grids className="grid-rows-10 gap-5 my-5">
        <Holds background={"orange"} className="row-span-1 h-full">
          <TitleBoxes
            title="Leave Request"
            titleImg="/Inbox.svg"
            titleImgAlt="Inbox"
            type="noIcon"
          />
          <Titles size={"h3"}>Loading date...</Titles>
        </Holds>
        <Holds background={"white"} className="row-span-9 h-full">
          <Holds size={"full"} className="mt-5">
            <Spinner />
          </Holds>
        </Holds>
      </Grids>
    );
  }

  return (
    <Grids rows={"10"} gap={"5"} className="my-5">
      <Holds background={"orange"} className="row-span-1 h-full">
        <TitleBoxes
          title="Leave Request"
          titleImg="/Inbox.svg"
          titleImgAlt="Inbox"
          type="noIcon"
        />
        <Titles size={"h3"}>{cardDate}</Titles>
      </Holds>

      {receivedContent.map((item) => (
        <Holds background={"white"} className="row-span-9 h-full" key={item.id}>
          <Contents width={"section"}>
            <Grids className="grid-rows-1 py-5">
              <Inputs type="hidden" name="date" value={item.date.toString()} />
              <Inputs type="hidden" name="employeeId" value={item.employeeId} />

              <Holds className="row-span-1">
                <Labels>
                  Employee
                  <Inputs type="text" defaultValue={employeeName} disabled />
                </Labels>
              </Holds>

              <Holds className="row-span-1">
                <Labels>
                  Start Date
                  <Inputs
                    type="date"
                    name="startDate"
                    defaultValue={formatDate(item.requestedStartDate)}
                    disabled
                  />
                </Labels>
              </Holds>

              <Holds className="row-span-1">
                <Labels>
                  End Date
                  <Inputs
                    type="date"
                    name="endDate"
                    defaultValue={formatDate(item.requestedEndDate)}
                    disabled
                  />
                </Labels>
              </Holds>

              <Holds className="row-span-1">
                <Labels>
                  Request Type
                  <Inputs
                    type="text"
                    name="requestType"
                    defaultValue={item?.requestType}
                    disabled
                  />
                </Labels>
              </Holds>

              <Holds className="row-span-1">
                <Labels>
                  Comments
                  <TextAreas
                    name="description"
                    defaultValue={item.comment}
                    disabled
                    rows={2}
                  />
                </Labels>
              </Holds>

              <Holds className="row-span-1">
                <Labels>
                  Manager Comments
                  <TextAreas
                    name="managerComments"
                    value={managerComment}
                    rows={2}
                    onChange={handleManagerCommentChange}
                    maxLength={40}
                  />
                </Labels>
              </Holds>

              <Holds className="row-span-1 pb-5">
                <Texts position={"left"} size={"p5"}>
                  Employee signature
                </Texts>
                <Holds className="border-2 border-black rounded-xl">
                  {signature ? (
                    <Holds size={"20"} position={"center"}>
                      <img src={signature} alt="Employee signature" />
                    </Holds>
                  ) : (
                    <Holds position={"center"} className="py-2">
                      <Texts size={"p5"}>Signature is not set up</Texts>
                    </Holds>
                  )}
                </Holds>
              </Holds>

              <Holds position={"row"} className="row-span-1">
                <Forms onSubmit={handleApproval}>
                  <Inputs type="hidden" name="id" value={item.id} />
                  <Inputs type="hidden" name="decidedBy" value={manager} />

                  <Buttons
                    background={"red"}
                    type="submit"
                    onClick={() => setDecision("DENIED")}
                    size={"80"}
                  >
                    <Holds position={"row"}>
                      <Titles>Deny</Titles>
                      <Images
                        titleImg="/undo-edit.svg"
                        titleImgAlt="Deny request"
                      />
                    </Holds>
                  </Buttons>

                  <Buttons
                    background={"green"}
                    type="submit"
                    onClick={() => setDecision("APPROVED")}
                    size={"80"}
                  >
                    <Holds position={"row"}>
                      <Titles>Approve</Titles>
                      <Images
                        titleImg="/save-edit.svg"
                        titleImgAlt="Approve request"
                      />
                    </Holds>
                  </Buttons>
                </Forms>
              </Holds>
            </Grids>
          </Contents>
        </Holds>
      ))}
    </Grids>
  );
}
