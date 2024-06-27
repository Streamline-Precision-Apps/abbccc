import { useTranslations } from "next-intl";
import "@/app/globals.css";

interface Props {
    date: Promise<string>
    translation: string
}

export default function Banner({ date, translation } : Props) {
    const t = useTranslations(translation);
    return( 
        <div className=" bg-app-blue text-black p-2 rounded w-full h-24 flex mx-auto flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">{t("Banner")}</h1>
        <h2 className="text-2xl font-light">{date}</h2>
        </div>
    )
}          
