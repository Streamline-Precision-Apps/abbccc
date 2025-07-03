export interface Grouping {
  id: string;
  title: string;
  order: number;
  Fields: any[];
}
export interface Submission {
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

export interface FormIndividualTemplate {
  id: string;
  name: string;
  formType: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isSignatureRequired: boolean;
  FormGrouping: Grouping[];
  Submissions: Submission[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}
