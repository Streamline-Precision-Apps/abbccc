"use client";

import {
  createJobsite,
  deleteJobsite,
  editGeneratedJobsite,
  fetchByNameJobsite,
  updateJobsite,
} from "@/actions/adminActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Expands } from "@/components/(reusable)/expands";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";

import { Texts } from "@/components/(reusable)/texts";

import SearchBar from "@/components/(search)/searchbar";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import { ChangeEvent, useState } from "react";
import { Jobsites as JobsiteType } from "@/lib/types";

type Props = {
  jobsites: JobsiteType[];
  setBanner: Dispatch<SetStateAction<string>>;
  setShowBanner: Dispatch<SetStateAction<boolean>>;
};
export default function Jobsite({ jobsites, setBanner, setShowBanner }: Props) {
  const formRef = React.createRef<HTMLFormElement>();
  const t = useTranslations("admin-assets-jobsite");
  const [searchTerm1, setSearchTerm1] = useState<string>("");
  const [searchTerm2, setSearchTerm2] = useState<string>("");
  const [jobsiteList, setJobsiteList] = useState<JobsiteType[]>(jobsites);
  const [Response, setResponse] = useState<JobsiteType | null>(null);
  const [editForm, setEditForm] = useState<boolean>(true);

  // Reset the form when the modal is closed

  const handleSearchChange = (
    e: ChangeEvent<HTMLInputElement>,
    qrId: string
  ) => {
    const value = e.target.value.toLowerCase();
    if (qrId === "2") {
      setSearchTerm2(value);
    }
    if (qrId === "1") {
      setSearchTerm1(value);
    }
    const filteredList = jobsites.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.qrId.toLowerCase().includes(value)
    );
    setJobsiteList(filteredList);
    setEditForm(true);
  };

  async function handleEditForm(qrId: string) {
    setEditForm(false);
    if (qrId === "2") {
      const response = await fetchByNameJobsite(searchTerm2);
      if (response) {
        setResponse(response as unknown as JobsiteType); // No need to access the first element of an array
      } else {
        console.log("Error fetching equipment.");
      }
    }
    if (qrId === "1") {
    }
    const response = await fetchByNameJobsite(searchTerm1);
    if (response) {
      setResponse(response as unknown as JobsiteType); // No need to access the first element of an array
    } else {
      console.log("Error fetching equipment.");
    }
  }

  async function handleBanner(words: string) {
    setShowBanner(true);
    setBanner(words);
    setSearchTerm1("");
    setSearchTerm2("");
    setEditForm(true);
    // Trigger interval to hqrIde the banner after 4 seconds
    const intervalId = setInterval(() => {
      setShowBanner(false);
      setBanner("");
      clearInterval(intervalId);
      window.location.reload();
    }, 4000);
  }

  return (
    <>
      <Contents>
        <Expands title="Active Jobsites" divID={"1"}>
          <Contents>
            <table>
              <thead>
                <tr>
                  <th>{t("JobsiteName")}</th>
                  <th>{t("StreetNumber")}</th>
                  <th>{t("StreetName")}</th>
                  <th>{t("City")}</th>
                  <th>{t("State")}</th>
                  <th>{t("Country")}</th>
                  <th>{t("IsActive")}</th>
                </tr>
              </thead>
              <tbody>
                {jobsites.map((jobsite) => (
                  <tr key={jobsite.qrId}>
                    {jobsite.isActive ? (
                      <>
                        <td>{jobsite.name}</td>
                        <td>{jobsite.streetNumber}</td>
                        <td>{jobsite.streetName}</td>
                        <td>{jobsite.city}</td>
                        <td>{jobsite.state}</td>
                        <td>{jobsite.country}</td>
                        <td>{jobsite.isActive ? "Active" : "Inactive"}</td>
                      </>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </Contents>
        </Expands>
      </Contents>
      {/* This section is used to create a new jobsite */}
      <Contents>
        <Expands title="Create New Jobsite" divID={"2"}>
          <Forms
            action={createJobsite}
            onSubmit={() => handleBanner("Created Successfully")}
          >
            <Labels type="">{t("JobsiteName")} *</Labels>
            <Inputs type="text" name="name" required />

            <Labels type="">{t("StreetNumber")} *</Labels>
            <Inputs type="text" name="streetNumber" required />

            <Labels type="">{t("StreetName")} *</Labels>
            <Inputs type="text" name="streetName" required />

            <Labels type="">{t("City")}*</Labels>
            <Inputs type="text" name="city" required />

            <Labels type="">{t("State")} *</Labels>
            <Inputs type="text" name="state" required />

            <Labels type="">{t("Country")} *</Labels>
            <Inputs type="text" name="country" required />

            <Labels type="">{t("Description")} *</Labels>
            <Inputs type="text" name="description" required />

            <Labels type="">{t("Comments")} *</Labels>
            <Inputs type="text" name="comments" required />

            <Buttons background={"green"} type="submit">
              <Texts>Create Jobsite</Texts>
            </Buttons>
          </Forms>
        </Expands>
      </Contents>
      {/* This section is used to search and update an existing  jobsite */}
      <Contents>
        <Expands title="Edit Existing Jobsite" divID={"3"}>
          <Contents>
            <SearchBar
              selected={false}
              searchTerm={searchTerm1}
              onSearchChange={(e) => handleSearchChange(e, "1")}
              placeholder="Search equipment..."
            />
          </Contents>
          {searchTerm1 && editForm && (
            <ul>
              {jobsiteList.map((item) => (
                <Buttons
                  background={"orange"}
                  onClick={() => {
                    setSearchTerm1(item.name);
                    setEditForm(false);
                  }}
                  key={item.qrId}
                >
                  <Texts>
                    {item.name} ({item.qrId})
                  </Texts>
                </Buttons>
              ))}
            </ul>
          )}
          {Response === null && (
            <Buttons background={"orange"} onClick={() => handleEditForm("1")}>
              <Texts>Search</Texts>
            </Buttons>
          )}
          {/* Display the form for editing the selected equipment */}
          {Response !== null && !editForm && (
            <Forms
              action={updateJobsite}
              onSubmit={() => handleBanner("Updated Successfully")}
            >
              <Inputs
                type="text"
                name="qrId"
                hidden
                defaultValue={Response.qrId}
              />

              <Labels type="">{t("IsActive")} *</Labels>
              <Inputs
                type="checkbox"
                defaultValue={Response.isActive ? "true" : "false"}
                name="isActive"
              />

              <Labels type="">{t("JobsiteName")} *</Labels>
              <Inputs
                type="text"
                defaultValue={Response.name}
                name="name"
                required
              />

              <Labels type="">{t("StreetNumber")} *</Labels>
              <Inputs
                type="text"
                name="streetNumber"
                defaultValue={Response.streetNumber ?? " "}
                required
              />

              <Labels type="">{t("StreetName")} *</Labels>
              <Inputs
                type="text"
                name="streetName"
                defaultValue={Response.streetName ?? " "}
                required
              />

              <Labels type="">{t("City")}*</Labels>
              <Inputs
                type="text"
                name="city"
                defaultValue={Response.city ?? " "}
                required
              />

              <Labels type="">{t("State")} *</Labels>
              <Inputs
                type="text"
                name="state"
                defaultValue={Response.state ?? " "}
                required
              />

              <Labels type="">{t("Country")} *</Labels>
              <Inputs
                type="text"
                name="country"
                defaultValue={Response.country ?? " "}
                required
              />

              <Labels type="">{t("Description")} *</Labels>
              <Inputs
                type="text"
                name="description"
                defaultValue={Response.description ?? " "}
                required
              />

              <Labels type="">{t("Comments")} *</Labels>
              <Inputs
                type="text"
                name="comments"
                defaultValue={Response.comment ?? " "}
                required
              />

              <Buttons background={"orange"} type="submit">
                <Texts>Edit Selected Job Site</Texts>
              </Buttons>
            </Forms>
          )}
        </Expands>
      </Contents>

      {/* Delete Existing Jobsites */}
      <Contents>
        <Expands title="Delete Existing Jobsite" divID={"4"}>
          <Contents>
            <SearchBar
              selected={false}
              searchTerm={searchTerm2}
              onSearchChange={(e) => handleSearchChange(e, "2")}
              placeholder="Search equipment..."
            />
          </Contents>
          {searchTerm2 && editForm && (
            <ul>
              {jobsiteList.map((item) => (
                <Buttons
                  background={"orange"}
                  onClick={() => {
                    setSearchTerm2(item.name);
                    setEditForm(false);
                  }}
                  key={item.qrId}
                >
                  <Texts>
                    {item.name} ({item.qrId})
                  </Texts>
                </Buttons>
              ))}
            </ul>
          )}
          {Response === null && (
            <Buttons background={"orange"} onClick={() => handleEditForm("2")}>
              <Texts>Search</Texts>
            </Buttons>
          )}
          {/* Display the form for editing the selected equipment */}
          {Response !== null && !editForm && (
            <Forms
              action={deleteJobsite}
              onSubmit={() => handleBanner("Deleted jobsite Successfully")}
            >
              <Inputs
                type="hqrIdden"
                name="qrId"
                defaultValue={Response.qrId}
              />
              <Buttons background={"orange"} type="submit">
                Delete Equipment
              </Buttons>
            </Forms>
          )}
        </Expands>
      </Contents>
      {/* Add New Jobsite */}
      <Contents>
        <Expands title="Edit Existing Jobsite" divID={"5"}>
          {jobsites.filter((item) => item.qrId.slice(0, 3) === "J-T").length >
          0 ? (
            <>
              <Texts className="bg-app-orange">
                Banner appears when Equipment is Created from QR Generator.
                Please Edit the Temporary Equipment to a Permanent Equipment.
              </Texts>
            </>
          ) : null}

          <ul>
            {jobsiteList.map((item) =>
              item.qrId.slice(0, 3) === "J-T" ? (
                <Buttons
                  onClick={() => {
                    setSearchTerm2(item.name);
                    setResponse(item);
                  }}
                  key={item.qrId}
                >
                  {item.name} ({item.qrId})
                </Buttons>
              ) : null
            )}
          </ul>
          {jobsites.filter((item) => item.qrId.slice(0, 3) === "J-T").length >
          0 ? (
            <>
              {/* Display the form for editing the selected equipment */}
              <Forms
                action={editGeneratedJobsite}
                onSubmit={() => handleBanner("Edited jobsite Successfully")}
              >
                <Inputs
                  type="hqrIdden"
                  name="qrId"
                  defaultValue={Response?.qrId}
                />

                <Labels type="">Previous {t("JobsiteID")} </Labels>
                <Inputs disabled defaultValue={Response?.qrId} />

                <Labels type="">{t("JobsiteID")} </Labels>
                <Inputs
                  type="text"
                  defaultValue={Response?.qrId}
                  name="qrId"
                  required
                />

                <Labels type="">Previous {t("JobsiteName")}</Labels>
                <Inputs disabled readOnly defaultValue={Response?.name} />

                <Labels type="">{t("JobsiteName")} *</Labels>
                <Inputs
                  type="text"
                  defaultValue={Response?.name}
                  name="name"
                  required
                />

                <Buttons background={"orange"} type="submit">
                  Edit Equipment
                </Buttons>
              </Forms>
            </>
          ) : (
            <Texts>No Jobsites with Temporary ID</Texts>
          )}
        </Expands>
      </Contents>
    </>
  );
}
