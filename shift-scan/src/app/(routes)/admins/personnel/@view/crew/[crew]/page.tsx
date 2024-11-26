"use client";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
};

type CrewMember = {
  id: number;
  crewId: number;
  user: User;
};

type CrewMembersResponse = CrewMember[];

import { useEffect } from "react";
import { ReusableViewLayout } from "../../[employee]/_components/reusableViewLayout";

export default function ViewCrew({ params }: { params: { crew: string } }) {
  useEffect(() => {
    const getCrewMembers = async () => {
      try {
        const response = await fetch(`/api/getCrewById/${params.crew}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: CrewMembersResponse = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch crew members:", error);
      }
    };
    getCrewMembers();
  }, [params.crew]);

  return (
    <ReusableViewLayout
      mainLeft={<h1>View Crew {params.crew}</h1>}
      mainRight={<h1>View Crew {params.crew}</h1>}
    ></ReusableViewLayout>
  );
}
