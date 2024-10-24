"use client";

import { Texts } from "@/components/(reusable)/texts";
import { Forms } from "@/components/(reusable)/forms";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import {
  createEquipment,
  deleteEquipmentbyId,
  fetchByNameEquipment,
  updateEquipment,
  updateEquipmentID,
} from "@/actions/equipmentActions";
import SearchBar from "@/components/(search)/searchbar";

import { Contents } from "@/components/(reusable)/contents";

import { Titles } from "@/components/(reusable)/titles";

import { Expands } from "@/components/(reusable)/expands";
import { Selects } from "@/components/(reusable)/selects";
import { Options } from "@/components/(reusable)/options";
import { TextAreas } from "@/components/(reusable)/textareas";
import type { Equipment } from "@/lib/types";

type Props = {
  equipment: Equipment[];
  setBanner: Dispatch<SetStateAction<string>>;
  setShowBanner: Dispatch<SetStateAction<boolean>>;
};

export default function Equipment({
  equipment,
  setBanner,
  setShowBanner,
}: Props) {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(equipment);
  const [searchTerm1, setSearchTerm1] = useState<string>("");
  const [searchTerm2, setSearchTerm2] = useState<string>("");
  const [editForm, setEditForm] = useState<boolean>(true);
  const [equipmentResponse, setEquipmentResponse] = useState<Equipment | null>(
    null
  );
  const [equipmentTag, setEquipmentTag] = useState<string>("EQUIPMENT");
  const t = useTranslations("addEquipmentForm");
  const [qrId, setQrId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [licensePlate, setLicensePlate] = useState<string>("");
  const [registrationExpiration, setRegistrationExpiration] =
    useState<string>("");
  const [mileage, setMileage] = useState<string>("");

  // Handle form changes mainly the search feature for getting the equipment by name and setting the target value to that equipment
  const resetForm = () => {
    setQrId("");
    setEquipmentTag("EQUIPMENT");
    setName("");
    setDescription("");
    setStatus("");
    setMake("");
    setModel("");
    setYear("");
    setLicensePlate("");
    setRegistrationExpiration("");
    setMileage("");
  };
  // ths handler enables us to search for the equipment by name. We then can select the item from the list and set it as the target value
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const value = e.target.value.toLowerCase();
    if (id === "2") {
      setSearchTerm2(value);
    } else {
      setSearchTerm1(value);
    }
    const filteredList = equipment.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.qrId.toLowerCase().includes(value)
    );
    setEquipmentList(filteredList);
    setEditForm(true);
  };

  // this lets us do the server action and provides error handling if there is an error
  async function handleEditForm(id: string) {
    setEditForm(false);
    if (id === "2") {
      const response = await fetchByNameEquipment(searchTerm2);
      if (response) {
        setEquipmentResponse(response as unknown as Equipment); // No need to access the first element of an array
      } else {
        console.log("Error fetching equipment.");
      }
    } else {
      const response = await fetchByNameEquipment(searchTerm1);
      if (response) {
        setEquipmentResponse(response as unknown as Equipment); // No need to access the first element of an array
      } else {
        console.log("Error fetching equipment.");
      }
    }
  }
  async function handleBanner(words: string) {
    setShowBanner(true);
    setBanner(words);
    setSearchTerm1("");
    setSearchTerm2("");
    setEditForm(true);
    // Trigger interval to hide the banner after 4 seconds
    const intervalId = setInterval(() => {
      setShowBanner(false);
      setBanner("");
      resetForm();
      clearInterval(intervalId);
    }, 4000);
  }

  return (
    <>
      <Contents>
        <Expands title="Create New Equipment" divID={"1"}>
          <Forms
            action={createEquipment}
            onSubmit={() => handleBanner("Equipment was created successfully")}
          >
            <Labels type="title">Equipment Code *</Labels>
            <Inputs
              type="default"
              name="qrId"
              value={qrId}
              onChange={(e) => setQrId(e.target.value)}
              state="default"
            />
            <Labels type="title">{t("Tag")} *</Labels>
            <Selects
              id="equipmentTag"
              name="equipmentTag"
              value={equipmentTag}
              onChange={(e) => setEquipmentTag(e.target.value)}
              className="block w-full border border-black rounded p-2"
            >
              <Options value="">{t("Select")}</Options>
              <Options value="TRUCK">{t("Truck")}</Options>
              <Options value="TRAILER">{t("Trailer")}</Options>
              <Options value="EQUIPMENT">{t("Equipment")}</Options>
            </Selects>

            <Labels type="title">{t("Name")} *</Labels>
            <Inputs
              type="default"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              state="default"
            />

            <Labels type="title">{t("Description")}</Labels>
            <TextAreas
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full border border-black rounded p-2"
            />

            <Labels type="title">{t("Status")} *</Labels>
            <Selects
              id="equipmentStatus"
              name="equipmentStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full border border-black rounded p-2"
            >
              <Options value="">{t("Select")}</Options>
              <Options value="OPERATIONAL">{t("Operational")}</Options>
              <Options value="NEEDS_REPAIR">{t("NeedsRepair")}</Options>
            </Selects>

            {equipmentTag === "TRUCK" || equipmentTag === "TRAILER" ? (
              <>
                <Labels type="title">{t("Make")} *</Labels>
                <Inputs
                  type="default"
                  id="make"
                  name="make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  state="default"
                />
                <Labels type="title">{t("Model")} *</Labels>
                <Inputs
                  type="default"
                  id="model"
                  name="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  state="default"
                />
                <Labels type="title">{t("Year")} *</Labels>
                <Inputs
                  type="default"
                  id="year"
                  name="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  state="default"
                />
                <Labels type="title">{t("LicensePlate")} *</Labels>
                <Inputs
                  type="default"
                  id="licensePlate"
                  name="licensePlate"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  state="default"
                />
                <Labels type="title">{t("RegistrationExpiration")} *</Labels>
                <Inputs
                  type="date"
                  id="registrationExpiration"
                  name="registrationExpiration"
                  value={registrationExpiration}
                  onChange={(e) => setRegistrationExpiration(e.target.value)}
                  state="default"
                />
                <Labels type="title">{t("Mileage")} *</Labels>
                <Inputs
                  type="default"
                  id="mileage"
                  name="mileage"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  state="default"
                />
              </>
            ) : null}

            <Buttons background={"green"} type="submit">
              <Contents>
                <Titles size={"h2"}>Create Equipment</Titles>
              </Contents>
            </Buttons>
          </Forms>
        </Expands>
      </Contents>
      <Contents>
        <Expands title="Edit Existing Equipment" divID={"2"}>
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
              {equipmentList.map((item) => (
                <Buttons
                  onClick={() => {
                    setSearchTerm1(item.name);
                    setEditForm(false);
                  }}
                  key={item.id}
                  background={"orange"}
                >
                  <Texts position={"left"}>
                    {item.name} ({item.qrId}){" "}
                  </Texts>
                </Buttons>
              ))}
            </ul>
          )}
          {equipmentResponse === null && (
            <Buttons background={"orange"} onClick={() => handleEditForm("1")}>
              <Titles size={"h2"}>Edit Equipment</Titles>
            </Buttons>
          )}

          {/* Display the form for editing the selected equipment */}
          {equipmentResponse !== null && !editForm && (
            <Forms
              action={updateEquipment}
              onSubmit={() =>
                handleBanner("Equipment was updated successfully")
              }
            >
              <Inputs
                type="hidden"
                name="id"
                defaultValue={equipmentResponse.id}
              />
              <Labels type="title">Equipment Code *</Labels>
              <Inputs
                type="default"
                name="qrId"
                defaultValue={equipmentResponse.qrId}
                state="default"
              />
              <Labels type="title">{t("Name")}</Labels>
              <Inputs
                type="default"
                name="name"
                defaultValue={equipmentResponse.name}
                state="default"
              />
              <Labels type="title">{t("Description")}</Labels>
              <textarea
                id="description"
                name="description"
                className="block w-full border border-black rounded p-2"
                defaultValue={equipmentResponse.description || ""}
              />
              <Labels type="title">{t("Status")}</Labels>
              <Selects
                id="equipmentStatus"
                name="equipmentStatus"
                className="block w-full border border-black rounded p-2"
                defaultValue={equipmentResponse.status || ""}
              >
                <Options value="">{t("Select")}</Options>
                <Options value="OPERATIONAL">{t("Operational")}</Options>
                <Options value="NEEDS_REPAIR">{t("NeedsRepair")}</Options>
              </Selects>

              {/* Conditional fields based on equipmentTag */}
              {equipmentResponse.equipmentTag === "TRUCK" ||
              equipmentResponse.equipmentTag === "TRAILER" ? (
                <>
                  <Labels type="title">{t("Make")}</Labels>
                  <Inputs
                    type="default"
                    id="make"
                    name="make"
                    defaultValue={equipmentResponse.make || ""}
                    state="default"
                  />
                  <Labels type="title">{t("Model")}</Labels>
                  <Inputs
                    type="default"
                    id="model"
                    name="model"
                    defaultValue={equipmentResponse.model || ""}
                    state="default"
                  />
                  <Labels type="title">{t("Year")}</Labels>
                  <Inputs
                    type="default"
                    id="year"
                    name="year"
                    defaultValue={equipmentResponse.year || ""}
                    state="default"
                  />
                  <Labels type="title">{t("LicensePlate")}</Labels>
                  <Inputs
                    type="default"
                    id="licensePlate"
                    name="licensePlate"
                    defaultValue={equipmentResponse.licensePlate || ""}
                    state="default"
                  />
                  <Labels type="title">{t("RegistrationExpiration")}</Labels>
                  <Inputs
                    type="date"
                    id="registrationExpiration"
                    name="registrationExpiration"
                    defaultValue={
                      equipmentResponse.registrationExpiration
                        ? equipmentResponse.registrationExpiration.toISOString()
                        : ""
                    }
                    state="default"
                  />
                  <Labels type="title">{t("Mileage")}</Labels>
                  <Inputs
                    type="default"
                    id="mileage"
                    name="mileage"
                    defaultValue={equipmentResponse.mileage || ""}
                    state="default"
                  />
                </>
              ) : null}

              <Buttons background={"green"} type="submit">
                Edit Equipment
              </Buttons>
            </Forms>
          )}
        </Expands>
      </Contents>
      <Contents>
        <Expands title="Temporary Equipment" divID={"3"}>
          {equipment.filter((item) => item.qrId.slice(0, 4) === "EQ-T").length >
          0 ? (
            <>
              <Texts className="bg-app-orange">
                Banner appears when Equipment is Created. Please Edit the
                Temporary Equipment to a Permanent Equipment.
              </Texts>
            </>
          ) : null}

          <ul>
            {equipmentList.map((item) =>
              item.qrId.slice(0, 4) === "EQ-T" ? (
                <Buttons
                  key={item.id}
                  onClick={() => {
                    setQrId(item.qrId);
                    setEquipmentResponse(item);
                  }}
                >
                  {item.name} ({item.qrId})
                </Buttons>
              ) : null
            )}
          </ul>
          {equipment.filter((item) => item.qrId.slice(0, 4) === "EQ-T").length >
          0 ? (
            <>
              <Forms
                action={updateEquipmentID}
                onSubmit={() =>
                  handleBanner("Equipment was updated successfully")
                }
              >
                <Inputs
                  type="hidden"
                  name="id"
                  defaultValue={equipmentResponse?.id}
                />
                <Labels type="title">
                  Current Equipment ID{" "}
                  <span className="text-red-500 text-xs">
                    4 Charater cannot be capital T{" "}
                  </span>
                </Labels>
                <Inputs
                  type="text"
                  readOnly
                  defaultValue={equipmentResponse?.qrId}
                  state="disabled"
                />
                <Labels type="title">New Equipment ID</Labels>
                <Inputs
                  type="text"
                  name="qrId"
                  defaultValue={equipmentResponse?.qrId}
                />

                <Labels type="title">Current Equipment Name</Labels>
                <Inputs
                  type="text"
                  readOnly
                  state="disabled"
                  defaultValue={equipmentResponse?.name}
                />

                <Labels type="title">New Equipment name</Labels>
                <Inputs
                  type="text"
                  name="name"
                  defaultValue={equipmentResponse?.name}
                />

                <Buttons background={"green"} type="submit">
                  Edit Equipment ID
                </Buttons>
              </Forms>
            </>
          ) : (
            <Texts>No Equipment with Temporary ID</Texts>
          )}
        </Expands>
      </Contents>
      <Contents>
        <Expands title="Delete Equipment" divID={"4"}>
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
              {equipmentList.map((item) => (
                <Buttons
                  background={"orange"}
                  onClick={() => {
                    setSearchTerm2(item.id);
                    setEditForm(false);
                  }}
                  key={item.id}
                >
                  <Texts position={"left"}>
                    {item.name} ({item.qrId})
                  </Texts>
                </Buttons>
              ))}
            </ul>
          )}
          {searchTerm2 && (
            <Forms
              action={deleteEquipmentbyId}
              onSubmit={() =>
                handleBanner("Equipment was Deleted successfully")
              }
            >
              <Inputs type="hidden" name="id" defaultValue={searchTerm2} />
              <Buttons background="red" type="submit">
                <Texts>Delete</Texts>
              </Buttons>
            </Forms>
          )}
        </Expands>
      </Contents>
    </>
  );
}
