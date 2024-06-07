import { useTranslations } from "next-intl";
import "@/app/globals.css";

export default function Banner() {
    const t = useTranslations("page1");
    return (
        <div>
            <h1>{t("Banner")}</h1>
        </div>
    )
}                                               