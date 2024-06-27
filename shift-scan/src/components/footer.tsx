import { useTranslations } from 'next-intl';

interface Props {
    pages: string
}

export const Footer = ({pages}: Props) =>  {
    const t = useTranslations(pages);
    return (
        <div className="text-xs flex justify-center w-full" >
            <h1>{t("lN4")}</h1>
        </div>
    );
}