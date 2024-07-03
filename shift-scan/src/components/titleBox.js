// import { useTranslations } from 'next-intl';
import DynamicSection from './dynamicSection';
import BackButton from './backButton';
import TitleMedium from './(text)/title_h2';
import TitleLarge from './(text)/title_h1';


const TitleBox = ({children}) => {
    // const t = useTranslations('');
    return (
        <div className='w-full h-auto flex flex-row justify-center '>
            <DynamicSection>
                <BackButton>
                    <h1>Back</h1>
                </BackButton>
                <TitleLarge>{children}</TitleLarge>
            </DynamicSection>
        </div>
    )
}

export default TitleBox