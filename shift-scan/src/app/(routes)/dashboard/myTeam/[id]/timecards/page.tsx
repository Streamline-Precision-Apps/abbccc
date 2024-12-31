import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

// Future tinder swipe component for timecards
export default function TimeCards({ params }: { params: { id: string } }) {
  //These TODO's are just a start point for the tinder swipe component
  //todo: extract data from a team to identify team members and their timecards for swiping
  //todo: find package for swiping left to right
  //todo: create a process for sending data one at a time in a queue of swiping one card at a time
  //todo: create a way to send all data at once
  //todo: create a changes review page
  //todo: create a way to revert back to previous data point on a miss swipe
  //todo: create inline correction page
  //todo: provide a comment/ way to add a comment for managers if they swipe denied

  return (
    <Bases className="h-screen">
      <Contents className="h-full">
        <Grids rows={"1"} className="h-full">
          <Holds background="white" className="h-full p-2">
            <Titles size="h2">Swiper Component</Titles>
            <Texts size="p3">{params.id}</Texts>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
