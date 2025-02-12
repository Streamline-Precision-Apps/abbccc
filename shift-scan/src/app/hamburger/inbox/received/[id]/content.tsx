"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Holds } from "@/components/(reusable)/holds";
import { TextAreas } from "@/components/(reusable)/textareas";
import { ReceivedContent } from "@/lib/types";
import { Session } from "next-auth";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ManagerLeaveRequest } from "@/actions/inboxSentActions";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDateYMD";
import { Grids } from "@/components/(reusable)/grids";
import { z } from "zod";
import Spinner from "@/components/(animations)/spinner";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Bases } from "@/components/(reusable)/bases";

const managerLeaveRequestSchema = z.object({
  id: z.string(),
  status: z.enum(["APPROVED", "DENIED", "PENDING"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  decidedBy: z.string(),
  managerComments: z.string().max(40, {
    message: "Manager comments must be at most 40 characters",
  }),
  signature: z.string().min(1, { message: "Signature is required" }),
});

type Props = {
  params: { id: string };
  session: Session | null;
};

export default function Content({ params }: Props) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [managerComment, setManagerComment] = useState<string>("");
  const [managerSignature, setManagerSignature] = useState<string>("");
  const [receivedContent, setReceivedContent] = useState<ReceivedContent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetch(`/api/getTimeoffRequests/?type=received`);
        const data = await result.json();
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

  const handleApproval = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!managerComment.trim()) return;
    const formData = new FormData(event.currentTarget);
    const formValues = {
      id: formData.get("id") as string,
      decision: formData.get("decision") as string,
      decidedBy: formData.get("decidedBy") as string,
      managerComments: managerComment,
      signature: managerSignature,
    };

    try {
      managerLeaveRequestSchema.parse(formValues);
      await ManagerLeaveRequest(formData);
      router.replace("/hamburger/inbox");
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!receivedContent.length) {
    return (
      <Bases>
        <Contents>
          <Grids rows={"10"} gap={"5"} className="my-5">
            <Holds background={"orange"} className="row-span-2">
              <TitleBoxes
                title="Leave Request"
                subtitle="No data available"
                header="No data available"
                titleImg="/Inbox.svg"
                titleImgAlt="Inbox"
                type="titleAndSubtitleAndHeader"
              />
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  }

  return (
    <Grids rows={"10"} gap={"5"} className="my-5">
      <Holds background={"orange"} className="row-span-2">
        <TitleBoxes
          title="Leave Request"
          subtitle={
            receivedContent[0] && receivedContent[0].employee
              ? `${receivedContent[0].employee.firstName} ${receivedContent[0].employee.lastName}`
              : "No employee data"
          }
          header={
            receivedContent[0]
              ? `Requested: ${new Date(receivedContent[0].createdAt).toLocaleDateString()}`
              : "No request date"
          }
          titleImg="/Inbox.svg"
          titleImgAlt="Inbox"
          type="titleAndSubtitleAndHeader"
        />
      </Holds>
      {receivedContent.map((item) => (
        <Holds background={"white"} className="row-span-9 h-full" key={item.id}>
          <Contents width={"section"}>
            <Labels>
              Requested Date Range
              <Inputs
                type="text"
                value={`${formatDate(item.requestedStartDate)} - ${formatDate(item.requestedEndDate)}`}
                disabled
              />
            </Labels>
            <Labels>
              Request Type
              <Inputs type="text" value={item.requestType} disabled />
            </Labels>
            <Labels>
              Employee Comment
              <TextAreas
                name="description"
                defaultValue={item.comment}
                disabled
                rows={2}
              />
            </Labels>
            <Labels>
              Manager Comment
              <TextAreas
                name="managerComments"
                value={managerComment}
                rows={2}
                onChange={handleManagerCommentChange}
                maxLength={40}
              />
            </Labels>
            <Forms onSubmit={handleApproval}>
              <Buttons
                background={managerComment ? "red" : "grey"}
                type="submit"
                disabled={!managerComment}
              >
                Deny
              </Buttons>
              <Buttons
                background={managerComment ? "green" : "grey"}
                type="submit"
                disabled={!managerComment}
              >
                Approve
              </Buttons>
            </Forms>
          </Contents>
        </Holds>
      ))}
    </Grids>
  );
}