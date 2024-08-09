import { useState } from "react";
import { SearchUser } from "@/lib/types";
import { Images } from "@/components/(reusable)/images";

interface UserSearchBarProps {
  data: SearchUser[];
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({ data }) => {
  const [query, setQuery] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<SearchUser[]>(data);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setQuery(value);

    const filtered = data.filter((user) =>
      Object.values(user).some((val) =>
        String(val).toLowerCase().includes(value)
      )
    );
    setFilteredUsers(filtered);
  };

  return (
    <div>
      <Images
        titleImg="/search.svg"
        titleImgAlt="search"
        variant={"icon"}
        size={"lg"}
      />

      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search users..."
        className=""
      />
      <ul className="search-results">
        {filteredUsers.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearchBar;
