"use client";
import { useEffect, useState } from "react";
import { Buttons } from "../(reusable)/buttons";
import { Holds } from "../(reusable)/holds";
import { Images } from "../(reusable)/images";
import { PermissionsBadge } from "../(settings)/PermissionsBadge";

export default function HamburgerMenuNew() {
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const CachedImage = localStorage.getItem("userProfileImage");
      if (CachedImage) {
        setImage(CachedImage);
        return;
      }
      try {
        const fetched = await fetch("/api/getUserImage");
        const data = await fetched.json();
        if (data.image) {
          setImage(data.image);
          localStorage.setItem("userProfileImage", data.image);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchImage();
  }, []);

  return (
    <Holds
      position={"row"}
      background={"white"}
      className="row-start-1 row-end-2 h-full p-2"
    >
      <Holds className="w-16 h-full justify-center">
        <Buttons
          href="/hamburger/profile?returnUrl=/"
          background={"none"}
          shadow={"none"}
          className="relative w-16 h-full justify-center"
        >
          <img
            src={image ? image : "/profileEmpty.svg"}
            alt="profile"
            className={
              image
                ? "mx-auto w-16 h-auto border-[2px] border-black rounded-full justify-center"
                : "mx-auto w-16 h-auto"
            }
          />
          <div className="relative">
            <img
              src={"/settingsFilled.svg"}
              alt={"settings"}
              className="w-7 h-7 absolute right-[-10px] bottom-0"
            />
            <PermissionsBadge />
          </div>
        </Buttons>
      </Holds>

      <Holds className="w-full h-full justify-center">
        <Images
          titleImg="/logo.svg"
          titleImgAlt="logo"
          position={"left"}
          className="relative h-full w-full mx-auto"
        />
      </Holds>

      <Holds className="w-16 h-full justify-center">
        <Buttons
          href="/hamburger/inbox?returnUrl=/"
          background={"none"}
          shadow={"none"}
          className=" w-16 h-auto justify-center"
        >
          <img
            src={"/form.svg"}
            alt={"inbox"}
            className="relative max-w-10 h-auto object-contain  mx-auto"
          />
        </Buttons>
      </Holds>
    </Holds>
  );
}
