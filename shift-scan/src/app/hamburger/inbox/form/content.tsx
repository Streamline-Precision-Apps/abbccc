"use client";
import { Bases } from "@/components/(reusable)/bases";
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
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { RequestForm } from "@/lib/types";
import { useEffect, useState } from "react";
import { createLeaveRequest } from "@/actions/inboxSentActions";
import { useRouter } from "next/navigation";
import { uploadFirstSignature } from "@/actions/userActions";
import {  Signature } from "@/app/(routes)/dashboard/clock-out/(components)/injury-verification/Signature";

function useBanner(initialMessage = "") {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState(initialMessage);

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => setShowBanner(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showBanner]);

  return { showBanner, bannerMessage, setShowBanner, setBannerMessage };
}

export default function Form({ signature, session }: RequestForm) {
  const [sign, setSign] = useState(false);
  const [message, setMessage] = useState("");
  const [base64String, setBase64String] = useState<string>(signature || "");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const id = session?.user.id;
  const { showBanner, bannerMessage, setShowBanner, setBannerMessage } =
    useBanner();

  const handleSubmitImage = async () => {
    if (!base64String) {
      setBannerMessage("Please capture a signature before proceeding.");
      setShowBanner(true);
      return;
    }
    if (!id) {
      setBannerMessage("Invalid session. Please try again.");
      setShowBanner(true);
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("Signature", base64String);

    setIsSubmitting(true);
    try {
      await uploadFirstSignature(formData); // This assumes you have an uploadFirstSignature function elsewhere
    } catch (error) {
      console.error("Error uploading signature:", error);
      setBannerMessage(
        "There was an error uploading your signature. Please try again."
      );
      setShowBanner(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const router = useRouter();
  const handleSubmit = async () => {
    setShowBanner(true);
    setBannerMessage("Time off request submitted");

    const timer = setTimeout(() => {
      setShowBanner(false);
      setMessage("");
      clearTimeout(timer);
      router.replace("/hamburger/inbox");
    }, 5000);
  };
  return (
    <Bases>
      <Contents>
        <Holds background={"green"} className="mb-3">
          <TitleBoxes
            title="Leave Request Form"
            titleImg="/new/Inbox.svg"
            titleImgAlt="Inbox"
            type="noIcon"
          />
        </Holds>
        {showBanner && <Titles>{bannerMessage}</Titles>}
        <Forms action={createLeaveRequest} onSubmit={handleSubmit}>
          <Holds background={"white"} className="mb-3">
            <Contents width="section">
              <Holds>
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
              {sign ? (
                  <Holds size="titleBox">
                    <Signature
                      setBase64String={setBase64String}
                      base64string={base64String}
                      handleSubmitImage={handleSubmitImage}
                    />
                <Buttons
                  background={"lightBlue"}
                  onClick={(event) => {
                    event.preventDefault();
                    setSign(false);
                  }}
                >
                <Titles size="h4">Cancel</Titles>
                </Buttons>
                  </Holds>
              ) : (
                <Buttons
                  background={"lightBlue"}
                  onClick={(event) => {
                    event.preventDefault();
                    setSign(true);
                  }}
                >
                  <Titles size={"h2"}>Tap to sign</Titles>
                </Buttons>
              )}
              <Texts size={"p4"}>
                *By Signing I acknowledge that time leave request are subject to
                management approval and company policy. *
              </Texts>
            </Contents>
          </Holds>
          <Buttons type="submit" background={"green"}>
            <Titles size={"h2"}>Submit</Titles>
          </Buttons>
        </Forms>
      </Contents>
    </Bases>
  );
}
