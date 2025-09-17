/**
 * Example: Offline-Enhanced Timesheet Form
 * This demonstrates how to integrate offline functionality into an existing form component
 */

"use client";

import React, { useState, useEffect } from "react";
import { useOffline } from "@/hooks/use-offline";
import { OfflineIndicator } from "@/components/offline-status";

interface TimesheetFormProps {
  userId: string;
  initialData?: FormData;
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  userId: string;
  jobsiteId: string;
  costcode: string;
  comment: string;
  workType: string;
  [key: string]: string;
}

export function OfflineEnhancedTimesheetForm({
  userId,
  initialData,
  onSubmit,
}: TimesheetFormProps) {
  const { isOnline, status, offlineTimesheet, syncOfflineActions, syncing } =
    useOffline();

  const [formData, setFormData] = useState<FormData>({
    userId,
    jobsiteId: "",
    costcode: "",
    comment: "",
    workType: "LABOR",
    ...initialData,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | "offline" | null;
    message: string;
  }>({ type: null, message: "" });

  // Load offline timesheet data if available
  useEffect(() => {
    if (offlineTimesheet && !initialData) {
      setFormData((prev: FormData) => ({
        ...prev,
        ...offlineTimesheet,
        // Don't override userId
        userId,
      }));
    }
  }, [offlineTimesheet, initialData, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Create FormData for server action
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, String(value));
      });

      // Determine which server action to call based on work type
      const actionName = `handle${formData.workType === "LABOR" ? "General" : formData.workType}TimeSheet`;

      if (isOnline) {
        // Try online submission first
        const response = await fetch("/", {
          method: "POST",
          headers: {
            "Next-Action": actionName,
          },
          body: form,
        });

        if (response.ok) {
          const result = await response.json();
          setSubmitStatus({
            type: "success",
            message: "Timesheet created successfully!",
          });
          onSubmit?.(result);
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      } else {
        // We're offline - the service worker will handle this
        const response = await fetch("/", {
          method: "POST",
          headers: {
            "Next-Action": actionName,
          },
          body: form,
        });

        if (response.headers.get("X-Offline") === "true") {
          setSubmitStatus({
            type: "offline",
            message:
              "Timesheet saved offline. It will sync when you're back online.",
          });
          onSubmit?.(await response.json());
        } else {
          throw new Error("Offline processing failed");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Offline Status Header */}
      <div className="mb-4">
        <OfflineIndicator className="mb-2" />
        {!isOnline && (
          <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
            You&apos;re working offline. Your data will be saved locally and synced
            when you&apos;re back online.
          </div>
        )}
        {status.pendingActions > 0 && isOnline && (
          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded flex items-center justify-between">
            <span>{status.pendingActions} items waiting to sync</span>
            <button
              onClick={syncOfflineActions}
              disabled={syncing}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {syncing ? "Syncing..." : "Sync Now"}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Create Timesheet</h2>

        <div>
          <label
            htmlFor="workType"
            className="block text-sm font-medium text-gray-700"
          >
            Work Type
          </label>
          <select
            id="workType"
            name="workType"
            value={formData.workType}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="LABOR">General Labor</option>
            <option value="MECHANIC">Mechanic</option>
            <option value="TASCO">Tasco</option>
            <option value="TRUCK_DRIVER">Truck Driver</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="jobsiteId"
            className="block text-sm font-medium text-gray-700"
          >
            Jobsite ID
          </label>
          <input
            type="text"
            id="jobsiteId"
            name="jobsiteId"
            value={formData.jobsiteId}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="costcode"
            className="block text-sm font-medium text-gray-700"
          >
            Cost Code
          </label>
          <input
            type="text"
            id="costcode"
            name="costcode"
            value={formData.costcode}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Comments
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Status */}
        {submitStatus.type && (
          <div
            className={`p-3 rounded ${
              submitStatus.type === "success"
                ? "bg-green-50 text-green-700"
                : submitStatus.type === "offline"
                  ? "bg-orange-50 text-orange-700"
                  : "bg-red-50 text-red-700"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : isOnline
                ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white"
                : "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 text-white"
          }`}
        >
          {isSubmitting
            ? "Submitting..."
            : isOnline
              ? "Create Timesheet"
              : "Save Offline"}
        </button>

        {/* Offline Data Info */}
        {offlineTimesheet && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <strong>Current offline timesheet:</strong>
            <div>Type: {String(offlineTimesheet.workType || 'Unknown')}</div>
            <div>
              Started: {new Date(String(offlineTimesheet.startTime || new Date())).toLocaleString()}
            </div>
            {Boolean(offlineTimesheet.endTime) && (
              <div>
                Ended: {new Date(String(offlineTimesheet.endTime)).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default OfflineEnhancedTimesheetForm;
