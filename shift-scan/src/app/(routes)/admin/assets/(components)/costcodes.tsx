"use client";
import {
  AddlistToJobsite,
  createCostCode,
  deleteCostCode,
  EditCostCode,
  fetchByNameCostCode,
  findAllCostCodesByTags,
  RemovelistToJobsite,
  TagCostCodeChange,
} from "@/actions/adminActions";

import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Expands } from "@/components/(reusable)/expands";
import { Forms } from "@/components/(reusable)/forms";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import SearchBar from "@/components/(search)/searchbar";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { costCodes as costCodesTypes, Jobsites } from "@/lib/types";

type Props = {
  costCodes: costCodesTypes[];
  jobsites: Jobsites[];
  setBanner: Dispatch<SetStateAction<string>>;
  setShowBanner: Dispatch<SetStateAction<boolean>>;
};
export default function CostCodes({
  jobsites,
  costCodes,
  setBanner,
  setShowBanner,
}: Props) {
  // edit costcode state
  const [searchTerm1, setSearchTerm1] = useState<string>("");
  // delete costcode state
  const [searchTerm2, setSearchTerm2] = useState<string>("");

  // sets the state for edits in costcode edit section
  const [editForm, setEditForm] = useState<boolean>(true);
  // helps search bar component show items based on user input and filter all items
  const [costCodeList, setCostCodeList] = useState<costCodesTypes[]>(costCodes);
  const [costCodeSelections, setCostCodeSelections] = useState([
    { id: Date.now(), jobsiteId: "", type: "" },
  ]);

  // holds reponse value for the edit to re submit the form with current data filled out.
  const [Response, setResponse] = useState<costCodesTypes | null>(null);
  // array of costcode types of a certain tag
  const [TagsRes, setTagsRes] = useState<costCodesTypes[]>([]);
  const [editTags, setEditTags] = useState<boolean>(true);

  // makes a unique list of costcode types
  const uniqueCostCodes = costCodes.filter(
    (item, index, self) => index === self.findIndex((t) => t.type === item.type)
  );
  // handles search outputs
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const value = e.target.value.toLowerCase();
    if (id === "2") {
      setSearchTerm2(value);
    }
    if (id === "1") {
      setSearchTerm1(value);
    }
    const filteredList = costCodes.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value)
    );
    setCostCodeList(filteredList);
    setEditForm(true);
  };
  // edits the costcode in current db
  async function handleEditForm(id: string, TagsId: string) {
    // this handles the edit form sever action for the second search bar
    setResponse(null);
    if (id === "3") {
      const response = await fetchByNameCostCode(TagsId);
      if (response) {
        setResponse(response as unknown as costCodesTypes); // No need to access the first element of an array
      } else {
        console.log("Error fetching equipment.");
      }
    }
    if (id === "2") {
      const response = await fetchByNameCostCode(searchTerm2);
      if (response) {
        setResponse(response as unknown as costCodesTypes); // No need to access the first element of an array
      } else {
        console.log("Error fetching equipment.");
      }
    }
    // this handles the edit form sever action for the first search bar
    if (id === "1") {
    }
    const response = await fetchByNameCostCode(searchTerm1);
    if (response) {
      setResponse(response as unknown as costCodesTypes);
    } else {
      console.log("Error fetching costcode.");
    }
  }

  async function handleBanner(words: string) {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setShowBanner(true);
    setBanner(words);
    setSearchTerm1("");
    setSearchTerm2("");
    setEditForm(true);
    // Trigger interval to hide the banner after 4 seconds
    const intervalId = setInterval(() => {
      setShowBanner(false);
      setBanner("");
      clearInterval(intervalId);
      setResponse(null);
      setTagsRes([]);
      setEditTags(true);
    }, 4000);
  }

  async function handleTags(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const costCodes = await findAllCostCodesByTags(formData);
    setTagsRes(costCodes);
    setEditTags(false);
    setResponse(null);
  }

  const deleteCostCodeSelect = (id: number) => {
    setCostCodeSelections(
      costCodeSelections.filter((selection) => selection.id !== id)
    );
  };

  const addMoreCostCode = () => {
    setCostCodeSelections([
      ...costCodeSelections,
      { id: Date.now(), jobsiteId: "", type: "" },
    ]);
  };

  const handleSelectChange = (index: number, value: string) => {
    const updatedSelections = costCodeSelections.map((selection, i) =>
      i === index ? { ...selection, type: value } : selection
    );
    setCostCodeSelections(updatedSelections);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const jobsiteId = formData.get("jobsiteId") as string;
    const costCodes = costCodeSelections.map((selection) => selection.type);
    formData.append("jobsiteId", jobsiteId);
    formData.append("types", costCodes.filter((code) => code !== "").join(","));

    await AddlistToJobsite(formData);
  };

  const disconnect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const jobsiteId = formData.get("jobsiteId") as string;
    const costCodes = costCodeSelections.map((selection) => selection.type);
    formData.append("jobsiteId", jobsiteId);
    formData.append("types", costCodes.filter((code) => code !== "").join(","));

    await RemovelistToJobsite(formData);
  };

  return (
    <>
      {/* We will mostlikly get ride of this section later on */}
      <Contents>
        <Expands title="All in DB Cost Codes" divID={"1"}>
          <Contents>
            {costCodes.map((costCode: costCodesTypes) => (
              <ul key={costCode.id}>
                <li>
                  {costCode.name} {costCode.description}
                </li>
              </ul>
            ))}
          </Contents>
        </Expands>
      </Contents>
      {/*Form for creating cost codes*/}
      <Contents>
        <Expands title="Create Cost Codes" divID={"2"}>
          <Forms
            action={createCostCode}
            onSubmit={() => handleBanner("Created Successfully")}
          >
            <Labels type="">Cost Code *</Labels>
            <Inputs type="text" name="name" required />

            <Labels type="">Cost Code Description *</Labels>
            <Inputs type="text" name="description" required />

            <Labels type="">Cost code Tag *</Labels>
            <Inputs type="text" name="type" required />

            <Buttons background="green" type="submit">
              <Texts>Create Jobsite</Texts>
            </Buttons>
          </Forms>
        </Expands>
      </Contents>
      {/*Form for creating cost codes*/}
      <Contents>
        <Expands title="Edit Cost Codes" divID={"3"}>
          <Contents>
            <SearchBar
              selected={false}
              searchTerm={searchTerm1}
              onSearchChange={(e) => handleSearchChange(e, "1")}
              placeholder="Search for cost code..."
            />
          </Contents>
          {/* Display Search options for editing cost codes if search term is not empty and form is not in edit mode*/}
          {searchTerm1 && editForm && (
            <ul>
              {costCodeList.map((item) => (
                <Buttons
                  background="orange"
                  onClick={() => {
                    setSearchTerm1(item.description);
                    setEditForm(false);
                  }}
                  key={item.id}
                >
                  <Texts>
                    {item.name} ({item.description})
                  </Texts>
                </Buttons>
              ))}
            </ul>
          )}
          {/*Displays edit submit button when reponse is null*/}
          {Response === null && (
            <Buttons
              background="orange"
              onClick={() => handleEditForm("1", "")}
            >
              <Texts>Search</Texts>
            </Buttons>
          )}
          {/* Display the form for editing the selected equipment */}
          {Response !== null && !editForm && (
            <Forms
              action={EditCostCode}
              onSubmit={() => handleBanner("update Successfully")}
            >
              <Inputs type="text" name="id" hidden defaultValue={Response.id} />

              <Labels type="">Cost Code *</Labels>
              <Inputs
                type="text"
                name="name"
                defaultValue={Response.name}
                required
              />

              <Labels type="">Cost Code Description *</Labels>
              <Inputs
                type="text"
                name="description"
                defaultValue={Response.description}
                required
              />

              <Labels type="">Cost code Tag *</Labels>
              <Inputs
                type="text"
                name="type"
                defaultValue={Response.type}
                required
              />

              <Buttons background="green" type="submit">
                <Texts>Edit</Texts>
              </Buttons>
            </Forms>
          )}
        </Expands>
      </Contents>

      {/*Form for deleting cost codes*/}

      <Contents>
        <Expands title="Delete Cost Codes" divID={"4"}>
          <Contents>
            <SearchBar
              selected={false}
              searchTerm={searchTerm2}
              onSearchChange={(e) => handleSearchChange(e, "2")}
              placeholder="Search equipment..."
            />
          </Contents>

          {/* Displays the list of delete options if there is a search term and form is not in edit mode*/}

          {searchTerm2 && editForm && (
            <ul>
              {costCodeList.map((item) => (
                <Buttons
                  background="orange"
                  onClick={() => {
                    setSearchTerm2(item.description);
                    setEditForm(false);
                  }}
                  key={item.id}
                >
                  <Texts>
                    {item.name} ({item.description})
                  </Texts>
                </Buttons>
              ))}
            </ul>
          )}

          {/*Displays edit submit button when reponse is null*/}

          {Response === null && (
            <Buttons
              background="orange"
              onClick={() => handleEditForm("2", "")}
            >
              <Texts>Search</Texts>
            </Buttons>
          )}

          {/* Display the form for editing the selected equipment */}

          {Response !== null && !editForm && (
            <Forms
              action={deleteCostCode}
              onSubmit={() => handleBanner("Deleted jobsite Successfully")}
            >
              <Labels type="">
                Are you sure you want to delete this cost code?
              </Labels>
              <Inputs type="hidden" name="id" defaultValue={Response.id} />
              <Buttons background={"red"} type="submit">
                <Texts>Yes Delete</Texts>
              </Buttons>
            </Forms>
          )}
        </Expands>
      </Contents>
      {/**************************************************************************/}

      {/*will be an interactive table of cost codes under jobs, we will then assign costcodes by a list to a jobsite
    type is how we can filter the costcodes its a string for now */}

      {/**************************************************************************/}

      <Contents>
        <Expands title="Tag Costcodes to Jobs" divID={"5"}>
          <Contents>
            {/*step 1: Display the option created by the user*/}
            <Forms onSubmit={handleTags}>
              {" "}
              {/* setTagsRes() & setEditForm(false) , setEditTags(false); */}
              <Labels>Select Cost Code Type</Labels>
              <Selects
                name="type"
                onChange={(e) => {
                  e.currentTarget.form?.requestSubmit();
                }}
              >
                <option value="default">Select Cost Code Type</option>
                {uniqueCostCodes.map((item, index) => (
                  <option key={index} value={item.type}>
                    {item.type}
                  </option>
                ))}
              </Selects>
            </Forms>
          </Contents>

          {/* Displays the list of costcodes if there is a search term and form is not in edit mode*/}
          {Response === null && (
            <Contents>
              {editTags == false && (
                <ul>
                  {TagsRes.map((item) => (
                    <Buttons
                      background="orange"
                      key={item.id}
                      onClick={() => {
                        handleEditForm("3", item.description);
                      }}
                    >
                      <Texts>
                        {item.name} ({item.description})
                      </Texts>
                    </Buttons>
                  ))}
                </ul>
              )}
            </Contents>
          )}

          {/*Displays a form to change costcodes tags*/}
          <Contents>
            {Response !== null && !editTags && (
              <>
                <Contents>
                  <Buttons
                    background="orange"
                    onClick={() => {
                      setEditTags(false);
                      handleEditForm("3", "");
                    }}
                  >
                    <Images titleImg="/backArrow.svg" titleImgAlt="search" />
                  </Buttons>
                </Contents>

                <Forms
                  action={TagCostCodeChange}
                  onSubmit={() => handleBanner("Tagged Successfully changed")}
                >
                  <Inputs type="hidden" name="id" defaultValue={Response.id} />

                  <Labels type="">Cost Code Id *</Labels>
                  <Inputs
                    type="text"
                    name="costCode"
                    defaultValue={Response.name}
                    state="disabled"
                  />
                  <Labels type="">Cost Code Description*</Labels>
                  <Inputs
                    type="text"
                    name="description"
                    defaultValue={Response.description}
                    state="disabled"
                  />

                  <Inputs
                    type="text"
                    name="type"
                    defaultValue={Response.type}
                  />

                  <Buttons background="green" type="submit">
                    <Texts>Tag</Texts>
                  </Buttons>
                </Forms>
              </>
            )}
          </Contents>
        </Expands>
      </Contents>
      <Contents>
        <Expands title="Assign Costcodes to Job Sites" divID={"6"}>
          <Contents>
            <Forms
              onSubmit={() => {
                handleBanner("Assigned Costcodes Successfully");
                handleSubmit;
              }}
            >
              {/* Jobsite Selection */}
              <Labels>Select Jobsite</Labels>
              <Selects name="id" required>
                <option value="default">Select Jobsite</option>
                {jobsites.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name + " - " + item.id}
                  </option>
                ))}
              </Selects>

              {/* Dynamic Cost Code Selections */}
              <Labels>Select Cost Code Type</Labels>
              {costCodeSelections.map((selection, index) => (
                <Contents key={index}>
                  <Selects
                    name={`type${index}`}
                    value={selection.type}
                    onChange={(e) => handleSelectChange(index, e.target.value)}
                    required
                  >
                    <option value="default">Select Cost Code Type</option>
                    {costCodes.map((item) => (
                      <option key={item.id} value={item.type}>
                        {item.type}
                      </option>
                    ))}
                  </Selects>
                  {costCodeSelections.length > 1 && (
                    <Buttons
                      background="red"
                      type="button"
                      onClick={() => deleteCostCodeSelect(selection.id)}
                    >
                      <Texts>-</Texts>
                    </Buttons>
                  )}
                </Contents>
              ))}

              {/* Buttons */}
              <Contents>
                <Buttons background="red" type="submit">
                  <Texts>Assign List to Jobsite</Texts>
                </Buttons>
                <Buttons
                  background="green"
                  type="button"
                  onClick={addMoreCostCode}
                >
                  <Texts>Add</Texts>
                </Buttons>
              </Contents>
            </Forms>
          </Contents>
        </Expands>
      </Contents>

      <Contents>
        <Expands title="Unassign Costcodes from Job Sites" divID={"7"}>
          <Contents>
            <Forms
              onSubmit={() => {
                handleBanner("Unassigned Costcodes Successfully");
                disconnect;
              }}
            >
              {/* Jobsite Selection */}
              <Labels>Select Jobsite</Labels>
              <Selects name="id" required>
                <option value="default">Select Jobsite</option>
                {jobsites.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name + " - " + item.id}
                  </option>
                ))}
              </Selects>

              {/* Dynamic Cost Code Selections */}
              <Labels>Select Cost Code Type</Labels>
              {costCodeSelections.map((selection, index) => (
                <Contents key={index}>
                  <Selects
                    name={`type${index}`}
                    value={selection.type}
                    onChange={(e) => handleSelectChange(index, e.target.value)}
                    required
                  >
                    <option value="default">Select Cost Code Type</option>
                    {costCodes.map((item) => (
                      <option key={item.id} value={item.type}>
                        {item.type}
                      </option>
                    ))}
                  </Selects>
                  {costCodeSelections.length > 1 && (
                    <Buttons
                      background="red"
                      type="button"
                      onClick={() => deleteCostCodeSelect(selection.id)}
                    >
                      <Texts>-</Texts>
                    </Buttons>
                  )}
                </Contents>
              ))}

              {/* Buttons */}
              <Contents>
                <Buttons background="red" type="submit">
                  <Texts>Unassign List to Jobsite</Texts>
                </Buttons>
                <Buttons
                  background="green"
                  type="button"
                  onClick={addMoreCostCode}
                >
                  <Texts>Add</Texts>
                </Buttons>
              </Contents>
            </Forms>
          </Contents>
        </Expands>
      </Contents>
    </>
  );
}
