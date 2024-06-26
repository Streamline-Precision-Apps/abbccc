// import { useTranslations } from 'next-intl';

const BasicLabel = ({children}) => {
    // const t = useTranslations('');
    return (
        <div className="flex-1">
            <h1 className=" text-2xl">
                {children}
            </h1>
        </div>

    )
}

export default BasicLabel