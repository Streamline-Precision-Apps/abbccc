"use client";
import { createNewCostCode } from "@/actions/adminActions";
import { useNotification } from "@/app/context/NotificationContext";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { CCTags } from "@/lib/types";
import { useTranslations } from "next-intl";
import { FormEvent, RefObject, useEffect, useState } from "react";

export function NewCostCodeForm({
  createCostCode,
  placeholder,
  setIsFormFilled,
  selectedTags,
  initialSelectedTags,
}: {
  createCostCode: RefObject<HTMLFormElement>;
  placeholder: string;
  setIsFormFilled?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTags: CCTags[];
  initialSelectedTags: CCTags[];
}) {
  const t = useTranslations("Admins");
  const { setNotification } = useNotification();
  const [ccName, setCcName] = useState<string>("");
  const [ccDescription, setCcDescription] = useState<string>("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {}
  );

  const CreateCostCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the page from reloading
    const newErrors: { name?: string; description?: string } = {};

    if (!/^[0-9#\\.]+$/.test(ccName)) {
      newErrors.name = t("InvalidCostCodeName");
    }
    if (!/^[0-9#\\.]+$/.test(ccDescription)) {
      newErrors.description = t("InvalidCostCodeDescription");
    }

    setErrors(newErrors);

    // If there are errors, do not proceed
    if (Object.keys(newErrors).length > 0) {
      setNotification(t("FormValidationFailed"), "error");
      return;
    }

    try {
      const formData = new FormData(createCostCode.current!);

      const tagsToAdd = selectedTags.filter(
        (tag) => !initialSelectedTags.some((initTag) => initTag.id === tag.id)
      );
      tagsToAdd.forEach((tag) => formData.append("tags", tag.id.toString()));

      const response = await createNewCostCode(formData);
      if (response) {
        console.log("Cost Code created successfully");
        setNotification(t("CostCodeCreated"), "success");
      } else {
        console.error("Failed to create Cost Code");
        setNotification(t("CostCodeFailedCreation"), "error");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setNotification(t("CostCodeFailedCreation"), "error");
    }
  };

  useEffect(() => {
    if (setIsFormFilled)
      setIsFormFilled(
        ccName.trim().length > 0 && ccDescription.trim().length > 0
      );
  }, [ccName, ccDescription, setIsFormFilled]);

  return (
    <Holds
      background={"white"}
      className="w-full h-full row-span-1 col-span-2  "
    >
      <form
        ref={createCostCode}
        onSubmit={(e) => CreateCostCode(e)}
        className="flex flex-row size-full gap-4 py-2 px-10"
      >
        <Holds className="w-1/2 py-4">
          <Inputs
            name="name"
            placeholder={placeholder}
            className="p-2"
            onChange={(e) => {
              const value = e.target.value;
              setCcName(value);

              if (!/^[0-9#\\.]+$/.test(value)) {
                setErrors((prev) => ({
                  ...prev,
                  name: t("InvalidCostCodeName"),
                }));
              } else {
                setErrors((prev) => {
                  const { name, ...rest } = prev;
                  return rest;
                });
              }
            }}
            pattern={"^[0-9#\\.]+$"}
            required
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}
        </Holds>
        <Holds className="w-1/2">
          <Inputs
            type="text"
            name="description"
            className="p-2"
            placeholder={t("CostCodeDescription")}
            onChange={(e) => {
              const value = e.target.value;
              setCcDescription(value);

              if (!/^[0-9#\\.]+$/.test(value)) {
                setErrors((prev) => ({
                  ...prev,
                  description: t("InvalidCostCodeDescription"),
                }));
              } else {
                setErrors((prev) => {
                  const { description, ...rest } = prev;
                  return rest;
                });
              }
            }}
            pattern={"^[0-9#\\.]+$"}
            required
          />
          {errors.description && (
            <span className="text-red-500 text-sm">{errors.description}</span>
          )}
        </Holds>
      </form>
    </Holds>
  );
}
