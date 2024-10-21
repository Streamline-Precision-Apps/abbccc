import React, { useState, ChangeEvent } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { Holds } from "@/components/(reusable)/holds";
import SearchBar from "@/components/(search)/searchbar"; // Importing SearchBar
import { Grids } from "@/components/(reusable)/grids";

import { SearchUser } from "@/lib/types";
import { Contents } from "@/components/(reusable)/contents";

type UserCardsProps = {
  users: SearchUser[];
};

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
    <Grids rows={"6"} gap={"5"}>
      <Holds background={"white"} className="row-span-1 h-full rounded-t-none">
        <Contents width={"section"}>
          <Holds className="my-auto">
            <SearchBar
              selected={false}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              placeholder="Search users..."
            />
          </Holds>
        </Contents>
      </Holds>
      <Holds background={"white"} className="row-span-5 h-full">
        <Contents width={"section"} className="py-5">
          {filteredUsers.map(
            (
              user //---------------Replace this with new teams code
            ) => (
              <Buttons
                key={user.id}
                id={user.id}
                href={`/admin/employees/${user.id}`}
              >
                <Holds>
                  <Images
                    titleImg={user.image ?? "/profile-default.svg"}
                    titleImgAlt="profile picture"
                    size={"20"}
                  />
                </Holds>
                <Holds>
                  <Titles size={"h1"}>
                    {user.firstName} {user.lastName}
                  </Titles>
                </Holds>
              </Buttons>
            )
          )}
        </Contents>
      </Holds>
    </Grids>
  );
}
