import { useState, useEffect, useCallback, useMemo } from "react";
import type { FormTemplate } from "./types";
import { FormTemplateCategory } from "@/lib/enums";

/**
 * Custom hook to manage fetching, filtering, and paginating forms for the List view.
 * Handles loading, error, search, filter, and pagination state.
 */

export type FormTypeFilter = FormTemplateCategory | "ALL";

export function useFormsList() {
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formType, setFormType] = useState<FormTypeFilter>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchForms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/getAllForms?page=${page}&pageSize=${pageSize}`,
      );
      if (!res.ok) throw new Error("Failed to fetch forms");
      const result = await res.json();
      setForms(result.data as FormTemplate[]);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load forms");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // Get unique form types from the current forms
  const formTypes = useMemo(() => {
    const types = new Set<string>();
    forms.forEach((form) => {
      if (form.formType) types.add(form.formType);
    });
    return Array.from(types).sort();
  }, [forms]);

  // Filter by search and formType
  const filteredForms = useMemo(() => {
    return forms
      .filter((form) => {
        const matchesName = searchTerm.trim()
          ? form.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
          : true;
        const matchesType =
          formType === "ALL" ? true : form.formType === formType;
        return matchesName && matchesType;
      })
      .map((form) => ({
        id: form.id,
        name: form.name,
        description: null, // Add description to match FormItem interface
        formType: form.formType || "UNKNOWN",
        _count: form._count,
        isActive: form.isActive ? "ACTIVE" : "DRAFT",
        createdAt: form.createdAt || new Date().toISOString(),
        updatedAt: form.updatedAt || new Date().toISOString(),
      }));
  }, [forms, searchTerm, formType]);

  return {
    forms,
    filteredForms,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    formType,
    setFormType,
    formTypes,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    total,
    refetch: fetchForms,
  };
}
