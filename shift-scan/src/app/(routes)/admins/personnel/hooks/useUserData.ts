import { useEffect } from "react";
import { editPersonnelInfo, deletePersonnel } from "@/actions/PersonnelActions";
import { UseUserDataProps } from "../components/types/personnel";

export const useUserData = ({
  userid,
  editState,
  updateEditState,
}: UseUserDataProps) => {
  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (!editState.user) {
        updateEditState({ loading: true });
        try {
          const res = await fetch(`/api/employeeInfo/${userid}`);
          if (!res.ok) throw new Error("Failed to fetch user data");
          const userData = await res.json();

          if (!isMounted) return;

          const crewIds = userData.Crews.map((c: { id: string }) => c.id);

          const crewLeadsMap = userData.Crews.reduce(
            (
              acc: Record<string, boolean>,
              crew: { id: string; name: string; leadId: string }
            ) => {
              acc[crew.id] = crew.leadId === userData.id;
              return acc;
            },
            {}
          );

          updateEditState({
            user: userData,
            originalUser: userData,
            selectedCrews: crewIds,
            originalCrews: crewIds,
            crewLeads: crewLeadsMap,
            originalCrewLeads: { ...crewLeadsMap },
            edited: {},
            loading: false,
          });
        } catch (e) {
          console.error(e);
          if (isMounted) {
            updateEditState({ loading: false });
          }
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [userid]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editState.user) return;
    const { name, value } = e.target;

    if (
      name === "phoneNumber" ||
      name === "emergencyContact" ||
      name === "emergencyContactNumber"
    ) {
      updateEditState({
        user: {
          ...editState.user,
          Contact: {
            ...editState.user.Contact,
            [name]: value,
          },
        },
        edited: {
          ...editState.edited,
          [name]: value !== (editState.originalUser?.Contact as any)?.[name],
        },
      });
      return;
    }

    if (name === "activeEmployee") {
      const isActive = value === "Active";
      const newTerminationDate = isActive ? null : new Date().toISOString();
      const hasChanged =
        (editState.originalUser?.terminationDate === null) !== isActive;

      updateEditState({
        user: {
          ...editState.user,
          terminationDate: newTerminationDate,
        },
        edited: {
          ...editState.edited,
          terminationDate: hasChanged,
        },
      });
      return;
    }

    updateEditState({
      user: { ...editState.user, [name]: value },
      edited: {
        ...editState.edited,
        [name]: value !== (editState.originalUser as any)?.[name],
      },
    });
  };

  const handleCrewCheckbox = (id: string) => {
    const newCrews = editState.selectedCrews.includes(id)
      ? editState.selectedCrews.filter((c) => c !== id)
      : [...editState.selectedCrews, id];

    const newCrewLeads = { ...editState.crewLeads };
    if (!newCrews.includes(id)) {
      delete newCrewLeads[id];
    }

    updateEditState({
      selectedCrews: newCrews,
      crewLeads: newCrewLeads,
      edited: {
        ...editState.edited,
        crews:
          JSON.stringify(newCrews.sort()) !==
          JSON.stringify(editState.originalCrews.sort()),
        crewLeads:
          JSON.stringify(newCrewLeads) !==
          JSON.stringify(editState.originalCrewLeads),
      },
    });
  };

  const handleCrewLeadToggle = (crewId: string) => {
    if (!editState.user) return;

    const newCrewLeads = {
      ...editState.crewLeads,
      [crewId]: !editState.crewLeads[crewId],
    };

    updateEditState({
      crewLeads: newCrewLeads,
      edited: {
        ...editState.edited,
        crewLeads:
          JSON.stringify(newCrewLeads) !==
          JSON.stringify(editState.originalCrewLeads),
      },
    });
  };

  const handleSave = async () => {
    if (!editState.user) return;
    updateEditState({ loading: true });

    const formData = new FormData();
    formData.set("id", editState.user.id);
    formData.set("firstName", editState.user.firstName);
    formData.set("lastName", editState.user.lastName);
    formData.set("email", editState.user.email);
    formData.set("DOB", editState.user.DOB);
    formData.set("permission", editState.user.permission);
    formData.set("truckView", String(editState.user.truckView));
    formData.set("tascoView", String(editState.user.tascoView));
    formData.set("laborView", String(editState.user.laborView));
    formData.set("mechanicView", String(editState.user.mechanicView));
    formData.set("phoneNumber", editState.user.Contact?.phoneNumber || "");
    formData.set(
      "emergencyContact",
      editState.user.Contact?.emergencyContact || ""
    );
    formData.set(
      "emergencyContactNumber",
      editState.user.Contact?.emergencyContactNumber || ""
    );
    formData.set("terminationDate", editState.user.terminationDate || "");
    formData.set("crewLeads", JSON.stringify(editState.crewLeads));
    formData.set("selectedCrews", JSON.stringify(editState.selectedCrews));

    try {
      const result = await editPersonnelInfo(formData);
      if (result === true) {
        updateEditState({
          loading: false,
          originalUser: editState.user ? { ...editState.user } : null,
          originalCrews: [...editState.selectedCrews],
          originalCrewLeads: { ...editState.crewLeads },
          edited: {},
          successfullyUpdated: true,
        });
        setTimeout(() => {
          updateEditState({ successfullyUpdated: false });
        }, 3000);
      } else {
        updateEditState({ loading: false });
        throw new Error("Failed to save changes");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to save changes");
    }
  };

  const handleDelete = async (userid: string) => {
    if (!editState.user || editState.loading) return;
    try {
      updateEditState({ loading: true });
      await deletePersonnel(editState.user.id);
    } catch (error) {
      console.error("Failed to delete user:", error);
      updateEditState({ loading: false });
    }
  };

  return {
    ...editState,
    handleInputChange,
    handleCrewCheckbox,
    handleCrewLeadToggle,
    handleSave,
    handleDelete,
  };
};
