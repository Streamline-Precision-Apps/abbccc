// import { useTranslations } from 'next-intl';

const TitleLarge = ({children}) => {
    // const t = useTranslations('');
    return (
        <div>
            <h1 className="w-full font-bold m-2 text-md lg:text-5xl flex flex-col items-center justify-center ">
                {children}
            </h1>
        </div>

    )
}

export default TitleLarge