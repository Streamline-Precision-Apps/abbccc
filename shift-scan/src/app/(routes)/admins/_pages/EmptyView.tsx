import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";

export default function EmptyView({ Children }: { Children: React.ReactNode }) {
  return (
    <Holds className="bg-[#CACACA] rounded-[10px] w-full h-full justify-center items-center">
      <Holds className="w-1/3 h-1/3  justify-center rounded-[10px] relative ">
        <Images
          titleImg="/shiftScanLogoHorizontal.svg"
          titleImgAlt="personnel"
          className="bg-clip-padding"
        />
      </Holds>
      <Holds className="w-full h-full justify-center items-center absolute ">
        {Children}
      </Holds>
    </Holds>
  );
}
