// hooks/useEmployeeData.ts
import { useState, useEffect } from "react";
import { z } from "zod";

// Zod schema for employee data (same as in your component)
const EmployeeSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  DOB: z.string().optional(),
  email: z.string(),
  image: z.string().nullable().optional(),
});

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  DOB?: Date;
  clockedIn?: boolean;
};

type Contact = {
  phoneNumber: string;
  emergencyContact?: string;
  emergencyContactNumber?: string;
};

interface EmployeeDataResult {
  employee: Employee | null;
  contacts: Contact | null;
  loading: boolean;
  error: string | null; // Consider a more specific error type
}

export const useEmployeeData = (
  employeeId: string | undefined
): EmployeeDataResult => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [contacts, setContacts] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!employeeId) {
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/getUserInfo/${employeeId}`);
        if (!response.ok) {
          const message = `An error occurred: ${response.status}`;
          throw new Error(message);
        }
        const res = await response.json();

        // Validate fetched data using Zod
        try {
          EmployeeSchema.parse(res.employeeData);
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            console.error(
              "Validation error in employee data:",
              validationError.errors
            );
            setError(validationError.errors[0].message); // Set validation error
            return; // Stop processing if validation fails
          }
        }

        if (res.error) {
          console.error(res.error);
          setError(res.error);
        } else {
          setEmployee(res.employeeData);
          setContacts(res.contact);
        }
      } catch (err) {
        console.error(err);
        setError(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  return { employee, contacts, loading, error };
};
