import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Title } from "./Title";
import { BackButton } from "./BackButton";

export function Header({ title }: { title: string }) {
  return (
    <Holds background="white" className="row-span-1 h-full justify-center">
      <Grids cols="3" rows="2" className="w-full h-full p-3">
        <BackButton />
        <Title title={title} />
      </Grids>
    </Holds>
  );
}
