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
  const [includeTerminated, setIncludeTerminated] = useState<boolean>(false); // New state for the checkbox
  const [filteredUsers, setFilteredUsers] = useState<SearchUser[]>(users); // New state for filtered users
  const t = useTranslations("admin");

  const resetForm = () => {
    setSearchTerm1("");
    setSearchTerm2("");
    setEditForm(true);
    setFilteredUsers(users);
  };

  // Filter users based on the terminationDate and checkbox state
  const filterUsers = () => {
    if (includeTerminated) {
      setFilteredUsers(users); // Include all users if checkbox is checked
    } else {
      // Exclude users with terminationDate not null
      const filtered = users.filter(user => user.terminationDate === null);
      setFilteredUsers(filtered);
    }
  };

  // Handle checkbox change for including terminated employees
  const handleIncludeTerminatedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIncludeTerminated(e.target.checked);
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
                  checked={includeTerminated}
                  onChange={handleIncludeTerminatedChange}
                />
                {t("Include Terminated Employees")}
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
                {/* Rest of the form fields */}
                {/* First name, Last name, Username, Password, etc. */}
              </Forms>
            </Expands>



          <Holds>
            {/* Search for existing user. */}
            <Expands title="Edit Existing User" divID={"2"}>
              <Holds>
                <SearchBar
                  searchTerm={searchTerm1}
                  onSearchChange={(e) => handleSearchChange(e, "1")}
                  placeholder="Search user..."
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
                  placeholder="Search user..."
                />
              </Holds>
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
                  <Buttons background="red" type="submit">
                    <Texts>Delete</Texts>
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