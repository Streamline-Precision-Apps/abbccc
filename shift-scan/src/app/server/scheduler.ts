import cron from "node-cron";
import { processTimecards } from "@/actions/timeSheetActions";

// Schedule a task to run every day at 11:59:59 PM
cron.schedule("59 59 23 * * *", async () => {
  console.log("Running scheduled task for timecards...");
  await processTimecards();
});

console.log("Task scheduler initialized");
