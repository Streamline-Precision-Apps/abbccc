"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { signOut, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { NModals } from "@/components/(reusable)/newmodals";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { Forms } from "@/components/(reusable)/forms";
import { Contents } from "@/components/(reusable)/contents";
import { Titles } from "@/components/(reusable)/titles";
import { setUserLanguage, setUserPassword } from "@/actions/userActions";
import { hash } from "bcryptjs";
import { useTranslations } from "next-intl";
import { useNotification } from "@/app/context/NotificationContext";
import { Selects } from "@/components/(reusable)/selects";
import { setLocale } from "@/actions/cookieActions";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [username, setUsername] = useState<string>("");
  const { data: session } = useSession();
  const permission = session?.user.permission;
  const userId = session?.user.id;
  const router = useRouter();
  const { setNotification } = useNotification();

  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const [isOpenLanguageSelector, setIsOpenLanguageSelector] = useState(false);
  const [isOpenSignOut, setIsOpenSignOut] = useState(false);

  // change password modal props
  const t = useTranslations("Hamburger");
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [eightChar, setEightChar] = useState(false);
  const [oneNumber, setOneNumber] = useState(false);
  const [oneSymbol, setOneSymbol] = useState(false);

  const [viewSecret1, setViewSecret1] = useState(false);
  const [viewSecret2, setViewSecret2] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const viewPasscode1 = () => {
    setViewSecret1(!viewSecret1);
  };
  const viewPasscode2 = () => {
    setViewSecret2(!viewSecret2);
  };

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 8000); // Banner disappears after 5 seconds

      return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }
  }, [showBanner]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.length === 0) {
      setBannerMessage("Invalid. New Password cannot be empty.");
      setShowBanner(true);
      return;
    }

    if (confirmPassword.length === 0) {
      setBannerMessage("Invalid. Confirm Password cannot be empty.");
      setShowBanner(true);
      return;
    }

    if (!validatePassword(newPassword)) {
      setBannerMessage(
        "Invalid. Password must be at least 8 characters long, contain 1 number, and 1 symbol."
      );
      setShowBanner(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setBannerMessage("Invalid. Passwords do not match!");
      setShowBanner(true);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const hashed = await hash(newPassword, 10);
    formData.append("id", userId ?? "");
    formData.append("password", hashed);

    if (userId === "") {
      setBannerMessage("Invalid. User ID cannot be empty.");
      setShowBanner(true);
      return;
    }
    try {
      await setUserPassword(formData);
      setIsOpenChangePassword(false);
      setNotification("Password was successfully updated.", "success");
    } catch (error) {
      console.error("Error updating password:", error);
      setNotification("Password was successfully updated.", "error");
    }
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      password.length >= minLength &&
      hasNumber.test(password) &&
      hasSymbol.test(password)
    );
  };

  const handlePasswordChange = (password: string) => {
    setEightChar(password.length >= 8);
    setOneNumber(/\d/.test(password));
    setOneSymbol(/[!@#$%^&*(),.?":{}|<>]/.test(password));
  };
  const PasswordCriteria = ({
    passed,
    label,
  }: {
    passed: boolean;
    label: string;
  }) => (
    <Holds position="row" className="space-x-2">
      <Holds
        background={passed ? "green" : "red"}
        className="w-1 rounded-full my-auto"
      ></Holds>
      <Texts size="p6">{label}</Texts>
    </Holds>
  );
  // end of change password modal

  // language selector modal
  const [language, setLanguage] = useState("en");
  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const response = await fetch(`/api/getSettings`);
        if (response.ok) {
          const data = await response.json();
          setLanguage(data.language);
        } else {
          console.error("Error fetching language:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching language:", error);
      }
    };
    fetchLanguage();
  }, [userId]);

  const handleLanguageChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("id", userId ?? "");
    const response = await setUserLanguage(formData);
    if (response === "en") {
      await setLocale(false);
    } else {
      await setLocale(true);
    }
  };

  // end of language selector modal
  useEffect(() => {
    setUsername(`${session?.user.firstName} ${session?.user.lastName}`);
  }, [session?.user.firstName, session?.user.lastName]);
  return (
    <>
      {/* If the side bar is closed it will show the mini menu */}
      {isOpen ? (
        <Holds background={"white"} className=" h-full w-[20em] ml-3 ">
          <Grids rows={"10"} gap={"5"}>
            <Holds className=" row-span-2 flex-row h-full ">
              <Holds>
                <Buttons background={"none"} size={"20"} onClick={toggle}>
                  <Images
                    titleImg="/expandLeft.svg"
                    titleImgAlt="arrow left"
                    className="rotate-180"
                  />
                </Buttons>
              </Holds>

              <Holds className="w-[600px] h-[600px]">
                <Images
                  position={"left"}
                  titleImg="/logo.svg"
                  titleImgAlt="logo"
                  className="my-auto mr-10"
                />
              </Holds>
            </Holds>
            <Holds className=" row-span-2 h-full mb-5 flex-col">
              <Grids rows={"1"} cols={"3"}>
                <Holds
                  className="col-span-1 h-full"
                  onClick={() => router.push("/admins/settings")}
                >
                  <Images
                    titleImg="/person.svg"
                    titleImgAlt="Home Icon"
                    size={"80"}
                    className="m-auto"
                  />
                </Holds>
                <Holds className="col-span-2">
                  <Holds className="flex-col">
                    <Texts size={"p3"} position={"left"}>
                      {username}
                    </Texts>
                    <Texts size={"p5"} position={"left"}>
                      {permission}
                    </Texts>
                  </Holds>
                </Holds>
              </Grids>
            </Holds>
            {/* The first button that says personal */}
            <Holds className=" row-span-4 h-full gap-5 mt-10">
              <Holds>
                <Buttons
                  className={`
                    ${
                      pathname === "/admins/personnel"
                        ? "bg-slate-400 "
                        : "bg-app-blue"
                    } w-[90%] h-12 `}
                  href="/admins/personnel"
                >
                  <Holds position={"row"} className="justify-evenly">
                    <Holds className="w-1/3 h-full ">
                      <Images
                        titleImg="/team.svg"
                        titleImgAlt="Personal Icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                    <Texts size={"p6"}>Personnel</Texts>
                    <Holds className="hidden md:flex" size={"30"}>
                      <Images
                        titleImg="/drag.svg"
                        titleImgAlt="draggable icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                  </Holds>
                </Buttons>
              </Holds>
              {/* The button that says Assets */}
              <Holds className="flex items-start justify-between">
                <Buttons
                  className={`
                    ${
                      pathname === "/admins/assets"
                        ? "bg-slate-400 "
                        : "bg-app-blue"
                    } w-[90%] h-12 `}
                  href="/admins/assets"
                >
                  <Holds position={"row"} className="justify-evenly">
                    <Holds className="w-1/3 h-full ">
                      <Images
                        titleImg="/jobsite.svg"
                        titleImgAlt="Home Icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                    <Texts size={"p6"}>Assets</Texts>
                    <Holds className="hidden md:flex" size={"30"}>
                      <Images
                        titleImg="/drag.svg"
                        titleImgAlt="draggable icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                  </Holds>
                </Buttons>
              </Holds>
              {/* The button that says Reports */}
              <Holds>
                <Buttons
                  className={`
                    ${
                      pathname === "/admins/reports"
                        ? "bg-slate-400 "
                        : "bg-app-blue"
                    } w-[90%] h-12 `}
                  href="/admins/reports"
                >
                  <Holds position={"row"} className="justify-evenly">
                    <Holds className="w-1/3 h-full ">
                      <Images
                        titleImg="/form.svg"
                        titleImgAlt="Reports Icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                    <Texts size={"p6"}>Reports</Texts>
                    <Holds className="hidden md:flex" size={"30"}>
                      <Images
                        titleImg="/drag.svg"
                        titleImgAlt="draggable icon"
                        className="my-auto flex items-center justify-center "
                        size={"50"}
                      />
                    </Holds>
                  </Holds>
                </Buttons>
              </Holds>
            </Holds>
            <Holds
              position={"row"}
              className="row-start-9 row-end-11 h-full gap-3 px-4"
            >
              {/* This is the password button */}
              <Buttons
                background={"white"}
                size={"50"}
                onClick={() => {
                  setIsOpenChangePassword(true);
                }}
                className="py-1"
              >
                <Images
                  titleImg="/key.svg"
                  titleImgAlt="Change Password Icon"
                  className="m-auto "
                />
              </Buttons>
              <NModals
                size={"medH"}
                isOpen={isOpenChangePassword}
                handleClose={() => setIsOpenChangePassword(false)}
              >
                <Holds background={"white"} className=" h-full px-4 ">
                  <Forms
                    onSubmit={handleSubmit}
                    className="h-full flex flex-col items-center justify-between"
                  >
                    {showBanner && (
                      <Holds
                        background="red"
                        position="absolute"
                        size="full"
                        className="rounded-none"
                      >
                        <Texts size="p6">{bannerMessage}</Texts>
                      </Holds>
                    )}

                    {/* Start of grid container */}
                    <Grids rows={"6"} gap={"5"} className="h-full">
                      {/* New password section */}

                      <Holds background="white" className="row-span-2 h-full">
                        <Contents width="section">
                          <Holds className="my-auto w-full">
                            <Holds position="row" className="">
                              <Labels htmlFor="new-password">
                                {t("NewPassword")}
                              </Labels>
                              <Images
                                titleImg={
                                  viewSecret1 ? "/eye.svg" : "/eye-slash.svg"
                                }
                                titleImgAlt="eye"
                                background="none"
                                size="10"
                                onClick={viewPasscode1}
                              />
                            </Holds>
                            <Inputs
                              type={viewSecret1 ? "text" : "password"}
                              id="new-password"
                              value={newPassword}
                              onChange={(e) => {
                                handlePasswordChange(e.target.value);
                                setNewPassword(e.target.value);
                              }}
                            />
                          </Holds>
                        </Contents>
                      </Holds>

                      {/* Confirm password section */}
                      <Holds className="row-span-4 h-full" background="white">
                        <Contents width="section">
                          <Holds className="my-auto w-full">
                            <Holds position="row" className="h-full">
                              <Labels htmlFor="confirm-password">
                                {t("ConfirmPassword")}
                              </Labels>
                              <Images
                                titleImg={
                                  viewSecret2 ? "/eye.svg" : "/eye-slash.svg"
                                }
                                titleImgAlt="eye"
                                background="none"
                                size="10"
                                onClick={viewPasscode2}
                              />
                            </Holds>
                            <Inputs
                              type={viewSecret2 ? "text" : "password"}
                              id="confirm-password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                          </Holds>
                        </Contents>
                      </Holds>
                      <Holds
                        background={"darkBlue"}
                        className="row-span-1 h-full"
                      >
                        <Texts position="left" text={"white"} size="p4">
                          Password Strength:
                        </Texts>
                        <Holds
                          background="white"
                          className="rounded-xl h-full "
                        >
                          <Contents width={"section"}>
                            <Holds position="row" className="my-auto">
                              <PasswordCriteria
                                passed={oneNumber}
                                label="123"
                              />
                              <PasswordCriteria
                                passed={oneSymbol}
                                label="Symbol"
                              />
                              <PasswordCriteria
                                passed={eightChar}
                                label="(8) Length"
                              />
                            </Holds>
                          </Contents>
                        </Holds>
                      </Holds>

                      {/* Submit button section */}
                      <Holds className="row-span-2 h-full">
                        <Holds className="my-auto flex justify-between">
                          <Contents width="section" className="flex gap-4">
                            {/* Submit Button */}
                            <Buttons
                              background="green"
                              type="submit"
                              className="py-2"
                            >
                              <Titles size="h4">{t("ChangePassword")}</Titles>
                            </Buttons>

                            {/* Cancel Button */}
                            <Buttons
                              background={"lightBlue"}
                              type="button" // Prevents triggering form submission
                              className="py-2"
                              onClick={() => {
                                // Logic to close the modal or reset form
                                setIsOpenChangePassword(false);
                              }}
                            >
                              <Titles size="h4">{t("Cancel")}</Titles>
                            </Buttons>
                          </Contents>
                        </Holds>
                      </Holds>
                    </Grids>
                  </Forms>
                </Holds>
              </NModals>
              {/* This is the language button */}
              <Buttons
                background={"white"}
                size={"50"}
                onClick={() => {
                  setIsOpenLanguageSelector(true);
                }}
                className="py-1"
              >
                <Images
                  titleImg="/language.svg"
                  titleImgAlt="Language Settings Icon"
                  className="m-auto"
                />
              </Buttons>
              <NModals
                size={"medM"}
                isOpen={isOpenLanguageSelector}
                handleClose={() => setIsOpenLanguageSelector(false)}
              >
                <Holds background={"white"} className=" h-full w-full p-4">
                  <Forms
                    onSubmit={handleLanguageChange}
                    className="h-full w-full"
                  >
                    <Texts size={"p4"} className="mb-4">
                      Select A Language
                    </Texts>
                    <Holds className="my-auto h-1/3">
                      <Selects
                        id="language"
                        name="language"
                        className="w-full"
                        value={language}
                        onChange={(e) => {
                          setLanguage(e.target.value);
                        }}
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                      </Selects>
                    </Holds>
                    <Holds className="flex justify-between gap-5">
                      <Buttons
                        background={"green"}
                        type="submit"
                        className="py-2"
                      >
                        <Titles size="h4">{t("Save")}</Titles>
                      </Buttons>
                      <Buttons
                        background={"lightBlue"}
                        type="button" // Prevents triggering form submission
                        className="py-2"
                        onClick={() => {
                          // Logic to close the modal or reset form
                          setIsOpenLanguageSelector(false);
                        }}
                      >
                        <Titles size="h4">{t("Cancel")}</Titles>
                      </Buttons>
                    </Holds>
                  </Forms>
                </Holds>
              </NModals>
              {/* This is the sign out button */}
              <Buttons
                background={"white"}
                size={"50"}
                onClick={() => {
                  setIsOpenSignOut(true);
                }}
                className=""
              >
                <Images
                  titleImg="/end-day.svg"
                  titleImgAlt="Sign Out Icon"
                  className="m-auto p-2"
                />
              </Buttons>
              <NModals
                isOpen={isOpenSignOut}
                handleClose={() => setIsOpenSignOut(false)}
              >
                <Holds background={"white"} className=" h-full p-4">
                  <Holds className="my-auto h-1/3">
                    <Texts size={"p4"} className="mb-4">
                      Are you sure you want to sign out?
                    </Texts>
                  </Holds>
                  <Holds className=" flex flex-row gap-10">
                    <Buttons
                      type="button"
                      onClick={async () => {
                        setIsOpenSignOut(false); // Close the modal
                        await signOut({
                          redirect: true,
                          callbackUrl: "/signin", // Specify the redirection URL
                        });
                      }}
                      className="close-btn"
                      background={"green"}
                      size={"full"}
                    >
                      <Titles size={"h3"}>Yes</Titles>
                    </Buttons>
                    <Buttons
                      type="button"
                      onClick={() => setIsOpenSignOut(false)}
                      className="close-btn"
                      background={"red"}
                      size={"full"}
                    >
                      <Titles size={"h3"}>Cancel</Titles>
                    </Buttons>
                  </Holds>
                </Holds>
              </NModals>
            </Holds>
          </Grids>
        </Holds>
      ) : (
        <Holds background={"white"} className=" h-full w-[5em] ml-3 ">
          <Grids rows={"10"} gap={"5"} className="my-5">
            <Holds className="row-span-4 h-full">
              <Holds className="w-24">
                <Buttons background={"none"} size={"50"} onClick={toggle}>
                  <Images
                    titleImg="/drag.svg"
                    titleImgAlt="menu icon"
                    className="m-auto"
                  />
                </Buttons>
              </Holds>

              <Holds className=" w-24 h-24 ">
                <Images
                  titleImg="/logo.svg"
                  titleImgAlt="logo"
                  className="my-auto"
                />
              </Holds>

              <Holds
                className="  w-24 h-24 "
                onClick={() => router.push("/admins/settings")}
              >
                <Images
                  titleImg="/person.svg"
                  titleImgAlt="Home Icon"
                  size={"80"}
                  className="m-auto"
                />
              </Holds>
            </Holds>
            <Holds className=" h-full gap-5 mt-10">
              <Holds>
                <Buttons
                  className={`
                    ${
                      pathname === "/admins/personnel"
                        ? "bg-slate-400 "
                        : "bg-app-blue"
                    } w-12 h-12 `}
                  href="/admins/personnel"
                >
                  <Holds position={"row"}>
                    <Images
                      titleImg="/team.svg"
                      titleImgAlt="Personal Icon"
                      className="m-auto"
                    />
                  </Holds>
                </Buttons>
              </Holds>
              <Holds>
                <Buttons
                  className={`
                    ${
                      pathname === "/admins/assets"
                        ? "bg-slate-400 "
                        : "bg-app-blue"
                    } w-12 h-12 `}
                  href="/admins/assets"
                >
                  <Holds position={"row"}>
                    <Images
                      titleImg="/jobsite.svg"
                      titleImgAlt="Assets Icon"
                      className="m-auto"
                      size={"80"}
                    />
                  </Holds>
                </Buttons>
              </Holds>
              <Holds>
                <Buttons
                  className={`
                    ${
                      pathname === "/admins/reports"
                        ? "bg-slate-400 "
                        : "bg-app-blue"
                    } w-12 h-12 `}
                  href="/admins/reports"
                >
                  <Holds position={"row"}>
                    <Images
                      titleImg="/form.svg"
                      titleImgAlt="Reports Icon"
                      className="m-auto"
                    />
                  </Holds>
                </Buttons>
              </Holds>
            </Holds>
          </Grids>
        </Holds>
      )}
    </>
  );
};
export default Sidebar;
