"use client";

//things to do:
// views :
// list view: display all forms and details in a table with pagination, search, and sorting
// 1) build export module to export forms as CSV or xlsx
// 2) create a table component to display forms with pagination - done
// 3) add search functionality to filter forms by name - done

import SearchBar from "../personnel/components/SearchBar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFormsList } from "./_components/List/hooks/useFormsList";
import List from "./_components/List/List";
import { FormTemplateCategory } from "@/lib/enums";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

export default function Forms() {
  const { setOpen, open } = useSidebar();
  const [formId, setFormId] = useState<string | null>(null); // use export here

  const {
    searchTerm,
    setSearchTerm,
    formType,
    setFormType,
    loading,
    page,
    pageSize,
    totalPages,
    total,
    setPage,
    setPageSize,
    filteredForms,
  } = useFormsList();

  // Helper to get enum values as array
  const formTemplateCategoryValues = Object.values(FormTemplateCategory);

  // Main render
  return (
    <div className="h-full w-full flex flex-row">
      <div className="h-full w-full relative">
        <div className="h-fit w-full flex flex-row justify-between mb-4">
          <div className="flex flex-row gap-5 ">
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 p-0 hover:bg-slate-500 hover:bg-opacity-20 ${
                  open ? "bg-slate-500 bg-opacity-20" : "bg-app-blue "
                }`}
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <img
                  src={open ? "/condense-white.svg" : "/condense.svg"}
                  alt="logo"
                  className="w-4 h-auto object-contain "
                />
              </Button>
            </div>
            <div className="flex flex-col">
              <p className="text-left font-bold text-base text-white">
                Forms Management
              </p>
              <p className="text-left font-normal text-xs text-white">
                Create, manage, and track form templates and submissions
              </p>
            </div>
          </div>
          <div>
            {" "}
            <div className="h-fit flex flex-row ">
              <div className="flex flex-row gap-2">
                <Link href={`/admins/forms/create`}>
                  <Button>
                    <img
                      src="/plus-white.svg"
                      alt="Create New Form"
                      className="h-4 w-4 mr-1"
                    />
                    <p>Form Template</p>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="h-fit w-full flex flex-row justify-between gap-4 mb-2 ">
          <div className="flex flex-row w-full gap-4 mb-2">
            <div className="h-full w-full p-1 bg-white max-w-[450px] rounded-lg ">
              <SearchBar
                term={searchTerm}
                handleSearchChange={(e) => setSearchTerm(e.target.value)}
                placeholder={"Search forms by name..."}
                textSize="xs"
                imageSize="6"
              />
            </div>
            <Select
              value={formType}
              onValueChange={(val) => setFormType(val as typeof formType)}
            >
              <SelectTrigger className="px-2 text-xs w-fit min-w-[150px] h-full bg-white border rounded-lg">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {formTemplateCategoryValues.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <List
          forms={filteredForms}
          loading={loading}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          total={total}
          setPage={setPage}
          setPageSize={setPageSize}
          setFormId={setFormId}
        />
      </div>
    </div>
  );
}
