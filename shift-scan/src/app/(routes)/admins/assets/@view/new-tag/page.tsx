"use client";
import { changeTags, createTag } from "@/actions/adminActions";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { CCTags, costCodesTag, JobTags } from "@/lib/types";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

export default function NewTagView() {
  const [editedItem, setEditedItem] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [jobs, setJobs] = useState<JobTags[]>();
  const [costCodes, setCostCodes] = useState<costCodesTag[]>();
  const [initialSelectedJobs, setInitialSelectedJobs] = useState<JobTags[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<JobTags[]>([]);
  const [initialSelectedCostCodes, setInitialSelectedCostCodes] = useState<
    costCodesTag[]
  >([]);
  const [selectedCostCodes, setSelectedCostCodes] = useState<costCodesTag[]>(
    []
  );

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/getAllJobsites");
        const jobs = (await response.json()) as JobTags[];
        setJobs(jobs ?? []);
        //cost codes
        const response2 = await fetch("/api/getAllCostCodes");
        const costCodes = (await response2.json()) as costCodesTag[];
        setCostCodes(costCodes ?? []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchJobs();
  }, []);

  const toggleJobSelection = (job: JobTags) => {
    setSelectedJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) {
        return prev.filter((j) => j.id !== job.id); // Remove if already selected
      } else {
        return [...prev, job]; // Add if not selected
      }
    });
  };

  const toggleCostCodeSelection = (costCode: costCodesTag) => {
    setSelectedCostCodes((prev) => {
      if (prev.some((cc) => cc.id === costCode.id)) {
        return prev.filter((cc) => cc.id !== costCode.id); // Remove if already selected
      } else {
        return [...prev, costCode]; // Add if not selected
      }
    });
  };
  const handleCreateTag = async () => {
    try {
      const payload = {
        name: editedItem,
        description: commentText,
        jobs: selectedJobs
          .filter(
            (job) =>
              !initialSelectedJobs.some((initJob) => initJob.id === job.id)
          )
          .map((job) => job.id), // IDs of jobs to add

        costCodes: selectedCostCodes
          .filter(
            (costCodes) =>
              !initialSelectedCostCodes.some((c) => c.id === costCodes.id)
          )
          .map((cc) => cc.id), // IDs of costCodes to add
      };

      // Call changeTags with JSON payload
      const response = await createTag(payload);
      if (response) {
        setEditedItem(editedItem);
        setCommentText(commentText);
        setSelectedJobs([]);
        setSelectedCostCodes([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Holds className="w-full h-full ">
      <ReusableViewLayout
        custom={true}
        header={
          <EditTagHeader
            editedItem={editedItem}
            commentText={commentText}
            editFunction={setEditedItem}
            editCommentFunction={setCommentText}
          />
        }
        mainHolds="h-full w-full flex flex-row row-span-6 col-span-2 bg-app-dark-blue px-4 py-2 rounded-[10px] gap-4"
        mainLeft={
          <EditTagMainLeft
            toggleJobSelection={toggleJobSelection}
            toggleCostCodeSelection={toggleCostCodeSelection}
            jobs={jobs ?? []}
            costCodes={costCodes ?? []}
            selectedJobs={selectedJobs}
            selectedCostCodes={selectedCostCodes}
          />
        }
        mainRight={
          <EditTagMainRight
            selectedJobs={selectedJobs}
            selectedCostCodes={selectedCostCodes}
          />
        }
        footer={<EditTagFooter handleEditForm={handleCreateTag} />}
      />
    </Holds>
  );
}

export function EditTagHeader({
  editedItem,
  commentText,
  editFunction,
  editCommentFunction,
}: {
  editedItem: string;
  commentText: string;
  editFunction?: Dispatch<SetStateAction<string>>;
  editCommentFunction?: Dispatch<SetStateAction<string>>;
}) {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

  const openComment = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };
  return (
    <Holds
      background={"white"}
      className={`w-full h-full col-span-2 ${
        isCommentSectionOpen ? "row-span-3" : "row-span-1"
      }`}
    >
      {isCommentSectionOpen ? (
        <Contents width={"95"} position={"row"}>
          <Grids
            rows={"5"}
            cols={"5"}
            gap={"2"}
            className=" h-full w-full py-4"
          >
            <Holds className="w-full row-start-1 row-end-2 col-start-1 col-end-4">
              <Inputs
                type="text"
                value={editedItem}
                onChange={(e) => {
                  editFunction?.(e.target.value);
                }}
                placeholder={"Edit Tag Name"}
                variant={"titleFont"}
                className=" my-auto"
              />
            </Holds>
            <Holds
              position={"row"}
              className="h-full w-full my-1 row-start-2 row-end-3 col-start-1 col-end-2 "
            >
              <Texts size={"p6"} className="mr-2">
                {"Comment"}
              </Texts>
              <Images
                titleImg="/comment.svg"
                titleImgAlt="comment"
                size={"30"}
                onClick={openComment}
                className="cursor-pointer hover:shadow-black hover:shadow-md"
              />
            </Holds>

            <Holds className="w-full h-full row-start-3 row-end-6 col-start-1 col-end-6">
              <TextAreas
                placeholder="Enter your comment"
                value={commentText ? commentText : ""}
                onChange={(e) => {
                  editCommentFunction?.(e.target.value);
                }}
                maxLength={40}
                rows={4}
                style={{ resize: "none" }}
              />
            </Holds>
          </Grids>
        </Contents>
      ) : (
        <Grids rows={"2"} cols={"5"} className=" h-full w-full p-4">
          <Holds className="w-full row-start-1 row-end-3 col-start-1 col-end-4 ">
            <Inputs
              type="text"
              value={editedItem}
              placeholder={"Enter your Crew Name"}
              onChange={(e) => {
                editFunction?.(e.target.value);
              }}
              variant={"titleFont"}
              className=" my-auto"
            />
          </Holds>
          <Holds
            position={"row"}
            className="h-full w-full row-start-2 row-end-3 col-start-6 col-end-7 "
          >
            <Texts size={"p6"} className="mr-2">
              Comment
            </Texts>
            <Images
              titleImg="/comment.svg"
              titleImgAlt="comment"
              size={"40"}
              onClick={openComment}
              className="cursor-pointer hover:shadow-black hover:shadow-md"
            />
          </Holds>
        </Grids>
      )}
    </Holds>
  );
}

export function EditTagMainLeft({
  toggleJobSelection,
  toggleCostCodeSelection,
  jobs,
  costCodes,
  selectedJobs,
  selectedCostCodes,
}: {
  toggleJobSelection: (job: JobTags) => void;
  toggleCostCodeSelection: (costCode: costCodesTag) => void;
  jobs: JobTags[];
  costCodes: costCodesTag[];
  selectedJobs: JobTags[];
  selectedCostCodes: costCodesTag[];
}) {
  const [term, setTerm] = useState<string>("");
  const [activeList, setActiveList] = useState<"jobs" | "costCodes">("jobs");

  const filteredCostCodes = useMemo(() => {
    return costCodes.filter(
      (cc) =>
        cc.description.toLowerCase().includes(term.toLowerCase()) ||
        cc.name.toLowerCase().includes(term.toLowerCase())
    );
  }, [term, costCodes]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((tag) =>
      tag.name.toLowerCase().includes(term.toLowerCase())
    );
  }, [term, jobs]);
  return (
    <Holds background="white" className="w-full h-full p-4">
      <Grids rows="10" gap="5" className="h-full">
        <Holds
          position={"row"}
          background={"white"}
          className="row-span-2 h-full gap-4 border-[3px] rounded-[15px] border-black"
        >
          <Holds
            background={activeList === "jobs" ? "lightBlue" : "white"}
            className="w-[50%] h-full justify-center "
            onClick={() => setActiveList("jobs")}
          >
            <Texts size={"p6"}>Jobsite</Texts>
          </Holds>
          <Holds
            background={activeList === "costCodes" ? "lightBlue" : "white"}
            className="w-[50%] h-full justify-center "
            onClick={() => setActiveList("costCodes")}
          >
            <Texts size={"p6"}>Cost Code</Texts>
          </Holds>
        </Holds>

        <Holds className="row-span-8 h-full border-[3px] border-black rounded-t-[10px]">
          <Holds position="row" className="py-2 border-b-[3px] border-black">
            <Holds className="h-full w-[20%]">
              <Images titleImg="/magnifyingGlass.svg" titleImgAlt="search" />
            </Holds>
            <Holds className="w-[80%]">
              <Inputs
                type="search"
                placeholder="Search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="border-none outline-none"
              />
            </Holds>
          </Holds>

          {activeList === "costCodes" ? (
            <Holds className="h-full mb-4 overflow-y-auto no-scrollbar">
              {filteredCostCodes.map((costCode) => (
                <Holds
                  key={costCode.id}
                  className="py-2 border-b cursor-pointer flex items-center"
                >
                  <Holds position={"row"} className="justify-between">
                    <Holds className="flex w-2/3">
                      <Texts size="p6">{`${costCode.name} ${costCode.description}`}</Texts>
                    </Holds>
                    <Holds position="row" className="relative flex w-1/3">
                      <CheckBox
                        id={costCode.id.toString()}
                        checked={selectedCostCodes.some(
                          (c) => c.id === costCode.id
                        )}
                        onChange={() => toggleCostCodeSelection(costCode)}
                        size={2}
                        name={costCode.name}
                        aria-label={`Toggle tag ${costCode.name}`}
                      />
                    </Holds>
                  </Holds>
                </Holds>
              ))}
            </Holds>
          ) : (
            <Holds className="h-full mb-4 overflow-y-auto no-scrollbar">
              {filteredJobs.map((job) => (
                <Holds
                  key={job.id}
                  className="py-2 border-b cursor-pointer flex items-center"
                >
                  <Holds position={"row"} className="justify-between">
                    <Holds className="flex w-2/3">
                      <Texts size="p6">{job.name}</Texts>
                    </Holds>
                    <Holds position="row" className="relative flex w-1/3">
                      <CheckBox
                        id={job.id.toString()}
                        checked={selectedJobs.some((j) => j.id === job.id)}
                        onChange={() => toggleJobSelection(job)}
                        size={2}
                        name={job.name}
                        aria-label={`Toggle tag ${job.name}`}
                      />
                    </Holds>
                  </Holds>
                </Holds>
              ))}
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}

export function EditTagMainRight({
  selectedJobs,
  selectedCostCodes,
}: {
  selectedJobs: JobTags[];
  selectedCostCodes: costCodesTag[];
}) {
  return (
    <Holds background={"white"} className="w-full h-full">
      <Grids rows={"2"} gap={"2"} className="w-full h-full p-2">
        <Holds className="row-start-1 row-end-2 h-full bg-slate-200 rounded-[10px] overflow-y-auto no-scrollbar">
          {/* Flex container with flex-wrap */}
          <Holds className="flex flex-row flex-wrap gap-2 w-full p-2 ">
            {selectedJobs.map((item, index) => (
              <Holds
                key={index}
                className="w-fit h-fit p-1 bg-white border-[3px] border-black rounded-[10px] "
              >
                <Texts size={"p6"}>{item.name}</Texts>
              </Holds>
            ))}
          </Holds>
        </Holds>
        <Holds className="row-start-2 row-end-3 h-full bg-slate-200 rounded-[10px] overflow-y-auto no-scrollbar">
          {/* Flex container with flex-wrap */}
          <Holds className="flex flex-row flex-wrap gap-2 w-full p-2  ">
            {selectedCostCodes.map((item, index) => (
              <Holds
                key={index}
                className="w-fit h-fit p-1 bg-white border-[3px] border-black rounded-[10px] "
              >
                <Texts size={"p6"}>{item.description}</Texts>
              </Holds>
            ))}
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
export function EditTagFooter({
  handleEditForm,
}: {
  handleEditForm: () => void;
}) {
  return (
    <Holds
      background={"white"}
      className="w-full h-full row-span-1 col-span-2 "
    >
      <Grids cols={"4"} gap={"4"} className="w-full h-full p-4">
        <Holds className="col-start-4 col-end-5 ">
          <Buttons
            className={"py-2 bg-app-green"}
            onClick={() => handleEditForm()}
          >
            <Titles size={"h4"}>Create Tag</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
