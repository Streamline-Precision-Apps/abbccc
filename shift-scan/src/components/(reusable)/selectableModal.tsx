// components/reusable/SelectableModal.tsx
import { useState, ChangeEvent, FC } from "react";
import { NModals } from "@/components/(reusable)/newmodals";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import SearchBar from "@/components/(search)/searchbar";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";

type Option = {
  id: string;
  name: string;
  qrId: string;
};
type SelectableModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  handleCancel: () => void;
  options: Option[];
  onSelect: (option: Option) => void;
  selectedValue: string;
  placeholder?: string;
  handleSave: () => void;
};

const SelectableModal: FC<SelectableModalProps> = ({
  isOpen,
  handleSave,
  handleClose,
  handleCancel,
  options,
  onSelect,
  selectedValue,
  placeholder = "Search...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered options for search term
  const filteredOptions = options.filter(
    (option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.qrId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <NModals size={"xlW"} isOpen={isOpen} handleClose={handleClose}>
      <Grids rows={"8"} gap={"3"} className="h-full">
        <Holds className="row-start-1 row-end-2 h-full">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            placeholder={placeholder}
            selected={!!selectedValue}
            clearSelection={handleCancel}
            selectTerm={selectedValue}
          />
        </Holds>
        <Holds className="row-start-2 row-end-8 border-black border-[3px] rounded-[10px] h-full">
          <Holds className="overflow-y-auto no-scrollbar p-4">
            {filteredOptions.map((option) => (
              <Buttons
                background={
                  selectedValue === option.name ? "green" : "lightBlue"
                }
                key={option.qrId}
                onClick={() => onSelect(option)}
                className="w-full p-3 mb-4 text-left"
              >
                <Titles size={"h6"}>
                  {option.name} - ({option.qrId})
                </Titles>
              </Buttons>
            ))}
          </Holds>
        </Holds>
        <Holds position={"row"} className="row-start-8 row-end-9 py-2 gap-4">
          <Buttons background={"green"} onClick={() => handleSave()}>
            Save
          </Buttons>
          <Buttons background={"red"} onClick={() => handleClose()}>
            Close
          </Buttons>
        </Holds>
      </Grids>
    </NModals>
  );
};

export default SelectableModal;
