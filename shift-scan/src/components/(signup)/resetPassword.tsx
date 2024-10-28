"use client";
import React, { useState, useEffect } from "react";
import { Buttons } from "../(reusable)/buttons";
import { setUserPassword } from "@/actions/userActions";
import PasswordStrengthIndicator from "./passwordStrengthIndicator";
import { hash } from "bcryptjs";
import { Banners } from "@/components/(reusable)/banners";
import { Holds } from "../(reusable)/holds";
import { Contents } from "../(reusable)/contents";
import { Grids } from "../(reusable)/grids";
import { Forms } from "../(reusable)/forms";
import { Titles } from "../(reusable)/titles";
import { Texts } from "../(reusable)/texts";
import { Inputs } from "../(reusable)/inputs";
import { Labels } from "../(reusable)/labels";

const ResetPassword = ({
  id,
  handleNextStep,
}: {
  id: string;
  handleNextStep: () => void;
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000); // Banner disappears after 5 seconds

      return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }
  }, [showBanner]);

  const validatePassword = (password: string) => {
    const minLength = 6;
    const hasNumber = /\d/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      password.length >= minLength &&
      hasNumber.test(password) &&
      hasSymbol.test(password)
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setBannerMessage("Passwords do not match!");
      setShowBanner(true);
      return;
    }

    if (!validatePassword(newPassword)) {
      setBannerMessage(
        "Password must be at least 6 characters long, contain at least 1 number, and contain at least 1 symbol."
      );
      setShowBanner(true);
      return;
    }

    const hashed = await hash(newPassword, 10);
    const formData = new FormData();
    formData.append("id", id);
    formData.append("password", hashed);

    try {
      await setUserPassword(formData);
      handleNextStep(); // Move to the next step after successful submission
    } catch (error) {
      console.error("Error updating password:", error);
      setBannerMessage(
        "There was an error updating your password. Please try again."
      );
      setShowBanner(true);
    }
  };

  return (
    <>
      {showBanner && (
        <Holds
          style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}
        >
          <Banners background={"red"}>
            <Texts size={"p6"}>{bannerMessage}</Texts>
          </Banners>
        </Holds>
      )}
      <Forms onSubmit={handleSubmit} className="h-full">
        <Grids rows={"3"} gap={"5"}>
          <Holds background={"white"} className=" row-span-1 h-full py-2 ">
            <Titles size={"h2"}>{`Let's Reset Your password!`}</Titles>
            <Contents width={"section"}>
              <Texts size={"p5"} className="my-5">
                Make a password with a minimum of 6 characters, a number and a
                symbol
              </Texts>
            </Contents>
          </Holds>

          <Holds
            background={"white"}
            className="my-auto row-span-2 h-full py-[1.5rem]"
          >
            <Contents width={"section"}>
              <Labels>Password Strength:</Labels>
              <PasswordStrengthIndicator password={newPassword} />
              <Holds className="mb-4">
                <Labels htmlFor="new-password">New Password</Labels>
                <Inputs
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Holds>

              <Holds className="mb-4">
                <Labels htmlFor="confirm-password">Confirm Password</Labels>
                <Inputs
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Holds>
            </Contents>
          </Holds>
          <Holds className="my-auto ">
            <Buttons type="submit" size={"80"}>
              Next
            </Buttons>
          </Holds>
        </Grids>
      </Forms>
    </>
  );
};

export default ResetPassword;
