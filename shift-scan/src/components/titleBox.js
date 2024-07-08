// import { useTranslations } from 'next-intl';
import DynamicSection from './dynamicSection';
import BackButton from './backButton';
import TitleMedium from './(text)/title_h2';
import TitleLarge from './(text)/title_h1';


const TitleBox = ({children}) => {
    // const t = useTranslations('');
    return (
<<<<<<< HEAD
        <div className='w-full h-auto flex flex-row justify-center '>
            <DynamicSection>
                <BackButton>
                    <h1>Back</h1>
                </BackButton>
                <TitleLarge>{children}</TitleLarge>
=======
        <div>
            <DynamicSection className="flex flex-col justify-center gap-3 items-center">
                <BackButton>
                    <h1>Back</h1>
                </BackButton>
                <div className="w-full h-5 p-5 ">
                    <div  className="w-5 h-10 bg-gray-500"/>
                </div>
                <TitleMedium>{children}</TitleMedium>
>>>>>>> 08dfa3ac03203f198d49dc99c40cc5a87ee2718f
            </DynamicSection>
        </div>
    )
}

export default TitleBox