import { useTranslations } from "next-intl";
import "@/app/globals.css";

interface Props {
    date: string
}

export default function Banner({ date } : Props) {
    const t = useTranslations("page1");
    return (
        <div className=" bg-sky-400 text-black p-2 rounded w-full flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">{t("Banner")}</h1>
            <p className="text-lg ">{t('Date', { date })}</p>
        </div>
    )
}                                               