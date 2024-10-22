import React, { useState } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { setUserSettings } from "@/actions/userActions";

const NotificationSettings = ({
  id,
  handleNextStep,
}: {
  id: string;
  handleNextStep: any;
}) => {
  const [approvedRequests, setApprovedRequests] = useState(false);
  const [timeoffRequests, setTimeoffRequests] = useState(false);
  const [generalReminders, setGeneralReminders] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitSettings = async () => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("approvedRequests", String(approvedRequests));
    formData.append("timeoffRequests", String(timeoffRequests));
    formData.append("GeneralReminders", String(generalReminders));

    setIsSubmitting(true);
    try {
      await setUserSettings(formData);
      handleNextStep(); // Proceed to the next step only if settings update is successful
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("There was an error updating your settings. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <p>Would you like to receive reminder notifications for the following?</p>

      <div style={{ margin: "20px 0" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ marginRight: "10px" }}>Approved Requests</label>
          <input
            type="checkbox"
            checked={approvedRequests}
            onChange={(e) => setApprovedRequests(e.target.checked)}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ marginRight: "10px" }}>Timeoff Requests</label>
          <input
            type="checkbox"
            checked={timeoffRequests}
            onChange={(e) => setTimeoffRequests(e.target.checked)}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ marginRight: "10px" }}>General Reminders</label>
          <input
            type="checkbox"
            checked={generalReminders}
            onChange={(e) => setGeneralReminders(e.target.checked)}
          />
        </div>
      </div>

      <Buttons
        onClick={handleSubmitSettings}
        style={{ backgroundColor: "orange", color: "black" }}
        disabled={isSubmitting} // Disable the button while submitting
      >
        {isSubmitting ? "Submitting..." : "Next"}
      </Buttons>
    </div>
  );
};

export default NotificationSettings;
