import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { user } from "@nextui-org/theme";

interface UserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  DOB: string;
  truckView: boolean;
  tascoView: boolean;
  laborView: boolean;
  mechanicView: boolean;
  permission: string;
  activeEmployee: boolean;
  startDate?: string;
  terminationDate?: string;
  Contact: {
    phoneNumber: string;
    emergencyContact: string;
    emergencyContactNumber: string;
  };
  Crews: {
    id: string;
    name: string;
  }[];
  image?: string;
}

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
  return (
    <>
      <Holds position={"row"} className="w-full gap-3">
        <img
          src={user.image ? user.image : "/profileFilled.svg"}
          alt="profile"
          className={
            user.image
              ? "max-w-14 h-auto object-contain rounded-full border-2 border-black"
              : "max-w-14 h-auto object-contain"
          }
        />
        <Titles size="h4">{`${user.firstName} ${user.lastName}`}</Titles>
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
    </>
  );
}
