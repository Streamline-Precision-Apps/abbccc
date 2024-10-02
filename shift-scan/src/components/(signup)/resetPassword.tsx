import React, { useState, useEffect } from "react";
import { Buttons } from "../(reusable)/buttons";
import { setUserPassword } from "@/actions/userActions";
import PasswordStrengthIndicator from "./passwordStrengthIndicator";
import { hash } from "bcryptjs";
import { Banners } from "@/components/(reusable)/banners";

const ResetPassword = ({
  id,
  handleNextStep,
}: {
  id: string;
  handleNextStep: any;
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
        <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
          <Banners background={"red"}>{bannerMessage}</Banners>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <p>Let's Reset Your password!</p>
        <p>
          Make a password with a minimum of 6 characters and 1 number and symbol
        </p>

        <div>
          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Password Strength:</label>
          <PasswordStrengthIndicator password={newPassword} />
        </div>

        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Buttons type="submit">Next</Buttons>
      </form>
    </>
  );
};

export default ResetPassword;
