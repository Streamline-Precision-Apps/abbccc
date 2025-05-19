// app/test/page.tsx
import "@/app/globals.css";
import fs from "fs";
import path from "path";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Texts } from "@/components/(reusable)/texts";
import { Bases } from "@/components/(reusable)/bases";

export default function HomePage() {
  const imagesDir = path.join(process.cwd(), "public");
  const files = fs.readdirSync(imagesDir);
  const imageList = files.filter((file) =>
    /\.(png|jpe?g|svg|gif|webp)$/i.test(file)
  );

  return (
    <Bases>
      <Titles text={"white"}>All Icons</Titles>
      <Holds className="w-full h-full overflow-y-auto pb-10">
        <Holds className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3 w-full">
          {imageList.map((img, idx) => {
            const isOld = img.includes(".old");
            const bgColor = isOld ? "orange" : "white";
            // Apply background to every other image

            return (
              <Holds
                background={bgColor as "orange" | "white"}
                className="h-full rounded-[10px]"
                key={idx}
              >
                <Holds
                  position={"row"}
                  className="flex flex-row items-center justify-center gap-1"
                  key={idx}
                >
                  <Holds className="h-[100px] w-[100px]">
                    <Images
                      titleImg={`/${img}`}
                      titleImgAlt={img.replace(/\.[^/.]+$/, "")}
                      size={"full"}
                    />
                  </Holds>
                  <Holds className="h-[75px] w-[75px]">
                    <Images
                      titleImg={`/${img}`}
                      titleImgAlt={img.replace(/\.[^/.]+$/, "")}
                      size={"full"}
                    />
                  </Holds>
                  <Holds className="h-[50px] w-[50px] ">
                    <Images
                      titleImg={`/${img}`}
                      titleImgAlt={img.replace(/\.[^/.]+$/, "")}
                      size={"full"}
                    />
                  </Holds>
                  <Holds className="h-[25px] w-[25px]">
                    <Images
                      titleImg={`/${img}`}
                      titleImgAlt={img.replace(/\.[^/.]+$/, "")}
                      size={"full"}
                    />
                  </Holds>
                </Holds>
                <Texts size={"p5"}>{img.replace(/\.[^/.]+$/, "")}</Texts>
              </Holds>
            );
          })}
        </Holds>
      </Holds>
    </Bases>
  );
}
