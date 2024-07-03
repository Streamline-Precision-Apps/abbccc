// import { useTranslations } from 'next-intl';

const TitleLarge = ({children}) => {
    // const t = useTranslations('');
    return (
        <div className="flex">
            <h1 className="font-bold m-2 text-3xl lg:text-5xl flex flex-col items-center justify-center ">
                {children}
            </h1>
        </div>

    )
}

export default TitleLarge