// import { useTranslations } from 'next-intl';

const TitleMedium = ({children}) => {
    // const t = useTranslations('');
    return (
        <div>
            <h1 className="font-bold m-2 text-2xl text-center">
                {children}
            </h1>
        </div>

    )
}

export default TitleMedium