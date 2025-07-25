import { useTranslations } from "next-intl";
import { Texts } from "../(reusable)/texts";
import { use, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ProgressBar } from "./progressBar";
import { CalendarDropDown } from "../ui/calendar-dropdown";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import updateUserAccountInfo from "@/actions/userActions";
import { setLocale } from "@/actions/cookieActions";

export const EnterAccountInfo = ({
  userId,
  handleNextStep,
  userName,
  totalSteps,
  currentStep,
}: {
  userId: string;
  handleNextStep: () => void;
  userName: string;
  totalSteps: number;
  currentStep: number;
}) => {
  const t = useTranslations("SignUpAccountInfo");

  const [form, setForm] = useState({
    email: "",
    phoneNumber: "",
    date: undefined as Date | undefined,
    language: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    phoneNumber: false,
    emergencyContactPhone: false,
  });

  // Simple email and phone regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Phone must be at least 9 digits
  const phoneDigits = (val: string) => val.replace(/\D/g, "");
  const phoneValid = phoneDigits(form.phoneNumber).length >= 10;
  const emergencyPhoneValid =
    phoneDigits(form.emergencyContactPhone).length >= 10;
  const emailValid = emailRegex.test(form.email);

  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  // Example server action placeholder
  // async function submitToServer(data: typeof form) { ... }

  // Format phone as 3-3-4 (US style)
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (field === "phoneNumber" || field === "emergencyContactPhone") {
        // Only store digits in state
        value = value.replace(/\D/g, "").slice(0, 10);
      }
      setForm((prev) => ({ ...prev, [field]: value }));
      if (
        field === "email" ||
        field === "phoneNumber" ||
        field === "emergencyContactPhone"
      ) {
        setTouched((prev) => ({ ...prev, [field]: true }));
      }
    };

  const handleLanguageChange = (value: string) => {
    setForm((prev) => ({ ...prev, language: value }));
    setLocale(value === "es"); // Pass the language code directly
  };

  const handleDateChange = (date: Date | undefined) => {
    setForm((prev) => ({ ...prev, date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all as touched for validation
    setTouched({
      email: true,
      phoneNumber: true,
      emergencyContactPhone: true,
    });

    // Validate all fields
    if (!emailValid || !phoneValid || !emergencyPhoneValid) {
      return;
    }

    const data = new FormData();
    data.append("id", userId);
    data.append("email", form.email);
    data.append("DOB", form.date ? form.date.toISOString() : "");
    data.append("phoneNumber", form.phoneNumber);
    data.append("language", form.language);
    data.append("emergencyContact", form.emergencyContactName);
    data.append("emergencyContactNumber", form.emergencyContactPhone);

    // Submit form state to server action here
    await updateUserAccountInfo(data);
    handleNextStep();
  };
  return (
    <div className="w-screen h-screen grid grid-rows-10 gap-1">
      <div className="h-full flex flex-col justify-end row-span-2 gap-1 pb-4">
        <Texts text={"white"} className="justify-end" size={"sm"}>
          {t("ItsTimeToSetUpYourAccount")}
        </Texts>
        <Texts text={"white"} className="justify-end" size={"md"}>
          {userName}
        </Texts>
      </div>
      <div className="h-full row-span-8 flex flex-col bg-white border border-zinc-300 p-4 ">
        <div className="max-w-[600px] w-full flex flex-col mx-auto h-full gap-4">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          <div>
            <Label>{t("LanguagePreference")}</Label>
            <Select value={form.language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("SelectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="en">{t("English")}</SelectItem>
                  <SelectItem value="es">{t("Spanish")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("Email")}</Label>
            <Input
              placeholder={t("EnterYourEmail")}
              className={`border p-2 rounded-md transition-colors duration-150 ${
                touched.email && !emailValid && form.email
                  ? "border-red-500 bg-red-50"
                  : touched.email && emailValid
                  ? "border-green-500 bg-green-50"
                  : "border-zinc-300"
              }`}
              value={form.email}
              onChange={handleChange("email")}
              name="email"
              type="email"
              autoComplete="email"
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              aria-invalid={
                touched.email && !emailValid && form.email ? "true" : "false"
              }
            />
            {touched.email && form.email && !emailValid && (
              <span className="text-xs text-red-600 mt-1">
                {t("InvalidEmail")}
              </span>
            )}
          </div>
          <div>
            <Label>{t("PhoneNumber")}</Label>
            <Input
              placeholder={t("EnterYourPhoneNumber")}
              className={`border p-2 rounded-md transition-colors duration-150 ${
                touched.phoneNumber && !phoneValid && form.phoneNumber
                  ? "border-red-500 bg-red-50"
                  : touched.phoneNumber && phoneValid
                  ? "border-green-500 bg-green-50"
                  : "border-zinc-300"
              }`}
              value={formatPhone(form.phoneNumber)}
              onChange={handleChange("phoneNumber")}
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              onBlur={() =>
                setTouched((prev) => ({ ...prev, phoneNumber: true }))
              }
              aria-invalid={
                touched.phoneNumber && !phoneValid && form.phoneNumber
                  ? "true"
                  : "false"
              }
              maxLength={12}
            />
            {touched.phoneNumber && form.phoneNumber && !phoneValid && (
              <span className="text-xs text-red-600 mt-1">
                {t("InvalidPhone")}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label>{t("DateOfBirth")}</Label>
            <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="justify-between font-normal"
                >
                  {form.date ? form.date.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={form.date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    handleDateChange(date);
                    setDatePopoverOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>{t("EmergencyContactName")}</Label>
            <Input
              placeholder={t("EnterEmergencyContactName")}
              className="border border-zinc-300 p-2 rounded-md"
              value={form.emergencyContactName}
              onChange={handleChange("emergencyContactName")}
              name="emergencyContactName"
            />
          </div>
          <div>
            <Label>{t("EmergencyContactPhoneNumber")}</Label>
            <Input
              placeholder={t("EnterEmergencyContactPhoneNumber")}
              className={`border p-2 rounded-md transition-colors duration-150 ${
                touched.emergencyContactPhone &&
                !emergencyPhoneValid &&
                form.emergencyContactPhone
                  ? "border-red-500 bg-red-50"
                  : touched.emergencyContactPhone && emergencyPhoneValid
                  ? "border-green-500 bg-green-50"
                  : "border-zinc-300"
              }`}
              value={formatPhone(form.emergencyContactPhone)}
              onChange={handleChange("emergencyContactPhone")}
              name="emergencyContactPhone"
              type="tel"
              onBlur={() =>
                setTouched((prev) => ({ ...prev, emergencyContactPhone: true }))
              }
              aria-invalid={
                touched.emergencyContactPhone &&
                !emergencyPhoneValid &&
                form.emergencyContactPhone
                  ? "true"
                  : "false"
              }
              maxLength={12}
            />
            {touched.emergencyContactPhone &&
              form.emergencyContactPhone &&
              !emergencyPhoneValid && (
                <span className="text-xs text-red-600 mt-1">
                  {t("InvalidPhone")}
                </span>
              )}
          </div>
          <div className="flex flex-col justify-end mt-4">
            <Button className="bg-app-dark-blue" onClick={handleSubmit}>
              <p className="text-white font-semibold text-base">{t("Next")}</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
