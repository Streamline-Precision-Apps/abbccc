// import { useTranslations } from 'next-intl';
import TitleMedium from "./(text)/title_h2"

const BasicButton = ({children}) => {
    // const t = useTranslations('');
    return (
        <div className="flex justify-center items-center">
            <button className="bg-orange-500 hover:bg-orange-900 border-black border-2 font-bold m-5 mx-20 py-4 rounded-xl flex-1">
            <TitleMedium>
                {children}
            </TitleMedium>
        </button>
        </div>

    )
}

export default BasicButton