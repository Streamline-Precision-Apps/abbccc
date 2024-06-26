// import { useTranslations } from 'next-intl';

const SwitchWithLabel = ({children}) => {
    // const t = useTranslations('');
    return (
        <div className="flex m-6 mb-3 justify-center gap-3">
            {children}
        </div>

    )
}

export default SwitchWithLabel