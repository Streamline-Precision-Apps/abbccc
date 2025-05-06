"use client";
import { useEffect, useState } from "react";
import { Buttons } from "../(reusable)/buttons";
import { Holds } from "../(reusable)/holds";
import { Images } from "../(reusable)/images";

export default function HamburgerMenuNew() {
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const fetched = await fetch("/api/getUserImage");
      const data = await fetched.json();
      setImage(data.image);
    };
    fetchImage();
  }, []);

  return (
    <Holds position={"row"} background={"white"} className="row-span-1 h-full">
      <Holds size={"20"}>
        <Buttons
          href="/hamburger/profile"
          background={"none"}
          shadow={"none"}
          className="relative h-full w-full p-1"
        >
          <img
            src={image ? image : "/profile-sm.svg"}
            alt="profile"
            className={
              image
                ? "mx-auto h-full w-full border-[3px] border-black rounded-full"
                : "mx-auto h-full w-full "
            }
          />
          <div className="absolute right-0 bottom-0 w-7 h-7">
            <Images
              titleImg={"/gray-settings.svg"}
              titleImgAlt={"settings"}
              className="w-full h-full p-0.5" // White icon
            />
          </div>
        </Buttons>
      </Holds>

      <Holds size={"60"} className="h-full">
        <Images
          titleImg="/logo.svg"
          titleImgAlt="logo"
          position={"left"}
          className="relative h-full w-full p-2"
        />
      </Holds>

      <Holds size={"20"}>
        <Buttons href="/hamburger/inbox" background={"none"} shadow={"none"}>
          <Images
            titleImg={"/inbox-sm.svg"}
            titleImgAlt={"inbox"}
            position={"left"}
            size={"60"}
            className="relative h-full w-full px-3"
          />
        </Buttons>
      </Holds>
    </Holds>
  );
}
