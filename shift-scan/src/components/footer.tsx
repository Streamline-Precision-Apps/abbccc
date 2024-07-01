import { useTranslations } from 'next-intl';

interface Props {
    pages: string
}

export const Footer = ({pages}: Props) =>  {
    const t = useTranslations(pages);
    return (
        <div className="w-full flex justify-center flex-col items-center text-sm">
            <h1>{t("lN4")}</h1>
        </div>
    );
}