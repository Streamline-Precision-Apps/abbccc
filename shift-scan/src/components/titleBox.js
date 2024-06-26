// import { useTranslations } from 'next-intl';
import DynamicSection from './dynamicSection';
import BackButton from './backButton';
import TitleMedium from './(text)/title_h2';


const TitleBox = ({children}) => {
    // const t = useTranslations('');
    return (
        <div>
            <DynamicSection>
                <BackButton>
                    <h1>Back</h1>
                </BackButton>
                <TitleMedium>{children}</TitleMedium>
            </DynamicSection>
        </div>
    )
}

export default TitleBox