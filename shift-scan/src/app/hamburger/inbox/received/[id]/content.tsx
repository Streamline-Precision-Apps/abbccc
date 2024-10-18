"use client";
import { Bases } from "@/components/(reusable)/bases";
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
import { useTranslations } from "next-intl";
import { ChangeEvent, FormEvent, use, useEffect, useState } from "react";
import {
  EditLeaveRequest,
  ManagerLeaveRequest,
} from "@/actions/inboxSentActions";
import { Images } from "@/components/(reusable)/images";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDateYMD";
import React from "react";
import Spinner from "@/components/(animations)/spinner";
import { Grids } from "@/components/(reusable)/grids";

type Props = {
  params: { id: string };
  session: Session | null;
};

export default function Content({ params, session }: Props) {
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Hamburger");
  const router = useRouter();
  const userId = session?.user.id;
  const [decision, setDecision] = useState(null);
  const [cardDate, setCardDate] = useState("");
  const [manager, setManager] = useState("");
  const [managerComment, setManagerComment] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [signature, setSignature] = useState("");
  const [managerSignature, setManagerSignature] = useState("");
  const [signed, setSigned] = useState(false);
  const [receivedContent, setReceivedContent] = useState<receivedContent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetch(
          `/api/getTimeoffRequests/${params.id}?type=received` // Ensure this matches
        );
        const data = await result.json();

        setCardDate(
          new Date(data[0].date).getMonth().toString() +
            "/" +
            new Date(data[0].date).getDate().toString() +
            "/" +
            new Date(data[0].date).getFullYear().toString()
        );

        const employee = data[0].employee;
        console.log(employee);
        setEmployeeName(employee?.firstName + " " + employee?.lastName || "");
        // Update states based on the fetched data
        setSignature(employee?.signature || "");
        setManager(data[0]?.manager);
        setManagerComment(data[0]?.managerComment || ""); // Handle null or undefined comments
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
    setManagerComment(e.target.value); // Update the state with the new comment
  };
  useEffect(() => {
    if (decision !== null) {
      setDecision(null);
      router.push("/hamburger/inbox");
    }
  }, [decision]);

  function handleApproval(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.currentTarget); // Gather form data
    ManagerLeaveRequest(formData) // Call your action to process the form
      .then(() => {
        // Redirect to the inbox once submission is successful
        router.replace("/hamburger/inbox");
      })
      .catch((error) => {
        // Handle any error in form submission
        console.error("Failed to submit form:", error);
      });
  }
  if (loading) {
    return (
      <>
        <Grids className="grid-rows-10 gap-5 my-5">
          {/*start of title holds */}
          <Holds background={"orange"} className="row-span-1 h-full">
            <TitleBoxes
              title="leave request"
              titleImg="/Inbox.svg"
              titleImgAlt="Inbox"
              type="noIcon"
            />

            <Holds className=""></Holds>
            <Titles size={"h3"}>loading date...</Titles>
          </Holds>
          {/* end of title holds */}

          <Holds background={"white"} className="row-span-9 h-full ">
            <Holds size={"full"} className="mt-5">
              <Spinner />
            </Holds>
          </Holds>
        </Grids>
      </>
    );
  }

  return (
    <>
      <Grids rows={"10"} gap={"5"} className="my-5">
        {/*start of title holds */}
        <Holds background={"orange"} className="row-span-1 h-full">
          <TitleBoxes
            title="leave request"
            titleImg="/Inbox.svg"
            titleImgAlt="Inbox"
            type="noIcon"
          />

          <Titles size={"h3"}>{cardDate}</Titles>
        </Holds>
        {/* end of title holds */}
        {receivedContent.map((item) => (
          <Holds
            background={"white"}
            className="row-span-9 h-full"
            key={item.id}
          >
            <Contents width={"section"}>
              <Grids className="grid-rows-1 py-5 ">
                {/* end of title holds */}
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
                <Holds className="row-span-1 ">
                  <Labels>
                    Employee
                    <Inputs type="text" defaultValue={employeeName} disabled />
                  </Labels>
                </Holds>
                <Holds className="row-span-1">
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
                </Holds>
                <Holds className="row-span-1">
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
                </Holds>
                <Holds className="row-span-1">
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
                  <Holds>
                    <Labels>
                      Managers Comments
                      <TextAreas
                        name="mangerComments"
                        value={managerComment}
                        rows={2}
                        onChange={handleManagerCommentChange}
                        maxLength={40}
                      />
                    </Labels>
                  </Holds>
                  <Holds className="row-span-1 pb-5 ">
                    <Texts position={"left"} size={"p5"}>
                      Employee signature
                    </Texts>
                    <Holds className="border-2 border-black rounded-xl">
                      {!signed ? (
                        <Holds position={"center"} className="py-2">
                          <Texts size={"p5"}>Signature is not setup</Texts>
                        </Holds>
                      ) : (
                        <Holds size={"20"} position={"center"} className="">
                          <img
                            src={signature}
                            alt="signature"
                            className="py-2"
                          />
                        </Holds>
                      )}
                    </Holds>
                    {signed ? (
                      <>
                        <Holds className="my-5">
                          <Holds
                            background={"lightBlue"}
                            position={"row"}
                            className=""
                          >
                            <Holds background={"white"} className="">
                              <Holds size={"20"}>
                                <img
                                  src={managerSignature}
                                  alt="Manager signature"
                                  className="py-2 "
                                />
                              </Holds>
                            </Holds>
                          </Holds>
                        </Holds>

                        <Holds position={"row"} className="row-span-1">
                          <Forms
                            action={ManagerLeaveRequest}
                            onSubmit={handleApproval}
                          >
                            <Inputs type="hidden" name="id" value={item.id} />
                            <Inputs
                              type="hidden"
                              name="decision"
                              value="DENIED"
                            />
                            <Inputs
                              type="hidden"
                              name="decidedBy"
                              value={manager}
                            />
                            <TextAreas
                              name="mangerComments"
                              value={managerComment}
                              hidden
                            />
                            <Holds position={"row"} className="row-span-2">
                              <Buttons
                                background={"red"}
                                type="submit"
                                size={"80"}
                                className="p-1"
                              >
                                <Holds position={"row"}>
                                  <Holds>
                                    <Titles>Deny</Titles>
                                  </Holds>
                                  <Holds>
                                    <Images
                                      titleImg={"/undo-edit.svg"}
                                      titleImgAlt={"delete form"}
                                      size={"30"}
                                    />
                                  </Holds>
                                </Holds>
                              </Buttons>
                            </Holds>
                          </Forms>

                          <Forms
                            action={ManagerLeaveRequest}
                            onSubmit={handleApproval}
                          >
                            <Inputs type="hidden" name="id" value={item.id} />
                            <Inputs
                              type="hidden"
                              name="decision"
                              value="APPROVED"
                            />
                            <Inputs
                              type="hidden"
                              name="decidedBy"
                              value={manager}
                            />
                            <TextAreas
                              name="mangerComments"
                              value={managerComment}
                              hidden
                            />
                            <Holds>
                              <Buttons
                                background={"green"}
                                type="submit"
                                size={"80"}
                                className="p-1"
                              >
                                <Holds position={"row"}>
                                  <Holds>
                                    <Titles>Approve</Titles>
                                  </Holds>
                                  <Holds>
                                    <Images
                                      titleImg={"/save-edit.svg"}
                                      titleImgAlt={"delete form"}
                                      size={"30"}
                                    />
                                  </Holds>
                                </Holds>
                              </Buttons>
                            </Holds>
                          </Forms>
                        </Holds>
                      </>
                    ) : (
                      <Holds className="mt-5">
                        <Texts>I agree to this request</Texts>
                        <Buttons
                          background={"lightBlue"}
                          className="py-3 mt-5"
                          onClick={() => setSigned(!signed)}
                        >
                          <Titles size={"h2"}>Sign Now</Titles>
                        </Buttons>
                      </Holds>
                    )}
                  </Holds>
                </Holds>
              </Grids>
            </Contents>
          </Holds>
        ))}
      </Grids>
    </>
  );
}
