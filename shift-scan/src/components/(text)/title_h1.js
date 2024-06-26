// import { useTranslations } from 'next-intl';

const TitleLarge = ({children}) => {
    // const t = useTranslations('');
    return (
        <div>
            <h1 className="font-bold m-2 text-3xl text-center">
                {children}
            </h1>
        </div>

    )
}

export default TitleLarge