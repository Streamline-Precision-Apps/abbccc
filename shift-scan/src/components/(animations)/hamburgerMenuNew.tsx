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
    <Holds
      position={"row"}
      background={"white"}
      className="row-span-1 h-full px-1"
    >
      <Holds size={"20"}>
        <Buttons
          href="/hamburger/profile"
          background={"none"}
          shadow={"none"}
          className="relative w-16 "
        >
          <img
            src={image ? image : "/profile-sm.svg"}
            alt="profile"
            className={
              image
                ? "mx-auto w-16 border-[3px] border-black rounded-full"
                : "mx-auto w-16 "
            }
          />

          <img
            src={"/gray-settings-sm.svg"}
            alt={"settings"}
            className="w-7 h-7 absolute right-[-10px] bottom-0 " // White icon
          />
        </Buttons>
      </Holds>

      <Holds size={"60"} className="h-full">
        <Images
          titleImg="/logo.svg"
          titleImgAlt="logo"
          position={"left"}
          className="relative h-full w-full p-2 mx-auto"
        />
      </Holds>

      <Holds size={"20"}>
        <Buttons
          href="/hamburger/inbox"
          background={"none"}
          shadow={"none"}
          className="w-16 h-16"
        >
          <img
            src={"/inbox-sm.svg"}
            alt={"inbox"}
            className="relative h-full w-full px-3 mx-auto"
          />
        </Buttons>
      </Holds>
    </Holds>
  );
}
