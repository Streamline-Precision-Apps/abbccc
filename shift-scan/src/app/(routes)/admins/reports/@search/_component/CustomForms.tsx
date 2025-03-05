"use client";
import { useNotification } from "@/app/context/NotificationContext";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

type Forms = {
  id: string;
  name: string;
  description: string;
};

export default function CustomForms({
  setForms,
  forms,
}: {
  setForms: Dispatch<SetStateAction<Forms[]>>;
  forms: Forms[];
}) {
  const { setNotification } = useNotification();
  const t = useTranslations("Admins");
  const [term, setTerm] = useState<string>("");
  const router = useRouter();

  const filteredList = useMemo(() => {
    if (!term.trim()) {
      return [...forms].sort((a, b) => a.name.localeCompare(b.name));
    } // Return the full list if no term is entered

    return forms
      .filter((c) => {
        const name = `${c.name}`.toLowerCase();
        return name.includes(term.toLowerCase());
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [term, forms]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  const selectForms = (forms: Forms) => {
    setTerm(`${forms.id} `);

    router.push(`/admins/reports/forms/${forms.id}`);
  };

  const createForms = () => {
    router.push(`/admins/reports/forms/new-forms`);
  };

  return (
    <Holds className="w-full h-full ">
      <Grids rows="10" gap="5" className="h-full py-5">
        {/* Search Input Section */}
        <Holds className="row-span-10 h-full border-[3px]  border-black rounded-t-[10px]">
          <Holds position={"row"} className="py-2 border-b-[3px] border-black">
            <Holds className="h-full w-[20%]">
              <Images titleImg="/magnifyingGlass.svg" titleImgAlt="search" />
            </Holds>
            <Holds className="w-[80%]">
              <Inputs
                type="search"
                placeholder={t("FormsSearchPlaceholder")}
                value={term}
                onChange={handleSearchChange}
                className="border-none outline-none"
              />
            </Holds>
          </Holds>
          <Holds className=" h-full mb-4 overflow-y-auto no-scrollbar ">
            <Holds>
              {filteredList.length > 0 ? (
                filteredList.map((form) => (
                  <Holds
                    key={form.id}
                    className="py-2 border-b"
                    onClick={() => selectForms(form)}
                  >
                    <Texts position={"left"} size="p6" className="pl-4">
                      {form.name}
                    </Texts>
                  </Holds>
                ))
              ) : (
                <Holds className="pt-5">
                  <Texts size="p4" className="text-center">
                    {t("NoFormsFound")}
                  </Texts>
                </Holds>
              )}
            </Holds>
          </Holds>
        </Holds>
        {/* Create New Employee Button */}
        <Buttons
          background="green"
          className="row-span-1 h-full"
          onClick={createForms}
        >
          <Texts size="p6">{t("CreateNewForm")}</Texts>
        </Buttons>
      </Grids>
    </Holds>
  );
}
