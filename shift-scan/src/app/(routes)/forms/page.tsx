"use client";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "../admins/_pages/SearchBar";
import { Texts } from "@/components/(reusable)/texts";

type Form = {
  id: string;
  name: string;
};

interface FormDraft {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  FormTemplate: {
    name: string;
  };
}

export default function InboxHomePage() {
  const t = useTranslations("Hamburger-Inbox");
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("returnUrl") || "/dashboard";
  // Add a state to manage active tab
  const [activeTab, setActiveTab] = useState("forms");
  const [loading, setLoading] = useState<boolean>(false);
  const [draftLoading, setDraftLoading] = useState<boolean>(false);
  const [forms, setForms] = useState<Form[]>([]);
  const [draftForms, setDraftForms] = useState<FormDraft[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredForms, setFilteredForms] = useState<Form[]>([]);

  // Function to handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Filter forms based on search term
  useEffect(() => {
    if (!forms.length) return;

    const filtered = forms.filter((form) =>
      form.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredForms(filtered);
  }, [searchTerm, forms]);

  useEffect(() => {
    // Check if a tab is specified in the URL
    const tab = searchParams.get("tab");
    if (
      tab &&
      (tab === "forms" || tab === "inprogress" || tab === "submitted")
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fetch forms from the database on mount
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/forms");
        const data: Form[] = await response.json();
        setForms(data);
        setFilteredForms(data); // Initially set filtered forms to all forms
      } catch (error) {
        console.error("Error fetching forms:", error);
        setForms([]);
        setFilteredForms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  // Fetch draft forms when the "In Progress" tab is selected
  useEffect(() => {
    if (activeTab === "inprogress") {
      const fetchDraftForms = async () => {
        try {
          setDraftLoading(true);
          const response = await fetch("/api/formDrafts");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: FormDraft[] = await response.json();

          // Sort by last updated (most recent first)
          const sortedData = [...data].sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          );

          setDraftForms(sortedData);
        } catch (error) {
          console.error("Error fetching draft forms:", error);
          setDraftForms([]);
        } finally {
          setDraftLoading(false);
        }
      };

      fetchDraftForms();
    }
  }, [activeTab]);

  return (
    <Bases>
      <Contents width={"section"}>
        <Grids rows={"8"}>
          <Holds
            background={"white"}
            className="h-full w-full row-span-1 relative rounded-b-none"
          >
            <TitleBoxes position={"row"} onClick={() => router.push(url)}>
              <Holds
                position={"row"}
                className="w-full justify-center items-center gap-x-2 "
              >
                <Titles size={"md"}>{t("FormsDocuments")}</Titles>
                {/* <Images
              titleImg="/form.svg"
              titleImgAlt="Inbox"
              className="max-w-5 h-auto object-contain"
            /> */}
              </Holds>
            </TitleBoxes>
          </Holds>
          <Holds
            background={"white"}
            className="h-full w-full rounded-none row-span-1"
          >
            {/* Single Tabs component for navigation with shared state */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="forms">Forms</TabsTrigger>
                <TabsTrigger value="inprogress">In Progress</TabsTrigger>
                <TabsTrigger value="submitted">Submitted</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search bar area - only shown when forms tab is active */}
            {activeTab === "forms" && (
              <div className="border-2 py-2 border-gray-100">
                <SearchBar
                  imageSize="4"
                  term={searchTerm}
                  handleSearchChange={handleSearchChange}
                  placeholder={"Search forms..."}
                />
              </div>
            )}
          </Holds>
          <Holds
            background={"white"}
            className="h-full w-full rounded-t-none row-span-6"
          >
            {/* Content area with shared tab state */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full"
            >
              <TabsContent value="forms" className="h-full">
                <Holds className="h-full">
                  {loading ? (
                    <Holds className="flex items-center justify-center h-full">
                      <Titles size={"sm"} className="text-gray-500">
                        Loading forms...
                      </Titles>
                    </Holds>
                  ) : filteredForms.length === 0 ? (
                    <Holds className="flex items-center h-full pt-4">
                      <Texts size={"sm"} className="text-gray-400 italic">
                        {searchTerm
                          ? "No forms match your search"
                          : "No forms available"}
                      </Texts>
                    </Holds>
                  ) : (
                    <div className="grid gap-4">
                      {filteredForms.map((form) => (
                        <Holds
                          key={form.id}
                          className="bg-slate-50 py-2 px-3 rounded-lg cursor-pointer hover:opacity-90 border-t border-gray-100"
                          onClick={() =>
                            router.push(`/forms/create/${form.id}`)
                          }
                        >
                          <Texts
                            position={"left"}
                            size={"sm"}
                            className="font-semibold"
                          >
                            {form.name}
                          </Texts>
                        </Holds>
                      ))}
                    </div>
                  )}
                </Holds>
              </TabsContent>
              <TabsContent value="inprogress" className="h-full p-4">
                <Holds className="h-full">
                  {draftLoading ? (
                    <Holds className="flex items-center justify-center h-full">
                      <Titles size={"sm"} className="text-gray-500">
                        Loading in-progress forms...
                      </Titles>
                    </Holds>
                  ) : draftForms.length === 0 ? (
                    <Holds className="flex items-center h-full pt-4">
                      <Texts size={"sm"} className="text-gray-400 italic">
                        No in-progress forms found
                      </Texts>
                    </Holds>
                  ) : (
                    <div className="grid gap-4">
                      {draftForms.map((draft) => (
                        <Holds
                          key={draft.id}
                          className="bg-slate-50 py-3 px-4 rounded-lg cursor-pointer hover:opacity-90 border-t border-gray-100"
                          onClick={() =>
                            router.push(
                              `/forms/edit/${draft.id}?returnUrl=/forms?tab=inprogress`,
                            )
                          }
                        >
                          <div className="flex flex-col w-full">
                            <Texts
                              position={"left"}
                              size={"sm"}
                              className="font-semibold"
                            >
                              {draft.FormTemplate.name}
                            </Texts>
                            <div className="flex justify-between items-center mt-2">
                              <Texts size={"xs"} className="text-gray-500">
                                Last updated:{" "}
                                {new Date(draft.updatedAt).toLocaleString()}
                              </Texts>
                              <Texts
                                size={"xs"}
                                className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                              >
                                In Progress
                              </Texts>
                            </div>
                          </div>
                        </Holds>
                      ))}
                    </div>
                  )}
                </Holds>
              </TabsContent>
              <TabsContent value="submitted" className="h-full p-4">
                <Holds className="h-full">
                  {/* Submitted Forms
                   - They see entire submitted forms
                   - they should include a basic form status and show the current status
                  */}
                </Holds>
              </TabsContent>
            </Tabs>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
