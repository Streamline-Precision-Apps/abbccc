// import { useTranslations } from 'next-intl';

const TitleSmall = ({children}) => {
    // const t = useTranslations('');
    return (
        <div>
            <h1 className="font-bold m-2 text-xl text-center">
                {children}
            </h1>
        </div>

    )
}

export default TitleSmall