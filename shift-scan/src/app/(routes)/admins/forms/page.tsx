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
import useLeftSideTrigger from "../_pages/useLeftSideTrigger";

// Custom hook to manage all forms state and view mode
function useFormsPageState() {
  const [ViewMode, setViewMode] = useState<"list" | "individual" | "builder">(
    "list"
  );

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
  const { isOpen, toggleSidebar } = useLeftSideTrigger();

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

  const [builderLoading, setBuilderLoading] = useState(false);

  // Header section
  function renderHeader() {
    if (ViewMode === "list") {
      return (
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex flex-row items-center">
            <Button
              onClick={toggleSidebar}
              variant="default"
              className="w-10 h-fit bg-transparent mr-6"
            >
              <PanelLeft />
            </Button>
            <p className="text-left font-bold text-lg text-white">
              Forms Management
            </p>
          </div>
          <p className="text-left font-bold text-xs text-white">
            Create, manage, and track form templates and submissions
          </p>
        </div>
      );
    }
    if (ViewMode === "builder") {
      return (
        <div className="flex flex-row gap-4 justify-center items-start">
          {!builderLoading ? (
            <div className="flex flex-col mb-4">
              <div className="flex flex-row items-center gap-1">
                <Button
                  onClick={toggleSidebar}
                  variant="default"
                  className="w-8 h-fit bg-transparent mr-2"
                >
                  <PanelLeft />
                </Button>
                <p className="text-left font-bold text-lg text-white">
                  Form Builder
                </p>
              </div>

              <p className="text-left text-xs text-white">
                {" "}
                Design your custom form by adding fields, configuring
                validation, and setting up workflows.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-24 pl-1" />
              <Skeleton className="h-5 w-48 pl-1" />
            </div>
          )}
        </div>
      );
    }
    if (ViewMode === "individual") {
      return (
        <div className="flex flex-row gap-4 justify-center items-start">
          <Button
            variant={"secondary"}
            size={"icon"}
            onClick={() => setViewMode("list")}
          >
            <img src="/arrowBack.svg" alt="Turn Back" className="w-4 h-4" />
          </Button>
          {!individualFormLoading && formIndividualTemplate?.name ? (
            <div className="flex flex-col mb-4">
              <div className="flex flex-row items-center gap-1">
                <Button
                  onClick={toggleSidebar}
                  variant="default"
                  className="w-8 h-fit bg-transparent mr-2"
                >
                  <PanelLeft />
                </Button>
                <p className="text-left font-bold text-lg text-white">
                  {formIndividualTemplate.name}
                </p>
              </div>
              <p className="text-left text-xs text-white">Form Submissions</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-48 pl-1" />
              <p className="text-left text-xs text-white">Form Submissions</p>
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
      <div className="flex flex-row ">
        <div className="flex flex-row gap-2">
          {ViewMode === "list" && (
            <Button onClick={() => setViewMode("individual")}>
              View Submissions
            </Button>
          )}
          {ViewMode === "list" && (
            <>
              <Button onClick={() => setViewMode("builder")}>
                Form Builder
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
      <div className="h-[3vh] flex flex-row w-full gap-4 mb-4">
        <div className="h-full w-full bg-white max-w-[450px] rounded ">
          <SearchBar
            term={searchTerm}
            handleSearchChange={(e) => setSearchTerm(e.target.value)}
            placeholder={"Search forms by name..."}
            textSize="xs"
            imageSize="6"
          />
        </div>
        <Select value={formType} onValueChange={setFormType}>
          <SelectTrigger className="px-2 text-xs w-fit min-w-[150px] h-full bg-white border rounded">
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
      <div className="h-full flex flex-row w-full gap-4 mb-4">
        <div className="h-full w-full bg-white max-w-[450px] rounded ">
          <SearchBar
            term={searchTerm}
            handleSearchChange={(e) => setSearchTerm(e.target.value)}
            placeholder={"Search forms by name..."}
            textSize="xs"
            imageSize="6"
          />
        </div>
        <Select value={formType} onValueChange={setFormType}>
          <SelectTrigger className="px-2 text-xs w-fit min-w-[150px] h-full bg-white border rounded">
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
    <div className="h-screen w-screen flex flex-row">
      <LeftSidebar isOpen={isOpen} />
      <ScrollArea className=" h-full w-full p-3  relative">
        <div className="h-full w-full gap-4">
          {ViewMode === "list" && (
            <>
              <div className="h-full w-full flex flex-row justify-between gap-1 p-4">
                {renderHeader()}
                <div>{renderTopBarActions()}</div>
              </div>
              {renderListFilters()}
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
              <div className="h-full w-full flex flex-row justify-between gap-1 p-4">
                {renderHeader()}
                <div>{renderTopBarActions()}</div>
              </div>
              {renderIndividualFilters()}
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
              <div className="h-full w-full flex flex-row justify-between gap-1 p-4">
                {renderHeader()}
                <div>{renderTopBarActions()}</div>
              </div>
              <FormBuilder onCancel={() => setViewMode("list")} />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
