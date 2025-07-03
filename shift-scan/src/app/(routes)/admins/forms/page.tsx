"use client";

//things to do:
// views :
// list view: display all forms and details in a table with pagination, search, and sorting
// 1) build a api call to fetch all forms and their details- done
// 2) create a table component to display forms with pagination - done
// 3) add search functionality to filter forms by name - done
// 4) add sorting functionality to sort forms by types
// 5) in the table add actions to view, edit, or delete forms the edit will open the form in the builder view, the delete will delete the form, the view will open the form in the individual view

// builder view : display form builder with options to create new forms
// approval view : display forms awaiting approval
// individual view : display individual form details and submissions
import "@/app/globals.css";
import SearchBar from "../personnel/components/SearchBar";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useFormsList } from "./_components/List/hooks/useFormsList";
import List from "./_components/List/List";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import IndividualFormView from "./_components/Individual/IndividualFormView";
import { FormIndividualTemplate } from "./_components/Individual/hooks/types";
import { Skeleton } from "@/components/ui/skeleton";
import FormBuilder from "./_components/FormBuilder/FormBuilder";
import LeftSidebar from "../_pages/leftSide";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PanelLeft } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import FormEditor from "./_components/FormEdititor/FormEditor";

// Custom hook to manage all forms state and view mode
function useFormsPageState() {
  const [ViewMode, setViewMode] = useState<
    "list" | "individual" | "builder" | "editTemplate"
  >("list");

  const [formId, setFormId] = useState<string | null>(null);
  const formsList = useFormsList();
  return {
    ViewMode,
    setViewMode,
    formId,
    setFormId,
    ...formsList,
  };
}

export default function Forms() {
  const state = useFormsPageState();
  const {
    ViewMode,
    setViewMode,
    formId,
    setFormId,
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
    refetch,
  } = state;

  const [formIndividualTemplate, setIndividualFormTemplate] =
    useState<FormIndividualTemplate | null>(null);
  const [individualFormLoading, setIndividualFormLoading] = useState(false);
  const [individualFormError, setIndividualFormError] = useState<string | null>(
    null
  );
  const [individualFormPage, setIndividualFormPage] = useState(1);
  const [individualFormPageSize, setIndividualFormPageSize] = useState(10);
  const { setOpen, open } = useSidebar();

  useEffect(() => {
    if (!formId) return;
    setIndividualFormLoading(true);
    setIndividualFormError(null);
    fetch(
      `/api/getFormSubmissionsById/${formId}?page=${individualFormPage}&pageSize=${individualFormPageSize}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch form data");
        return res.json();
      })
      .then((data) => {
        setIndividualFormTemplate(data);
      })
      .catch((err) => {
        setIndividualFormError(err.message);
      })
      .finally(() => setIndividualFormLoading(false));
  }, [formId, individualFormPage, individualFormPageSize]);

  // Header section
  function renderHeader() {
    if (ViewMode === "list") {
      return (
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
      );
    }
    if (ViewMode === "builder") {
      return (
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
              Form Builder
            </p>
            <p className="text-left font-normal text-xs text-white">
              Design your custom form by adding fields, configuring validation,
              and setting up workflows.
            </p>
          </div>
        </div>
      );
    }
    if (ViewMode === "individual") {
      return (
        <div className="flex flex-row gap-1 ">
          {!individualFormLoading && formIndividualTemplate?.name ? (
            <div className="flex flex-row gap-5">
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
                  {formIndividualTemplate.name}
                </p>
                <p className="text-left text-xs text-white">Form Submissions</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-row gap-1 ">
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 hover:bg-slate-500 hover:bg-opacity-20"
                  onClick={() => {
                    setOpen(!open);
                  }}
                >
                  <PanelLeft className="h-4 w-4 text-white" />
                </Button>
              </div>
              <div className="flex flex-col  gap-1">
                <Skeleton className="h-5 w-48 pl-1" />
                <p className="text-left text-xs text-white">Form Submissions</p>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  }

  // Top bar actions
  function renderTopBarActions() {
    return (
      <div className="h-fit flex flex-row ">
        <div className="flex flex-row gap-2">
          {ViewMode === "list" && (
            <Button onClick={() => setViewMode("individual")}>
              View Submissions
            </Button>
          )}
          {ViewMode === "list" && (
            <>
              <Button onClick={() => setViewMode("builder")}>
                <img
                  src="/plus-white.svg"
                  alt="Create New Form"
                  className="h-4 w-4 mr-1"
                />
                <p>Form Template</p>
              </Button>
            </>
          )}
          {ViewMode === "individual" && (
            <>
              <Button>Create Submission</Button>
              <Button>Approval</Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // List view filter/search bar
  function renderListFilters() {
    return (
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
        <Select value={formType} onValueChange={setFormType}>
          <SelectTrigger className="px-2 text-xs w-fit min-w-[150px] h-full bg-white border rounded-lg">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {formTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  function renderIndividualFilters() {
    return (
      <div className="flex flex-row w-full gap-4 mb-2">
        <Button
          variant={"default"}
          size={"sm"}
          className=" bg-white h-full mr-1"
          onClick={() => setViewMode("list")}
        >
          <img src="/arrowBack.svg" alt="Turn Back" className="w-4 h-auto " />
          <p className="text-xs text-black ">Back</p>
        </Button>
        <div className="h-full w-full bg-white max-w-[450px] rounded-lg ">
          <SearchBar
            term={searchTerm}
            handleSearchChange={(e) => setSearchTerm(e.target.value)}
            placeholder={"Search forms by name..."}
            textSize="xs"
            imageSize="6"
          />
        </div>
        <Select value={formType} onValueChange={setFormType}>
          <SelectTrigger className="px-2 text-xs w-fit min-w-[150px] h-full bg-white border rounded-lg">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {formTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Main render
  return (
    <div className="h-full w-full flex flex-row">
      <div className="h-full w-full relative">
        {ViewMode === "list" && (
          <>
            <div className="h-fit w-full flex flex-row justify-between mb-4">
              {renderHeader()}
              <div>{renderTopBarActions()}</div>
            </div>
            <div className="h-fit w-full flex flex-row justify-between gap-4 mb-2 ">
              {renderListFilters()}
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
              setViewMode={setViewMode}
            />
          </>
        )}
        {ViewMode === "individual" && (
          <>
            <div className="h-fit w-full flex flex-row justify-between mb-4">
              {renderHeader()}
              <div>{renderTopBarActions()}</div>
            </div>
            <div className="h-fit w-full flex flex-row justify-between gap-4 mb-2">
              {renderIndividualFilters()}
            </div>

            <IndividualFormView
              loading={individualFormLoading}
              error={individualFormError}
              formId={formId}
              formTemplate={formIndividualTemplate}
              page={individualFormPage}
              setPage={setIndividualFormPage}
              pageSize={individualFormPageSize}
              setPageSize={setIndividualFormPageSize}
            />
          </>
        )}
        {ViewMode === "builder" && (
          <>
            <div className="h-fit w-full flex flex-row justify-between gap-1 mb-4">
              {renderHeader()}
              <div>{renderTopBarActions()}</div>
            </div>

            <FormBuilder onCancel={() => setViewMode("list")} />
          </>
        )}
        {ViewMode === "editTemplate" && (
          <>
            <div className="h-fit w-full flex flex-row justify-between gap-1 mb-4">
              {renderHeader()}
              <div>{renderTopBarActions()}</div>
            </div>

            <FormEditor formId={formId} onCancel={() => setViewMode("list")} />
          </>
        )}
      </div>
    </div>
  );
}
