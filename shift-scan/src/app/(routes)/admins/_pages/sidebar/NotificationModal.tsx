import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Bell,
  Clock,
  FileText,
  Box,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  getUserTopicPreferences,
  UserTopicPreference,
} from "@/actions/NotificationActions";
import useFcmToken from "@/hooks/useFcmToken";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

// Define available notification topics with user-friendly names and icons
const AVAILABLE_TOPICS = [
  {
    id: "timecards",
    title: "Pending Timecard Approvals",
    desc: "Get notified when team members submit timecards that require your approval.",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    id: "forms",
    title: "Pending Form Submissions",
    desc: "Be alerted when forms are submitted and waiting for review.",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "items",
    title: "New Item Approval Requests",
    desc: "Receive alerts when new items are submitted and need review.",
    icon: <Box className="w-4 h-4" />,
  },
  {
    id: "equipment",
    title: "Equipment Changes",
    desc: "Get notified about equipment updates and modifications.",
    icon: <Box className="w-4 h-4" />,
  },
  {
    id: "timecards-changes",
    title: "Timecard Changes",
    desc: "Be alerted when timecards are modified and require your attention.",
    icon: <Clock className="w-4 h-4" />,
  },
];

export default function NotificationModal({ open, setOpen }: Props) {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { token, notificationPermissionStatus } = useFcmToken();
  const [sendingTest, setSendingTest] = useState<string | null>(null);

  // Test notification function for specific topic
  const handleTestNotification = async (topicId: string) => {
    try {
      setSendingTest(topicId);

      // Create topic-specific test data
      const testData = {
        topicId,
        title: "",
        message: "",
        link: "",
      };

      // Customize notification content based on topic
      switch (topicId) {
        case "timecards":
          testData.title = "Timecard Approval Needed";
          testData.message =
            "John Doe has submitted a timecard for your approval";
          testData.link = "/admins/timesheets";
          testData.topicId = "admins";
          break;
        case "forms":
          testData.title = "Form Submission";
          testData.message = "A new safety form has been submitted for review";
          testData.link = "/admins/forms";
          testData.topicId = "admins";
          break;
        case "items":
          testData.title = "Jobsite Approval Request";
          testData.message = "New jobsite item needs your approval";
          testData.link = "/admins/jobsites";
          testData.topicId = "admins";
          break;
        case "equipment":
          testData.title = "Equipment Approval Request";
          testData.message = "Excavator #5 maintenance status has been updated";
          testData.link = "/admins/equipment";
          testData.topicId = "admins";
          break;
        case "timecards-changes":
          testData.title = "Timecard Modified";
          testData.message = "A timecard has been modified and needs review";
          testData.link = "/admins/timesheets";
          testData.topicId = "admins";
          break;
        default:
          testData.title = "Test Notification";
          testData.message = "This is a test notification";
          testData.link = "/admins";
          testData.topicId = "admins";
      }

      // Send the test notification
      const response = await fetch("/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          title: testData.title,
          message: testData.message,
          link: testData.link,
          topic: topicId,
        }),
      });

      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast.error("Failed to send test notification");
    } finally {
      setSendingTest(null);
    }
  };

  // Load current preferences
  useEffect(() => {
    async function loadPreferences() {
      if (!token) {
        setIsDataLoading(false);
        return;
      }

      try {
        setIsDataLoading(true);
        const userPrefs = await getUserTopicPreferences();

        // Convert the array of topics to a record of topicId: true
        const prefsRecord: Record<string, boolean> = {};
        AVAILABLE_TOPICS.forEach((topic) => {
          prefsRecord[topic.id] = userPrefs.some(
            (pref) => pref.topic === topic.id,
          );
        });

        setPreferences(prefsRecord);
      } catch (error) {
        console.error("Error loading preferences:", error);
        toast.error("Failed to load notification preferences");
      } finally {
        setIsDataLoading(false);
      }
    }

    if (open && token) {
      loadPreferences();
    }
  }, [token, open]);

  // Toggle a topic subscription
  const toggleTopic = (topicId: string) => {
    setPreferences((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  // Save preferences to server
  const handleSave = async () => {
    if (!token) {
      toast.error("You need to allow notifications to save preferences");
      return;
    }

    try {
      setIsLoading(true);

      // Make API call to save preferences
      const response = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences: Object.entries(preferences)
            .filter(([_, enabled]) => enabled)
            .map(([topic]) => ({ topic })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      toast.success("Notification preferences saved");
      setOpen(false);
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save notification preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (notificationPermissionStatus === "denied") {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Notifications Blocked</h3>
          <p className="text-muted-foreground mb-4">
            Notifications are blocked in your browser settings. Please enable
            them to receive alerts about important events.
          </p>
        </div>
      );
    }

    if (!token) {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Enable Notifications</h3>
          <p className="text-muted-foreground mb-4">
            Allow notifications to stay updated on important events.
          </p>
        </div>
      );
    }

    if (isDataLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return (
      <div className="space-y-4 mt-2">
        {AVAILABLE_TOPICS.map((topic) => (
          <div
            key={topic.id}
            className="flex items-center justify-between p-3 rounded-lg border"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-2 rounded-md bg-muted">{topic.icon}</div>
              <div>
                <Label htmlFor={`topic-${topic.id}`} className="font-medium">
                  {topic.title}
                </Label>
                <p className="text-sm text-muted-foreground">{topic.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={sendingTest === topic.id}
                onClick={() => handleTestNotification(topic.id)}
                className="flex items-center gap-1"
              >
                {sendingTest === topic.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Bell className="h-3 w-3" />
                )}
                Test
              </Button>
              <Switch
                id={`topic-${topic.id}`}
                checked={preferences[topic.id] || false}
                onCheckedChange={() => toggleTopic(topic.id)}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90%] max-w-2xl min-h-[420px] rounded-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Bell className="h-5 w-5" />
              Notification Settings
            </DialogTitle>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose which notifications you&apos;d like to receive
          </p>
        </DialogHeader>

        {renderContent()}

        {token && !isDataLoading && (
          <div className="mt-4 p-3 bg-muted rounded-md text-sm">
            <p className="font-medium mb-1">Testing Notifications</p>
            <p className="text-muted-foreground">
              Use the &quot;Test&quot; button next to each notification type to
              send a sample notification. This helps verify your notification
              setup is working correctly.
            </p>
          </div>
        )}

        <DialogFooter className="flex items-center justify-end gap-3 mt-4">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={isLoading || !token}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
