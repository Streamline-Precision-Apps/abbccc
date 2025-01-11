"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { RequestForm } from "@/lib/types";
import { useEffect, useState } from "react";
// import { createLeaveRequest } from "@/actions/inboxSentActions";
import { useRouter } from "next/navigation";
import React from "react";
import { Grids } from "@/components/(reusable)/grids";
import { z } from "zod";

// Zod schema for form validation
const leaveRequestSchema = z.object({
  startDate: z.string().nonempty({ message: "Start date is required" }),
  endDate: z.string().nonempty({ message: "End date is required" }),
  requestType: z.enum(["Vacation", "Medical", "Military", "Personal", "Sick"]),
  description: z.string().max(40, { message: "Max 40 characters" }),
  userId: z.string().nonempty({ message: "User ID is required" }),
  status: z.literal("PENDING"),
  date: z.string().nonempty({ message: "Date is required" }),
});

export default function Form({ session }: RequestForm) {
  const [sign, setSign] = useState(false);
  const [message, setMessage] = useState("");
  const [closeBanner, setCloseBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [signature, setSignature] = useState("");

  // Fetch the signature image when the component is mounted
  useEffect(() => {
    const fetchSignature = async () => {
      const response = await fetch("/api/getUserSignature");
      const json = await response.json();
      setSignature(json.signature);
    };
    fetchSignature();
  }, []);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!sign) {
      setErrorMessage("Please provide your signature before submitting.");
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const formValues = {
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      requestType: formData.get("requestType") as string,
      description: formData.get("description") as string,
      userId: formData.get("userId") as string,
      status: formData.get("status") as string,
      date: formData.get("date") as string,
    };

    // Validate form data using Zod
    try {
      leaveRequestSchema.parse(formValues);
      // await createLeaveRequest(formData);

      setCloseBanner(true);
      setMessage("Time off request submitted");

      // Redirect and reset form after a delay
      const timer = setTimeout(() => {
        setCloseBanner(false);
        setMessage("");
        clearTimeout(timer);
        router.replace("/hamburger/inbox");
      }, 5000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.errors[0].message);
      } else {
        console.error("Error creating leave request:", error);
      }
    }
  };

  return (
    <>
      {/* Display banner message */}
      {closeBanner && <Titles>{message}</Titles>}

      {/* Display error message if not signed */}
      {errorMessage && <Titles>{errorMessage}</Titles>}

      <Forms onSubmit={handleSubmit}>
        <Holds background={"white"} className="mb-3">
          <Contents width="section">
            <Grids className="grid-rows-7">
              <Holds className="row-span-4">
                <Labels>Start Date</Labels>
                <Inputs type="date" name="startDate" id="startDate" required />
                <Labels>End Date</Labels>
                <Inputs type="date" name="endDate" id="endDate" required />
                <Labels>Request Type</Labels>
                <Selects
                  id="requestType"
                  name="requestType"
                  defaultValue=""
                  required
                >
                  <option value="">Choose a request</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Medical">Family/Medical Leave</option>
                  <option value="Military">Military Leave</option>
                  <option value="Personal">Non Paid Personal Leave</option>
                  <option value="Sick">Sick Time</option>
                </Selects>
                <Labels>Comments</Labels>
                <TextAreas
                  name="description"
                  id="description"
                  rows={5}
                  maxLength={40}
                  required
                />
                <Inputs type="hidden" name="userId" value={session?.user?.id} />
                <Inputs type="hidden" name="status" value="PENDING" />
                <Inputs
                  type="hidden"
                  name="date"
                  value={new Date().toISOString()}
                />
              </Holds>

              {/* Signature Section */}
              <Holds className="row-span-2">
                {sign ? (
                  <Buttons
                    background={"lightBlue"}
                    className="p-4"
                    onClick={(event) => {
                      event.preventDefault();
                      setSign(false);
                      setErrorMessage("");
                    }}
                  >
                    <Holds
                      background={"white"}
                      size={"full"}
                      position={"center"}
                    >
                      <Holds size={"30"}>
                        <Images
                          titleImg={`${signature}`}
                          titleImgAlt="Loading Signature"
                        />
                      </Holds>
                    </Holds>
                  </Buttons>
                ) : (
                  <Buttons
                    background={"lightBlue"}
                    className="p-5"
                    onClick={(event) => {
                      event.preventDefault();
                      setSign(true);
                    }}
                  >
                    <Holds>
                      <Holds size={"30"} position={"center"}>
                        <Titles size={"h1"}>Sign Here</Titles>
                      </Holds>
                    </Holds>
                  </Buttons>
                )}
                <Texts size={"p4"}>
                  *By signing, I acknowledge that the time leave request is
                  subject to management approval and company policy.*
                </Texts>
              </Holds>

              {/* Submit Section */}
              <Holds className="row-span-1">
                <Buttons type="submit" background={"green"} disabled={!sign}>
                  <Titles size={"h2"}>Submit</Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Contents>
        </Holds>
      </Forms>
    </>
  );
}
