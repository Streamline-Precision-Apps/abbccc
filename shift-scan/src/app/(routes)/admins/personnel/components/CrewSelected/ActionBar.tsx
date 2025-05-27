import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import React from "react";

interface ActionBarProps {
  isDirty: boolean;
  onCreateNew: () => void;
  onDelete: () => void;
  onDiscardChanges: () => void;
  onSave: () => void;
  loading: boolean;
  successfullyUpdated: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({
  isDirty,
  onCreateNew,
  onDelete,
  onDiscardChanges,
  onSave,
  loading,
  successfullyUpdated,
}) => {
  return (
    <Holds
      background={"white"}
      position={"row"}
      className="w-full px-5 py-1 justify-between items-center relative"
    >
      <Texts
        text={"link"}
        size={"p7"}
        onClick={!isDirty ? onCreateNew : undefined}
        style={{
          pointerEvents: !isDirty ? "auto" : "none",
          opacity: !isDirty ? 1 : 0.5,
          cursor: !isDirty ? "pointer" : "not-allowed",
        }}
      >
        Create New Crew
      </Texts>

      <Texts
        text={"link"}
        size={"p7"}
        onClick={!isDirty ? onDelete : undefined}
        style={{
          pointerEvents: !isDirty ? "auto" : "none",
          opacity: !isDirty ? 1 : 0.5,
          cursor: !isDirty ? "pointer" : "not-allowed",
        }}
      >
        Delete Crew
      </Texts>

      {isDirty && (
        <Texts
          text={"link"}
          size={"p7"}
          onClick={onDiscardChanges}
          style={{
            pointerEvents: isDirty ? "auto" : "none",
            opacity: isDirty ? 1 : 0.5,
            cursor: isDirty ? "pointer" : "not-allowed",
          }}
        >
          Discard Changes
        </Texts>
      )}

      <Texts
        text={"link"}
        size={"p7"}
        onClick={onSave}
        style={{
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Texts>

      {successfullyUpdated && (
        <Holds
          background={"green"}
          className="absolute w-full h-full top-0 left-0 justify-center items-center"
        >
          <Texts size={"p6"} className="italic">
            Successfully Updated Crew!
          </Texts>
        </Holds>
      )}
    </Holds>
  );
};

export default ActionBar;
