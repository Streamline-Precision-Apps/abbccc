"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Forms } from "@/components/(reusable)/forms";
import { ChangeEvent, useState } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import {
  createUser,
  deleteUser,
  fetchByNameUser,
  updateUser,
} from "@/actions/userActions";
import SearchBar from "@/components/(search)/searchbar";
import { Contents } from "@/components/(reusable)/contents";
import { Banners } from "@/components/(reusable)/banners";
import { Titles } from "@/components/(reusable)/titles";
import { Modals } from "@/components/(reusable)/modals";
import { Expands } from "@/components/(reusable)/expands";
import { Selects } from "@/components/(reusable)/selects";
import { Options } from "@/components/(reusable)/options";
import { SearchUser } from "@/lib/types";

type Props = {
  users: SearchUser[];
};

export default function UserManagement({ users }: Props) {
  const [userList, setUserList] = useState<SearchUser[]>(users);
  const [searchTerm1, setSearchTerm1] = useState<string>("");
  const [searchTerm2, setSearchTerm2] = useState<string>("");
  const [editForm, setEditForm] = useState<boolean>(true);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [banner, setBanner] = useState("");
  const [userResponse, setUserResponse] = useState<SearchUser | null>(null);
  const t = useTranslations("admin");
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [DOB, setDOB] = useState("");
  const [truckView, setTruckView] = useState<boolean | null>(null);
  const [tascoView, setTascoView] = useState<boolean | null>(null);
  const [laborView, setLaborView] = useState<boolean | null>(null);
  const [mechanicView, setMechanicView] = useState<boolean | null>(null);
  const [permission, setPermission] = useState<string | null>("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const resetForm = () => {
    setUserId("");
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setDOB("");
    setTruckView(null);
    setTascoView(null);
    setLaborView(null);
    setMechanicView(null);
    setPermission("");
    setEmail("");
    setPhone("");
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const value = e.target.value.toLowerCase();
    if (id === "2") {
      setSearchTerm2(value);
    } else {
      setSearchTerm1(value);
    }
    const filteredList = users.filter(
      (item) =>
        item.firstName.toLowerCase().includes(value) ||
        item.lastName.toLowerCase().includes(value) ||
        item.id.toLowerCase().includes(value)
    );
    setUserList(filteredList);
    setEditForm(true);
  };

  async function handleEditForm(id: string) {
    setEditForm(false);
    let response = null;
    if (id === "2") {
      response = await fetchByNameUser(searchTerm2);
    } else {
      response = await fetchByNameUser(searchTerm1);
    }
    if (response) {
      setUserResponse(response as SearchUser);
      setUserId(response.id);
      setFirstName(response.firstName);
      setLastName(response.lastName);
      setUsername(response.username);
      setDOB(response.DOB || "");
      setTruckView(response.truckView !== null ? response.truckView : null);
      setTascoView(response.tascoView !== null ? response.tascoView : null);
      setLaborView(response.laborView !== null ? response.laborView : null);
      setMechanicView(
        response.mechanicView !== null ? response.mechanicView : null
      );
      setPermission(response.permission || "");
      setEmail(response.email || "");
      setPhone(response.phone || "");
    } else {
      console.log("Error fetching user.");
    }
  }

  async function handleBanner(words: string) {
    setShowBanner(true);
    setBanner(words);
    setSearchTerm1("");
    setSearchTerm2("");
    setEditForm(true);
    const intervalId = setInterval(() => {
      setShowBanner(false);
      setBanner("");
      resetForm();
      clearInterval(intervalId);
    }, 10000);
  }

  // Function to handle the conversion of string "TRUE"/"FALSE" to boolean true/false
  const convertToBoolean = (value: string | null): boolean | null => {
    if (value === "TRUE") return true;
    if (value === "FALSE") return false;
    return null;
  };

  // Adjust the handleSelectChange to handle the boolean conversion
  const handleSelectChange =
    (setter: React.Dispatch<React.SetStateAction<boolean | null>>) =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      setter(convertToBoolean(value));
    };

  const handleSubmitEdit = async (formData: FormData) => {
    // Convert the boolean fields
    const truckView = convertToBoolean(formData.get("truckView") as string | null);
    const tascoView = convertToBoolean(formData.get("tascoView") as string | null);
    const laborView = convertToBoolean(formData.get("laborView") as string | null);
    const mechanicView = convertToBoolean(formData.get("mechanicView") as string | null);

    // Delete the original string values and append the boolean values
    formData.delete("truckView");
    formData.delete("tascoView");
    formData.delete("laborView");
    formData.delete("mechanicView");

    if (truckView !== null) formData.append("truckView", String(truckView));
    if (tascoView !== null) formData.append("tascoView", String(tascoView));
    if (laborView !== null) formData.append("laborView", String(laborView));
    if (mechanicView !== null) formData.append("mechanicView", String(mechanicView));

    await updateUser(formData);
    handleBanner("User was updated successfully");
  };

  return (
    <>
      {showBanner && (
        <Contents size={"default"} variant={"default"}>
          <Texts>{banner}</Texts>
        </Contents>
      )}
      <Contents variant={"default"} size={null}>
        {/* This is to create a new user. */}
        <Expands title="Create New User" divID={"1"}>
          <Forms
            action={createUser}
            onSubmit={() => handleBanner("User was created successfully")}
          >
            <Labels variant="default" type="title">
              {t("FirstName")}
            </Labels>
            <Inputs
              variant="default"
              type="default"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              state="default"
            />
            <Labels variant="default" type="title">
              {t("LastName")}
            </Labels>
            <Inputs
              variant="default"
              type="default"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              state="default"
            />
            <Labels variant="default" type="title">
              {t("Username")}
            </Labels>
            <Inputs
              variant="default"
              type="default"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              state="default"
            />
            <Labels variant="default" type="title">
              {t("Password")}
            </Labels>
            <Inputs
              variant="default"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              state="default"
            />
            <Labels variant="default" type="title">
              {t("DOB")}
            </Labels>
            <Inputs
              variant="default"
              type="date"
              name="DOB"
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
              state="default"
            />
            <Labels size="default" type="title">
              {t("TruckView")}
            </Labels>
            <Selects
              id="truckView"
              name="truckView"
              value={truckView !== null ? String(truckView).toUpperCase() : ""}
              onChange={handleSelectChange(setTruckView)}
            >
              <Options value="">{t("Select")}</Options>
              <Options value="TRUE">{t("True")}</Options>
              <Options value="FALSE">{t("False")}</Options>
            </Selects>

            <Labels size="default" type="title">
              {t("TascoView")}
            </Labels>
            <Selects
              id="tascoView"
              name="tascoView"
              value={tascoView !== null ? String(tascoView).toUpperCase() : ""}
              onChange={handleSelectChange(setTascoView)}
            >
              <Options value="">{t("Select")}</Options>
              <Options value="TRUE">{t("True")}</Options>
              <Options value="FALSE">{t("False")}</Options>
            </Selects>

            <Labels size="default" type="title">
              {t("LaborView")}
            </Labels>
            <Selects
              id="laborView"
              name="laborView"
              value={laborView !== null ? String(laborView).toUpperCase() : ""}
              onChange={handleSelectChange(setLaborView)}
            >
              <Options value="">{t("Select")}</Options>
              <Options value="TRUE">{t("True")}</Options>
              <Options value="FALSE">{t("False")}</Options>
            </Selects>

            <Labels size="default" type="title">
              {t("MechanicView")}
            </Labels>
            <Selects
              id="mechanicView"
              name="mechanicView"
              value={
                mechanicView !== null ? String(mechanicView).toUpperCase() : ""
              }
              onChange={handleSelectChange(setMechanicView)}
            >
              <Options value="">{t("Select")}</Options>
              <Options value="TRUE">{t("True")}</Options>
              <Options value="FALSE">{t("False")}</Options>
            </Selects>
            <Labels variant="default" type="title">
              {t("Permission")}
            </Labels>
            <Selects
              variant="default"
              id="permission"
              name="permission"
              value={permission ?? ""}
              onChange={(e) => setPermission(e.target.value)}
              className="block w-full border border-black rounded p-2"
            >
              <Options value="">{t("Select")}</Options>
              <Options value="USER">{t("User")}</Options>
              <Options value="MANAGER">{t("Manager")}</Options>
              <Options value="PROJECTMANAGER">{t("ProjectManager")}</Options>
              <Options value="ADMIN">{t("Admin")}</Options>
              <Options value="SUPERADMIN">{t("SuperAdmin")}</Options>
            </Selects>
            <Labels variant="default" type="title">
              {t("Email")}
            </Labels>
            <Inputs
              variant="default"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              state="default"
            />
            <Labels variant="default" type="title">
              {t("Phone")}
            </Labels>
            <Inputs
              variant="default"
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              state="default"
            />
            <Buttons variant="green" type="submit">
              {t("Submit")}
            </Buttons>
          </Forms>
        </Expands>
      </Contents>
      <Contents variant={"default"} size={null}>
        {/* Search for existing user. */}
        <Expands title="Edit Existing User" divID={"2"}>
          <Contents variant={"default"} size={null}>
            <SearchBar
              searchTerm={searchTerm1}
              onSearchChange={(e) => handleSearchChange(e, "1")}
              placeholder="Search user..."
            />
          </Contents>
          {searchTerm1 && editForm && (
            <ul>
              {userList.map((item) => (
                <Buttons
                  onClick={() => {
                    setSearchTerm1(item.firstName);
                    setEditForm(false);
                  }}
                  key={item.id}
                >
                  {item.firstName} {item.lastName} ({item.username})
                </Buttons>
              ))}
            </ul>
          )}
          {userResponse === null && (
            <Buttons
              variant="orange"
              onClick={() => handleEditForm("1")}
            >
              {t("Submit")}
            </Buttons>
          )}
          {userResponse !== null && !editForm && (
            // Enter info for editing selected user.
            <Forms action={handleSubmitEdit}>
              <Inputs type="hidden" name="id" defaultValue={userResponse.id} />
              <Labels variant="default" type="title">
                {t("FirstName")}
              </Labels>
              <Inputs
                variant="default"
                type="default"
                name="firstName"
                defaultValue={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                state="default"
              />
              <Labels variant="default" type="title">
                {t("LastName")}
              </Labels>
              <Inputs
                variant="default"
                type="default"
                name="lastName"
                defaultValue={lastName}
                onChange={(e) => setLastName(e.target.value)}
                state="default"
              />
              <Labels variant="default" type="title">
                {t("Username")}
              </Labels>
              <Inputs
                variant="default"
                type="default"
                name="username"
                defaultValue={username}
                onChange={(e) => setUsername(e.target.value)}
                state="default"
              />
              <Labels variant="default" type="title">
                {t("DOB")}
              </Labels>
              <Inputs
                variant="default"
                type="date"
                name="DOB"
                defaultValue={DOB}
                onChange={(e) => setDOB(e.target.value)}
                state="default"
              />
              <Labels size="default" type="title">
                {t("TruckView")}
              </Labels>
              <Selects
                id="truckView"
                name="truckView"
                defaultValue={truckView !== null ? String(truckView).toUpperCase() : ""}
                onChange={handleSelectChange(setTruckView)}
              >
                <Options value="">{t("Select")}</Options>
                <Options value="TRUE">{t("True")}</Options>
                <Options value="FALSE">{t("False")}</Options>
              </Selects>

              <Labels size="default" type="title">
                {t("TascoView")}
              </Labels>
              <Selects
                id="tascoView"
                name="tascoView"
                defaultValue={tascoView !== null ? String(tascoView).toUpperCase() : ""}
                onChange={handleSelectChange(setTascoView)}
              >
                <Options value="">{t("Select")}</Options>
                <Options value="TRUE">{t("True")}</Options>
                <Options value="FALSE">{t("False")}</Options>
              </Selects>

              <Labels size="default" type="title">
                {t("LaborView")}
              </Labels>
              <Selects
                id="laborView"
                name="laborView"
                defaultValue={laborView !== null ? String(laborView).toUpperCase() : ""}
                onChange={handleSelectChange(setLaborView)}
              >
                <Options value="">{t("Select")}</Options>
                <Options value="TRUE">{t("True")}</Options>
                <Options value="FALSE">{t("False")}</Options>
              </Selects>

              <Labels size="default" type="title">
                {t("MechanicView")}
              </Labels>
              <Selects
                id="mechanicView"
                name="mechanicView"
                defaultValue={mechanicView !== null ? String(mechanicView).toUpperCase() : ""}
                onChange={handleSelectChange(setMechanicView)}
              >
                <Options value="">{t("Select")}</Options>
                <Options value="TRUE">{t("True")}</Options>
                <Options value="FALSE">{t("False")}</Options>
              </Selects>
              <Labels variant="default" type="title">
                {t("Permission")}
              </Labels>
              <Selects
                name="permission"
                className="block w-full border border-black rounded p-2"
                defaultValue={permission || ""}
                onChange={(e) => setPermission(e.target.value)}
              >
                <Options value="">{t("Select")}</Options>
                <Options value="USER">{t("User")}</Options>
                <Options value="MANAGER">{t("Manager")}</Options>
                <Options value="PROJECTMANAGER">{t("ProjectManager")}</Options>
                <Options value="ADMIN">{t("Admin")}</Options>
                <Options value="SUPERADMIN">{t("SuperAdmin")}</Options>
              </Selects>
              <Labels variant="default" type="title">
                {t("Email")}
              </Labels>
              <Inputs
                variant="default"
                type="email"
                name="email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
                state="default"
              />
              <Labels variant="default" type="title">
                {t("Phone")}
              </Labels>
              <Inputs
                variant="default"
                type="tel"
                name="phone"
                defaultValue={phone}
                onChange={(e) => setPhone(e.target.value)}
                state="default"
              />
              <Buttons variant="orange" type="submit">
                {t("Submit")}
              </Buttons>
            </Forms>
          )}
        </Expands>
      </Contents>
      <Contents variant={"default"} size={null}>
        <Expands title="Delete User" divID={"4"}>
          <Contents variant={"default"} size={null}>
            <SearchBar
              searchTerm={searchTerm2}
              onSearchChange={(e) => handleSearchChange(e, "2")}
              placeholder="Search user..."
            />
          </Contents>
          {searchTerm2 && editForm && (
            <ul>
              {userList.map((item) => (
                <Buttons
                  onClick={() => {
                    setSearchTerm2(item.id);
                    setEditForm(false);
                  }}
                  key={item.id}
                >
                  {item.firstName} {item.lastName} ({item.username})
                </Buttons>
              ))}
            </ul>
          )}
          {searchTerm2 && (
            <Forms
              action={deleteUser}
              onSubmit={() => handleBanner("User was deleted successfully")}
            >
              <Inputs type="hidden" name="id" defaultValue={searchTerm2} />
              <Buttons variant="red" type="submit">
                <Texts>Delete</Texts>
              </Buttons>
            </Forms>
          )}
        </Expands>
      </Contents>
    </>
  );
}
