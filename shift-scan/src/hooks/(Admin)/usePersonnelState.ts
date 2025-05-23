// hooks/usePersonnelState.ts
import { useState, useCallback, useEffect, useMemo } from "react";
import { SearchCrew } from "@/lib/types";
import { z } from "zod";
import {
  BaseUser,
  CrewData,
} from "@/app/(routes)/admins/personnel/components/types/personnel";

export const usePersonnelState = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<BaseUser[]>([]);
  const [crew, setCrew] = useState<CrewData[]>([]);
  const [term, setTerm] = useState("");

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [employeesRes, crewRes] = await Promise.all([
        fetch("/api/getAllEmployees?filter=all", {
          next: { tags: ["employees"] },
        }),
        fetch("/api/getAllCrews", { next: { tags: ["crews"] } }),
      ]);

      if (!employeesRes.ok)
        throw new Error(`Failed to fetch employees: ${employeesRes.status}`);
      if (!crewRes.ok)
        throw new Error(`Failed to fetch crews: ${crewRes.status}`);

      const employeesData = await employeesRes.json();
      const crewData = await crewRes.json();
      setEmployees(employeesData);
      setCrew(crewData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
      } else {
        console.error("Failed to fetch data", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const filteredList = useMemo(() => {
    if (!term.trim())
      return [...employees].sort((a, b) =>
        a.lastName.localeCompare(b.lastName)
      );
    return employees
      .filter((employee) =>
        `${employee.firstName} ${employee.lastName}`
          .toLowerCase()
          .includes(term.toLowerCase())
      )
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [term, employees]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  return {
    loading,
    employees,
    crew,
    term,
    setTerm,
    filteredList,
    handleSearchChange,
    fetchAllData,
  };
};
