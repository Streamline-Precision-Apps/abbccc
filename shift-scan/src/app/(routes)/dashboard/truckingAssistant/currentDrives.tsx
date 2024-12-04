import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Contents } from "@/components/(reusable)/contents";
import Spinner from "@/components/(animations)/spinner";
import { Grids } from "@/components/(reusable)/grids";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useCurrentView } from "@/app/context/CurrentViewContext";

// Define Zod schema
const receivedContentSchema = z.object({
  id: z.number(),
  submitDate: z.string(),
  userId: z.string(),
  date: z.string(),
  jobsiteId: z.string(),
  costcode: z.string(),
  nu: z.string().default("nu"),
  Fp: z.string().default("fp"),
  vehicleId: z.string().nullable(),
  startTime: z.string(),
  endTime: z.string().nullable(),
  duration: z.number().nullable(),
  startingMileage: z.number().nullable(),
  endingMileage: z.number().nullable(),
  leftIdaho: z.boolean().nullable().default(false),
  equipmentHauled: z.string().nullable(),
  materialsHauled: z.string().nullable(),
  hauledLoadsQuantity: z.number().nullable(),
  refuelingGallons: z.number().nullable(),
  timeSheetComments: z.string().nullable(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
});

// Infer TypeScript type from schema
type ReceivedContent = z.infer<typeof receivedContentSchema>;

export default function CurrentDrives() {
  const { data: session } = useSession();
  const [receivedContent, setReceivedContent] = useState<ReceivedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("TruckingAssistant");
  const { currentView } = useCurrentView();

  useEffect(() => {
    const fetchReceivedContent = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getDrives");
        if (!response.ok) throw new Error(t("FailedToRetrieve"));

        const data = await response.json();
        console.log("Raw data:", data);

        const validatedData: ReceivedContent[] = data.map((item: ReceivedContent) =>
          receivedContentSchema.parse(item)
        );
        console.log("Validated Data:", validatedData);

        setReceivedContent(validatedData);
        setLoading(false);
      } catch (err) {
        console.error(t("ErrorFetching"), err);
        setError(t("FetchingError"));
        setLoading(false);
      }
    };

    if (session) {
      fetchReceivedContent();
    } else {
      setError("User is not logged in.");
    }

    if (currentView !== "truck") {
      setError("Clock in under a truck.");
    }
  }, [session, currentView]);

  const user_Id = session?.user?.id;
  console.log("User ID from session:", user_Id);
  console.log("All received content:", receivedContent);

  // Exclude entries with null vehicleId
  const filteredContent = receivedContent.filter(
    (item) => item.userId === user_Id && item.vehicleId !== null
  );
  console.log("Filtered content:", filteredContent);

  if (loading) {
    return (
      <Holds className="py-5">
        <Texts>{t("Loading")}</Texts>
        <Spinner />
      </Holds>
    );
  }

  if (error) {
    return (
      <Holds>
        <Texts>{error}</Texts>
      </Holds>
    );
  }

  if (!filteredContent || filteredContent.length === 0) {
    return (
      <Holds className="mt-10">
        <Titles>{t("NoDrives")}</Titles>
      </Holds>
    );
  }

  const groupedByVehicle = filteredContent.reduce<
    Record<string, ReceivedContent[]>
  >((acc, item) => {
    const vehicleKey = item.vehicleId as string; // vehicleId is guaranteed to be non-null here
    acc[vehicleKey] = acc[vehicleKey] || [];
    acc[vehicleKey].push(item);
    return acc;
  }, {});

  return (
    <Contents width={"section"} className="mb-5">
      <Grids rows={"1"} gap={"5"} className="py-5">
        {Object.entries(groupedByVehicle).map(([vehicleId, drives]) => {
          const highestIdDrive = drives.reduce((max, item) =>
            item.id > max.id ? item : max
          );

          return (
            <Holds key={vehicleId} className="border p-4 rounded-lg">
              <Titles>{`Vehicle ID: ${vehicleId}`}</Titles>
              {drives.map((item) => (
                <Buttons
                  key={item.id}
                  background={item.id === highestIdDrive.id ? "green" : "lightBlue"}
                  size={"90"}
                >
                  <Titles>{`Starting Mileage: ${
                    item.startingMileage ?? "N/A"
                  }`}</Titles>
                  <Texts>
                    {new Date(item.startTime).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                  </Texts>
                </Buttons>
              ))}
            </Holds>
          );
        })}
      </Grids>
    </Contents>
  );
}
