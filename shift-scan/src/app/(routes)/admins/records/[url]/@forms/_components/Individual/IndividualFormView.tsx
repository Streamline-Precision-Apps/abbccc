import { useEffect, useState } from "react";
import SubmissionTable from "./SubmissionTable";

interface Grouping {
  id: string;
  title: string;
  order: number;
  Fields: any[];
}
interface Submission {
  id: string;
  title: string;
  formTemplateId: string;
  userId: string;
  formType: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  status: string;
  User: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface FormTemplate {
  id: string;
  name: string;
  formType: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isSignatureRequired: boolean;
  FormGrouping: Grouping[];
  Submissions: Submission[];
}

export default function IndividualFormView({
  formId,
}: {
  formId: string | null;
}) {
  const [formTemplate, setFormTemplate] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!formId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/getFormSubmissionsById/${formId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch form data");
        return res.json();
      })
      .then((data) => {
        setFormTemplate(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [formId]);

  if (!formId)
    return <div className="text-xs text-gray-500">No form selected.</div>;
  if (loading) return <div className="text-xs text-gray-500">Loading...</div>;
  if (error) return <div className="text-xs text-red-500">{error}</div>;
  if (!formTemplate)
    return <div className="text-xs text-gray-500">No data found.</div>;

  return (
    <div className="w-full h-full">
      <h2 className="font-bold text-white text-xs mb-2 pl-1">
        {formTemplate.name} Submissions
      </h2>
      <div className="w-full h-full bg-white bg-opacity-80 rounded-lg shadow border">
        <SubmissionTable
          groupings={formTemplate.FormGrouping}
          submissions={formTemplate.Submissions}
        />
      </div>
    </div>
  );
}
