"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Signature } from "./(components)/injury-verification/Signature";
import { useTranslations } from "next-intl";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { useRouter } from "next/navigation";
import { updateTimeSheet } from "@/actions/timeSheetActions";
import { Banners } from "@/components/(reusable)/banners";
import { Texts } from "@/components/(reusable)/texts";
import { Clock } from "@/components/clock";
import { Inputs } from "@/components/(reusable)/inputs";
import { Images } from "@/components/(reusable)/images";
import { Grids } from "@/components/(reusable)/grids";
import Spinner from "@/components/(animations)/spinner";
import { z } from "zod";
import { uploadFirstSignature } from "@/actions/userActions";

// Zod schema for ClockOutContentProps
const ClockOutContentPropsSchema = z.object({
  id: z.string(),
});

// Zod schema for localStorage data
const LocalStorageDataSchema = z.object({
  jobsite: z.string().nullable(),
  costCode: z.string().nullable(),
  timesheet: z
    .object({
      id: z.string().nullable(),
    })
    .nullable(),
});

// Zod schema for form data
const FormDataSchema = z.object({
  id: z.string(),
  Signature: z.string(),
});

// Custom hook for managing banners
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

type ClockOutContentProps = {
  id: string;
};

export default function ClockOutContent({ id }: ClockOutContentProps) {
  // Validate props with Zod
  try {
    ClockOutContentPropsSchema.parse({ id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error in ClockOutContent props:", error.errors);
    }
  }

  const [loading, setLoading] = useState(true);
  const [step, incrementStep] = useState(1);
  const [path, setPath] = useState("ClockOut");
  const router = useRouter();
  const t = useTranslations("ClockOut");
  const [checked, setChecked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const hasSubmitted = useRef(false);
  const { bannerMessage, setShowBanner, setBannerMessage } = useBanner();
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { savedTimeSheetData } = useTimeSheetData();
  const [date] = useState(new Date());
  const [base64String, setBase64String] = useState<string>("");

  // Optimize localStorage access with useMemo
  const localStorageData = useMemo(() => {
    const data =
      typeof window !== "undefined"
        ? {
            jobsite: localStorage.getItem("jobSite"),
            costCode: localStorage.getItem("costCode"),
            timesheet: JSON.parse(
              localStorage.getItem("savedtimeSheetData") || "{}"
            ),
          }
        : {};
    try {
      return LocalStorageDataSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error in localStorage data:", error.errors);
      }
      return {};
    }
  }, []);

  useEffect(() => {
    const fetchSignature = async () => {
      setLoading(true);
      try {
        const response = await window.fetch("/api/getUserSignature");
        const json = await response.json();
        setBase64String(json.signature);
      } catch (error) {
        console.error("Error fetching signature:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSignature();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.currentTarget.checked);
  };

  const handleSubmitImage = async () => {
    if (!base64String) {
      setBannerMessage("Please capture a signature before proceeding.");
      setShowBanner(true);
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("Signature", base64String);

    try {
      // Validate formData with Zod
      FormDataSchema.parse({ id, Signature: base64String });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error in formData:", error.errors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await uploadFirstSignature(formData);
    } catch (error) {
      console.error("Error uploading signature:", error);
      setBannerMessage("There was an error uploading your signature.");
      setShowBanner(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || hasSubmitted.current) return;

    try {
      setIsSubmitting(true);
      hasSubmitted.current = true;

      const formData = new FormData(formRef.current as HTMLFormElement);

      // Ensure FormData contains required fields
      if (!formData.has("id") || !formData.has("endTime")) {
        setBannerMessage("Form data is incomplete.");
        setShowBanner(true);
        return;
      }

      await updateTimeSheet(formData);
      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error("Failed to submit the time sheet:", error);
      setBannerMessage("There was an error submitting the time sheet.");
      setShowBanner(true);
    } finally {
      setIsSubmitting(false);
      hasSubmitted.current = false;
    }
  };

  const handleNextStepAndSubmit = async () => {
    if (!checked) {
      setPath("Injury");
      incrementStep(2);
    } else {
      incrementStep(2);
    }
  };

  const handleButtonClick = () => {
    handleSubmit();
  };

  if (step === 1) {
    return (
      <Grids className="grid-rows-4 gap-5">
        {/* Step 1: Signature verification UI */}
      </Grids>
    );
  } else if (step === 2 && path === "Injury") {
    return (
      <Grids rows={"10"} gap={"5"}>
        {/* Step 2: Injury report UI */}
      </Grids>
    );
  } else if (step === 2 && path === "ClockOut") {
    return (
      <Grids rows={"4"} gap={"5"}>
        {/* Step 2: Clock-out confirmation UI */}
      </Grids>
    );
  } else {
    return null;
  }
}
