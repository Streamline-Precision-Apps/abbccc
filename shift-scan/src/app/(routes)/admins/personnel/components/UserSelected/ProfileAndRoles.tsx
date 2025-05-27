import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { user } from "@nextui-org/theme";
import { UserData } from "../types/personnel";
import { NModals } from "@/components/(reusable)/newmodals";
import { Contents } from "@/components/(reusable)/contents";
import { useState } from "react";
import { Anton } from "next/font/google";
import { RemoveUserProfilePicture } from "@/actions/PersonnelActions";
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
});

export default function ProfileAndRoles({
  user,
  originalUser,
  updateEditState,
  edited,
}: {
  user: UserData;
  originalUser: UserData | null;
  updateEditState: (
    updates: Partial<{
      user: UserData | null;
      originalUser: UserData | null;
      selectedCrews: string[];
      originalCrews: string[];
      edited: {
        [key: string]: boolean;
      };
      loading: boolean;
      successfullyUpdated: boolean;
    }>
  ) => void;
  edited: {
    [key: string]: boolean;
  };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemoveProfilePicture = async () => {
    const result = await RemoveUserProfilePicture(user.id); // Call the function to remove the profile picture
    if (!result) {
      console.error("Failed to remove profile picture");
      return;
    }
    updateEditState({
      user: {
        ...user,
        image: undefined, // Remove the profile picture
      },
      edited: {
        ...edited,
        image: true, // Mark the image field as edited
      },
    });
    setIsModalOpen(false); // Close the modal after the action
  };

  return (
    <>
      <Holds position={"row"} className="w-full gap-3">
        <img
          src={user.image ? user.image : "/profileFilled.svg"}
          alt="profile"
          className={
            user.image
              ? "max-w-14 h-auto object-contain rounded-full border-2 border-black cursor-pointer"
              : "max-w-14 h-auto object-contain"
          }
          onClick={() => setIsModalOpen(true)} // Open modal if image exists
        />
        <Titles size="h5">{`${user.firstName} ${user.lastName}`}</Titles>
      </Holds>

      <Holds className="w-full flex flex-col">
        <Holds position={"row"} className="w-full gap-x-3 justify-end">
          <Buttons
            shadow={"none"}
            type="button"
            aria-pressed={user.truckView}
            className={`w-14 h-12 rounded-[10px]  p-1.5 transition-colors ${
              user.truckView ? "bg-app-blue" : "bg-gray-400 gray opacity-80"
            } ${
              user && originalUser && user.truckView !== originalUser.truckView
                ? "border-2 border-orange-400"
                : "border-none"
            }`}
            onClick={() => {
              updateEditState({
                user: {
                  ...user,
                  truckView: !user.truckView,
                },
                edited: {
                  ...edited,
                  truckView: !user.truckView !== originalUser?.truckView,
                },
              });
            }}
          >
            <img
              src="/trucking.svg"
              alt="trucking"
              className="w-full h-full mx-auto object-contain"
            />
          </Buttons>
          <Buttons
            shadow={"none"}
            type="button"
            aria-pressed={user.tascoView}
            className={`w-14 h-12 rounded-[10px]  p-1.5 transition-colors ${
              user.tascoView ? "bg-app-blue" : "bg-gray-400 gray opacity-80"
            } ${
              user && originalUser && user.tascoView !== originalUser.tascoView
                ? "border-2 border-orange-400"
                : "border-none"
            }`}
            onClick={() => {
              updateEditState({
                user: {
                  ...user,
                  tascoView: !user.tascoView,
                },
                edited: {
                  ...edited,
                  tascoView: !user.tascoView !== originalUser?.tascoView,
                },
              });
            }}
          >
            <img
              src="/tasco.svg"
              alt="tasco"
              className="w-full h-full mx-auto object-contain"
            />
          </Buttons>
          <Buttons
            shadow={"none"}
            type="button"
            aria-pressed={user.mechanicView}
            className={`w-14 h-12 rounded-[10px]  p-1.5 transition-colors ${
              user.mechanicView ? "bg-app-blue " : "bg-gray-400 gray opacity-80"
            } ${
              user &&
              originalUser &&
              user.mechanicView !== originalUser.mechanicView
                ? "border-2 border-orange-400"
                : "border-none"
            }`}
            onClick={() => {
              updateEditState({
                user: {
                  ...user,
                  mechanicView: !user.mechanicView,
                },
                edited: {
                  ...edited,
                  mechanicView:
                    !user.mechanicView !== originalUser?.mechanicView,
                },
              });
            }}
          >
            <img
              src="/mechanic.svg"
              alt="Engineer Icon"
              className="w-full h-full mx-auto object-contain"
            />
          </Buttons>
          <Buttons
            shadow={"none"}
            type="button"
            aria-pressed={user.laborView}
            className={`w-14 h-12 rounded-[10px] p-1.5 transition-colors ${
              user.laborView ? "bg-app-blue" : "bg-gray-400 gray opacity-80"
            } ${
              user && originalUser && user.laborView !== originalUser.laborView
                ? "border-2 border-orange-400"
                : "border-none"
            }`}
            onClick={() => {
              updateEditState({
                user: {
                  ...user,
                  laborView: !user.laborView,
                },
                edited: {
                  ...edited,
                  laborView: !user.laborView !== originalUser?.laborView,
                },
              });
            }}
          >
            <img
              src="/equipment.svg"
              alt="General Icon"
              className="w-full h-full mx-auto object-contain"
            />
          </Buttons>
        </Holds>

        {!user.laborView &&
          !user.truckView &&
          !user.tascoView &&
          !user.mechanicView && (
            <Texts
              position={"right"}
              size={"p7"}
              className="text-sm italic text-red-500"
            >
              Must select at least one view
            </Texts>
          )}
      </Holds>

      {/* Modal for confirmation */}

      <NModals
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        size="sm"
        background={"noOpacity"}
      >
        <Holds className="w-full h-full items-center justify-center text-center pt-3">
          <Contents width="section" className="h-full">
            <Holds className="flex h-1/2">
              <Texts size="p5">
                Are you sure you want to remove
                <span
                  className={anton.className + " text-sm font-bold text-black"}
                >{`  ${user.firstName} ${user.lastName}'s  `}</span>
                profile picture? This will revert it back to the default image.
              </Texts>
            </Holds>
            <Holds className="flex justify-center items-center gap-4 h-1/2">
              <Buttons
                shadow="none"
                background="lightBlue"
                className="w-full p-2"
                onClick={() => handleRemoveProfilePicture()}
              >
                <Titles size="h5">Yes, continue.</Titles>
              </Buttons>
              <Buttons
                background="red"
                shadow="none"
                className="w-full p-2"
                onClick={() => setIsModalOpen(false)}
              >
                <Titles size="h5">No, go back!</Titles>
              </Buttons>
            </Holds>
          </Contents>
        </Holds>
      </NModals>
    </>
  );
}
