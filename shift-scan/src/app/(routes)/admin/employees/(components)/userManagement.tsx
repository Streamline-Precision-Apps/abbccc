"use client";
import { Sections } from "@/components/(reusable)/sections";
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
  const [truck_view, setTruck_view] = useState<boolean | null>(null);
  const [tasco_view, setTasco_view] = useState<boolean | null>(null);
  const [labor_view, setLabor_view] = useState<boolean | null>(null);
  const [mechanic_view, setMechanic_view] = useState<boolean | null>(null);
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
    setTruck_view(null);
    setTasco_view(null);
    setLabor_view(null);
    setMechanic_view(null);
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
      setTruck_view(response.truck_view !== null ? response.truck_view : null);
      setTasco_view(response.tasco_view !== null ? response.tasco_view : null);
      setLabor_view(response.labor_view !== null ? response.labor_view : null);
      setMechanic_view(
        response.mechanic_view !== null ? response.mechanic_view : null
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
    const truck_view = convertToBoolean(formData.get("truck_view") as string | null);
    const tasco_view = convertToBoolean(formData.get("tasco_view") as string | null);
    const labor_view = convertToBoolean(formData.get("labor_view") as string | null);
    const mechanic_view = convertToBoolean(formData.get("mechanic_view") as string | null);

    // Delete the original string values and append the boolean values
    formData.delete("truck_view");
    formData.delete("tasco_view");
    formData.delete("labor_view");
    formData.delete("mechanic_view");

    if (truck_view !== null) formData.append("truck_view", String(truck_view));
    if (tasco_view !== null) formData.append("tasco_view", String(tasco_view));
    if (labor_view !== null) formData.append("labor_view", String(labor_view));
    if (mechanic_view !== null) formData.append("mechanic_view", String(mechanic_view));

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
              id="truck_view"
              name="truck_view"
              value={truck_view !== null ? String(truck_view).toUpperCase() : ""}
              onChange={handleSelectChange(setTruck_view)}
            >
              <Options value="">{t("Select")}</Options>
              <Options value="TRUE">{t("True")}</Options>
              <Options value="FALSE">{t("False")}</Options>
            </Selects>

            <Labels size="default" type="title">
              {t("TascoView")}
            </Labels>
            <Selects
              id="tasco_view"
              name="tasco_view"
              value={tasco_view !== null ? String(tasco_view).toUpperCase() : ""}
              onChange={handleSelectChange(setTasco_view)}
            >
              <Options value="">{t("Select")}</Options>
              <Options value="TRUE">{t("True")}</Options>
              <Options value="FALSE">{t("False")}</Options>
            </Selects>

            <Labels size="default" type="title">
              {t("LaborView")}
            </Labels>
            <Selects
              id="labor_view"
              name="labor_view"
              value={labor_view !== null ? String(labor_view).toUpperCase() : ""}
              onChange={handleSelectChange(setLabor_view)}
            >
              <Options value="">{t("Select")}</Options>
              <Options value="TRUE">{t("True")}</Options>
              <Options value="FALSE">{t("False")}</Options>
            </Selects>

            <Labels size="default" type="title">
              {t("MechanicView")}
            </Labels>
            <Selects
              id="mechanic_view"
              name="mechanic_view"
              value={
                mechanic_view !== null ? String(mechanic_view).toUpperCase() : ""
              }
              onChange={handleSelectChange(setMechanic_view)}
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
            <Buttons variant="green" size="default" type="submit">
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
              size="default"
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
                id="truck_view"
                name="truck_view"
                defaultValue={truck_view !== null ? String(truck_view).toUpperCase() : ""}
                onChange={handleSelectChange(setTruck_view)}
              >
                <Options value="">{t("Select")}</Options>
                <Options value="TRUE">{t("True")}</Options>
                <Options value="FALSE">{t("False")}</Options>
              </Selects>

              <Labels size="default" type="title">
                {t("TascoView")}
              </Labels>
              <Selects
                id="tasco_view"
                name="tasco_view"
                defaultValue={tasco_view !== null ? String(tasco_view).toUpperCase() : ""}
                onChange={handleSelectChange(setTasco_view)}
              >
                <Options value="">{t("Select")}</Options>
                <Options value="TRUE">{t("True")}</Options>
                <Options value="FALSE">{t("False")}</Options>
              </Selects>

              <Labels size="default" type="title">
                {t("LaborView")}
              </Labels>
              <Selects
                id="labor_view"
                name="labor_view"
                defaultValue={labor_view !== null ? String(labor_view).toUpperCase() : ""}
                onChange={handleSelectChange(setLabor_view)}
              >
                <Options value="">{t("Select")}</Options>
                <Options value="TRUE">{t("True")}</Options>
                <Options value="FALSE">{t("False")}</Options>
              </Selects>

              <Labels size="default" type="title">
                {t("MechanicView")}
              </Labels>
              <Selects
                id="mechanic_view"
                name="mechanic_view"
                defaultValue={mechanic_view !== null ? String(mechanic_view).toUpperCase() : ""}
                onChange={handleSelectChange(setMechanic_view)}
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
              <Buttons variant="orange" size="default" type="submit">
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
              <Buttons variant="red" size="default" type="submit">
                <Texts>Delete</Texts>
              </Buttons>
            </Forms>
          )}
        </Expands>
      </Contents>
    </>
  );
}
