"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Holds } from "@/components/(reusable)/holds";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Session } from "next-auth";
import { FormEvent, use, useEffect, useState } from "react";
import { ManagerLeaveRequest } from "@/actions/inboxSentActions";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDateYMD";
import { Grids } from "@/components/(reusable)/grids";
import { z } from "zod";
import Spinner from "@/components/(animations)/spinner";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Bases } from "@/components/(reusable)/bases";
import TextInputWithRevert from "@/components/(reusable)/textInputWithRevert";
import { useSession } from "next-auth/react";

const managerLeaveRequestSchema = z.object({
  id: z.string().min(1, { message: "Needs ID" }),
  status: z.enum(["APPROVED", "DENIED", "PENDING"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  createdAt: z.string().min(1, { message: "Needs date of request" }),
  employee: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  name: z.string().optional(),
  requestedStartDate: z.string().min(1, { message: "Needs start date" }),
  requestedEndDate: z.string().min(1, { message: "Needs end date" }),
  requestType: z.enum([
    "FAMILY_MEDICAL",
    "MILITARY",
    "PAID_VACATION",
    "NON_PAID_PERSONAL",
    "SICK",
  ]),
  comment: z
    .string()
    .min(4, { message: "Description is required" })
    .max(40, { message: "Max 40 characters" }),
  decidedBy: z.string(),
  managerComment: z.string().max(40, {
    message: "Manager comments must be at most 40 characters",
  }),
  signature: z.string().nullable(),
});

type leaveRequest = z.infer<typeof managerLeaveRequestSchema>;

const formSubmitSchema = z.object({
  id: z.string().min(1, { message: "ID is required" }),
  decidedBy: z.string().min(1, { message: "Decided by is required" }),
  managerComment: z
    .string()
    .min(4, { message: "Description is required" })
    .max(40, { message: "Max 40 characters" }),
  signature: z.string().nullable(),
});

type Props = {
  params: { id: string };
  session: Session | null;
};

export default function Content({ params }: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();
  // const [attachedSignature, setAttachedSignature] = useState(true);
  const [managerSignature, setManagerSignature] = useState<string>("");
  const [formState, setFormState] = useState<leaveRequest[]>([
    {
      id: "",
      status: "PENDING",
      createdAt: "",
      employee: {
        firstName: "",
        lastName: "",
      },
      name: "",
      requestedStartDate: "",
      requestedEndDate: "",
      requestType: "SICK",
      comment: "",
      decidedBy: "",
      managerComment: "",
      signature: "",
    },
  ]);
  const [originalState, setOriginalState] = useState<leaveRequest[]>([
    {
      id: "",
      status: "PENDING",
      createdAt: "",
      employee: {
        firstName: "",
        lastName: "",
      },
      name: "",
      requestedStartDate: "",
      requestedEndDate: "",
      requestType: "SICK",
      comment: "",
      decidedBy: "",
      managerComment: "",
      signature: "",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getTimeOffRequestById/${id}`);
        const data = await response.json();
        console.log("Data:", data);
        setFormState([data]);
        setOriginalState([data]);
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
        console.log("Signature Data:", data);
        setManagerSignature(data.signature);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSignatureData();
  }, [params.id]);

  const handleApproval = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("id", formState[0].id);
    formData.append("status", "APPROVED");
    formData.append("decidedBy", session?.user?.id as string);
    formData.append("managerComment", formState[0].managerComment);
    formData.append("signature", managerSignature);

    console.log("Form Data:", formData);

    const formValues = {
      id: formData.get("id") as string,
      status: "APPROVED",
      decidedBy: formData.get("decidedBy") as string,
      managerComment: formData.get("managerComment") as string,
      signature: formData.get("signature") as string,
    };
    console.log("Form Values:", formValues);

    try {
      formSubmitSchema.parse(formValues);
      await ManagerLeaveRequest(formData);
      router.replace("/hamburger/inbox");
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleDenial = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("id", formState[0].id);
    formData.append("status", "DENIED");
    formData.append("decidedBy", session?.user?.id as string);
    formData.append("managerComment", formState[0].managerComment);
    formData.append("signature", managerSignature);
    const formValues = {
      id: formData.get("id") as string,
      status: formData.get("DENIED") as string,
      decidedBy: formData.get("decidedBy") as string,
      managerComment: formData.get("managerComment") as string,
      signature: managerSignature,
    };

    try {
      formSubmitSchema.parse(formValues);
      await ManagerLeaveRequest(formData);
      router.replace("/hamburger/inbox");
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleFieldChange = (field: keyof leaveRequest, value: string) => {
    setFormState((prev) => [
      {
        ...prev[0],
        [field]: value,
      },
    ]);
  };

  if (loading) {
    return (
      <div>
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
        <Spinner />;
      </div>
    );
  }

  return (
    <Grids rows={"9"} gap={"4"} className="my-5">
      <Holds
        background={
          formState[0].status === "PENDING"
            ? "orange"
            : formState[0].status === "APPROVED"
            ? "green"
            : "red"
        }
        className="row-span-2"
      >
        <TitleBoxes
          title="Leave Request"
          subtitle={
            formState[0]?.employee
              ? `${formState[0].employee.firstName} ${formState[0].employee.lastName} - ${formState[0].name}`
              : "No employee data"
          }
          header={
            formState[0]
              ? `Requested: ${new Date(
                  formState[0].createdAt
                ).toLocaleDateString()}`
              : "No request date"
          }
          titleImg="/Inbox.svg"
          titleImgAlt="Inbox"
          type="titleAndSubtitleAndHeader"
        />
      </Holds>
      <Holds background={"white"} className="row-span-4 p-4">
        <Labels>
          Requested Date Range
          <Inputs
            type="text"
            value={`${new Date(formState[0].requestedStartDate).toLocaleDateString("en-US")} to ${new Date(formState[0].requestedEndDate).toLocaleDateString("en-US")}`}
            disabled
          />
        </Labels>
        <Labels>
          Request Type
          <Inputs type="text" value={formState[0].requestType} disabled />
        </Labels>
        <Labels>
          Employee Comment
          <TextAreas
            name="description"
            defaultValue={formState[0].comment}
            disabled
          />
        </Labels>
      </Holds>
      <Holds
        background={"white"}
        className="row-span-2 p-4"
        key={formState[0].id}
      >
        <TextInputWithRevert
          label="Manager Comment"
          size="large"
          type="full"
          value={formState[0].managerComment || ""}
          onChange={(newValue: string) =>
            handleFieldChange("managerComment", newValue)
          }
          showAsterisk={false}
          defaultValue={originalState[0].managerComment}
        />

        <Forms onSubmit={handleDenial}>
          <Buttons
            background={
              formState[0]?.managerComment?.length >= 4 ? "red" : "lightGray"
            }
            type="submit"
            disabled={!(formState[0]?.managerComment?.length >= 4)}
          >
            Deny
          </Buttons>
        </Forms>
        <Forms onSubmit={handleApproval}>
          <Buttons
            background={
              formState[0]?.managerComment?.length >= 4 ? "green" : "lightGray"
            }
            type="submit"
            disabled={!(formState[0]?.managerComment?.length >= 4)}
          >
            Approve
          </Buttons>
        </Forms>
      </Holds>
    </Grids>
  );
}
