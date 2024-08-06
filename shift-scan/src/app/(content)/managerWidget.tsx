import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { User } from "@/lib/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  user: User;
}
export default function ManagerWidget({ user }: Props) {
  const t = useTranslations("Home");
  const router = useRouter();

  if (
    user.permission === "ADMIN" ||
    user.permission === "SUPERADMIN" ||
    user.permission === "MANAGER" ||
    user.permission === "PROJECTMANAGER"
  ) {
    return (
    < div className="grid grid-cols-2 gap-4 w-full ">
        <Buttons href="/dashboard/myTeam" variant={"default"} size={"widgetSm"}>
        <Images titleImg="/myTeam.svg" titleImgAlt="my team" variant={"icon"} size={"widgetSm"}></Images>
        <Texts>{t("MyTeam-btn")}</Texts>
      </Buttons>
      <Buttons href="/dashboard/qr-generator" variant={"default"} size={"widgetSm"}>
        <Images titleImg="/qrCode.svg" titleImgAlt="QR Code" variant={"icon"} size={"widgetSm"}></Images>
        <Texts>{t("Qr-btn")}</Texts>
      </Buttons>
    </div>
    );
  } else {
    return <></>;
  }
}
