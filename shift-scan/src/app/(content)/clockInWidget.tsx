import { User } from "@/lib/types"
import { useTranslations } from "next-intl";
import "../../app/globals.css";
import { useRouter } from "next/navigation";
import { setAuthStep } from "../api/auth";
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";

interface Props {
    user: User
}

export default function ClockInWidget({ user }: Props) {
    const t = useTranslations("page1");
    const router = useRouter();

    const loadNextPage = async () => {
        router.push("/clock");
    }

    return (
        <>
            <Buttons variant={"green"} size={"widgetLg"} onClick={loadNextPage}>
            <Images titleImg="/clockIn.svg" titleImgAlt="QR Code" variant={"icon"} size={"widgetSm"}></Images>
            <Texts>{t("lN3")}</Texts>
            </Buttons>
        </>
    );
}
