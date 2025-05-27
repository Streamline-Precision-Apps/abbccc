import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";

interface SearchBarProps {
  term: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  term,
  handleSearchChange,
  placeholder,
}) => {
  return (
    <Holds background="white" position="row" className="w-full h-full">
      <Holds size="10">
        <img src="/searchLeft.svg" alt="search" />
      </Holds>
      <Inputs
        type="search"
        placeholder={placeholder}
        value={term}
        onChange={handleSearchChange}
        className="border-none outline-none text-sm text-left w-full h-full rounded-md bg-white"
      />
    </Holds>
  );
};

export default SearchBar;
