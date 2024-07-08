// import { useTranslations } from 'next-intl';
import DynamicSection from './dynamicSection';
import BackButton from './backButton';
import TitleMedium from './(text)/title_h2';


const TitleBox = ({children}) => {
    // const t = useTranslations('');
    return (
        <div>
            <DynamicSection className="flex flex-col justify-center gap-3 items-center">
                <BackButton>
                    <h1>Back</h1>
                </BackButton>
                <div className="w-full h-5 p-5 ">
                    <div  className="w-5 h-10 bg-gray-500"/>
                </div>
                <TitleMedium>{children}</TitleMedium>
            </DynamicSection>
        </div>
    )
}

export default TitleBox