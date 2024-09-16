import React, { useState, ChangeEvent } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import SearchBar from "@/components/(search)/searchbar"; // Importing SearchBar

import { SearchUser } from "@/lib/types";

interface UserCardsProps {
  users: SearchUser[];
}

export default function UserCards({ users }: UserCardsProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Search users..."
      />
      <div>
        {filteredUsers.map((user) => (
          <Buttons
            key={user.id}
            id={user.id}
            href={`/admin/employees/${user.id}`}
            variant={"default"}
            size={"listLg"}
          >
            <Contents variant={"image"} size={"listImage"}>
              <Images
                titleImg={user.image ?? "/johnDoe.webp"}
                titleImgAlt="profile picture"
                variant={"icon"}
                size={"default"}
              />
            </Contents>
            <Contents variant={"row"} size={"listTitle"}>
              <Titles size={"h1"}>
                {user.firstName} {user.lastName}
              </Titles>
            </Contents>
          </Buttons>
        ))}
        {/* Example of a static button */}
        <Buttons
          id="{someStaticId}"
          href="/dashboard/myTeam/{someStaticId}"
          variant={"default"}
          size={"listLg"}
        >
          <Contents variant={"image"} size={"listImage"}>
            <Images
              titleImg="/johnDoe.webp"
              titleImgAlt="my team"
              variant={"icon"}
              size={"default"}
            />
          </Contents>
          <Contents variant={"row"} size={"listTitle"}>
            <Titles size={"h1"}>Jose Felipe Perez Alverado</Titles>
          </Contents>
        </Buttons>
      </div>
    </div>
  );
}
