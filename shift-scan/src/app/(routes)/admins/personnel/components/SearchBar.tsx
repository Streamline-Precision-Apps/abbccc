import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";

interface SearchBarProps {
  term: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  term,
  handleSearchChange,
  placeholder,
  disabled = false,
}) => {
  return (
    <Holds
      background={disabled ? "lightGray" : "white"}
      position="row"
      className="px-2 w-full h-full gap-x-3"
    >
      <Holds size="10">
        <img src="/searchLeft.svg" alt="search" />
      </Holds>
      <Inputs
        type="search"
        placeholder={placeholder}
        value={term}
        onChange={handleSearchChange}
        disabled={disabled}
        className="border-none outline-none text-sm text-left w-full h-full rounded-md bg-white"
      />
    </Holds>
  );
};

export default SearchBar;
