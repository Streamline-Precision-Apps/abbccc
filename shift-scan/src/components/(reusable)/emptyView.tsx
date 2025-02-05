import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";

export default function EmptyView({
  Children,
  TopChild,
  color = "bg-[#CACACA]",
}: {
  Children?: React.ReactNode;
  TopChild?: React.ReactNode;
  color?: string;
}) {
  return (
    <Holds
      className={`${color} rounded-[10px] w-full h-full justify-center items-center`}
    >
      <Holds className="w-full h-1/3 justify-end rounded-[10px]  ">
        {TopChild}
      </Holds>
      <Holds className="w-1/2 h-1/3 justify-center rounded-[10px]  ">
        <Images
          titleImg={"/shiftScanLogoHorizontal.svg"}
          titleImgAlt="personnel"
          className="bg-clip-padding"
        />
      </Holds>

      <Holds className="w-full h-1/3 justify-start rounded-[10px]  ">
        {Children}
      </Holds>
    </Holds>
  );
}
