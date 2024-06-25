import { useTranslations } from "next-intl";
import "@/app/globals.css";

interface Props {
    date: string
    translation: string
}

export default function Banner({ date, translation } : Props) {
    const t = useTranslations(translation);
    return( 
        <div className=" bg-sky-400 text-black p-2 rounded w-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{t("Banner")}</h1>
        <h2>{date}</h2>
        </div>
    )
}          
                                