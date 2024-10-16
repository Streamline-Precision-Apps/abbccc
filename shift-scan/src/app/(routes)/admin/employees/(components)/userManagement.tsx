import { ChangeEvent, useState } from "react";
import { SearchUser } from "@/lib/types";
import { createUser, deleteUser, fetchByNameUser, updateUser } from "@/actions/userActions";
import SearchBar from "@/components/(search)/searchbar";
import { useTranslations } from "next-intl";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Buttons } from "@/components/(reusable)/buttons";
import { Expands } from "@/components/(reusable)/expands";
import { Labels } from "@/components/(reusable)/labels";
import { Forms } from "@/components/(reusable)/forms";
import { Options } from "@/components/(reusable)/options";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";

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
  const [excludeTerminated, setExcludeTerminated] = useState<boolean>(false); // New state for the checkbox
  const [filteredUsers, setFilteredUsers] = useState<SearchUser[]>(users); // New state for filtered users
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

  const resetForm = () => {
    setSearchTerm1("");
    setSearchTerm2("");
    setEditForm(true);
    setFilteredUsers(users);
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
  };

  // Filter users based on the terminationDate and checkbox state
  const filterUsers = () => {
    if (excludeTerminated) {
      setFilteredUsers(users); // Exclude all users if checkbox is checked
    } else {
      // Exclude users with terminationDate not null
      const filtered = users.filter(user => user.terminationDate === null);
      setFilteredUsers(filtered);
    }
  };

  // Handle checkbox change for including terminated employees
  const handleExcludeTerminatedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExcludeTerminated(e.target.checked);
    filterUsers(); // Filter users when the checkbox is toggled
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const value = e.target.value.toLowerCase();
    if (id === "2") {
      setSearchTerm2(value);
    } else {
      setSearchTerm1(value);
    }

    // Filter the users based on the search term using filtered users (not all users)
    const filteredList = filteredUsers.filter(
      (item) =>
        item.firstName.toLowerCase().includes(value) ||
        item.lastName.toLowerCase().includes(value) ||
        item.id.toLowerCase().includes(value)
    );
    setUserList(filteredList);
    setEditForm(true);
  };

  const handleBanner = (words: string) => {
    setShowBanner(true);
    setBanner(words);
    resetForm();
    const intervalId = setInterval(() => {
      setShowBanner(false);
      setBanner("");
      clearInterval(intervalId);
    }, 10000);
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
    } else {
      console.log("Error fetching user.");
    }
  }

  const handleSelectChange =
  (setter: React.Dispatch<React.SetStateAction<boolean | null>>) =>
  (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setter(convertToBoolean(value));
  };

    // Function to handle the conversion of string "TRUE"/"FALSE" to boolean true/false
    const convertToBoolean = (value: string | null): boolean | null => {
      if (value === "TRUE") return true;
      if (value === "FALSE") return false;
      return null;
    };
  

  return (
    <>
      {showBanner && (
        <Holds className="bg-red-500">
          <Texts>{banner}</Texts>
        </Holds>
      )}
      <Holds background={"white"} className="rounded-t-none h-full">
        <Contents width={"section"} className="py-5">
          <Grids rows={"6"} gap={"5"}>
            <Holds className="row-span-1 h-full p-3">
            {/* Checkbox for including terminated employees */}
              <label>
                <input
                  type="checkbox"
                  checked={excludeTerminated}
                  onChange={handleExcludeTerminatedChange}
                />
                {t("ExcludeTerminatedEmployees")}
              </label>
            </Holds>
            <Holds className="row-span-5 h-full">
            {/* Search for new user. */}
            <Expands title="Create New User" divID={"1"}>
              {/* User creation form */}
              <Forms
                action={createUser}
                onSubmit={() => handleBanner("User was created successfully")}
              >
            <Labels type="title">
              {t("FirstName")}
            </Labels>
            <Inputs
             
              type="default"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              state="default"
            />
            <Labels type="title">
              {t("LastName")}
            </Labels>
            <Inputs
             
              type="default"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              state="default"
            />
            <Labels type="title">
              {t("Username")}
            </Labels>
            <Inputs
             
              type="default"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              state="default"
            />
            <Labels type="title">
              {t("Password")}
            </Labels>
            <Inputs
             
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              state="default"
            />
            <Labels type="title">
              {t("DOB")}
            </Labels>
            <Inputs
             
              type="date"
              name="DOB"
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
              state="default"
            />
            <Labels type="title">
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

            <Labels type="title">
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

            <Labels type="title">
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

            <Labels type="title">
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
            <Labels type="title">
              {t("Permission")}
            </Labels>
            <Selects
             
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
            <Buttons background="green" type="submit">
              {t("Submit")}
            </Buttons>
              </Forms>
            </Expands>



          <Holds>
            {/* Search for existing user. */}
            <Expands title="Edit Existing User" divID={"2"}>
              <Holds>
                <SearchBar
                  searchTerm={searchTerm1}
                  onSearchChange={(e) => handleSearchChange(e, "1")}
                  placeholder={t("SearchUser")}
                />
              </Holds>
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
              {/* Rest of the edit user form */}
            </Expands>
          </Holds>


          <Holds>
            <Expands title="Delete User" divID={"4"}>
              <Holds>
                <SearchBar
                  searchTerm={searchTerm2}
                  onSearchChange={(e) => handleSearchChange(e, "2")}
                  placeholder={t("SearchUser")}
                />
              </Holds>
              {searchTerm2 && editForm && (
                <ul>
                  {userList.map((item) => (
                    <Buttons
                      onClick={() => {
                        setSearchTerm2(item.firstName);
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
                  <Buttons background="red" type="submit">
                    <Texts>{t("Delete")}</Texts>
                  </Buttons>
                </Forms>
              )}
            </Expands>
          </Holds>
          </Holds>
          </Grids>
        </Contents>
      </Holds>
    </>
  );
}