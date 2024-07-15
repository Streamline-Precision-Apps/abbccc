import DynamicSection from './dynamicSection';
import BackButton from './backButton';
import TitleMedium from './(text)/title_h2';
import TitleBoxImg from './titleBoxImg';

interface TitleBoxProps {
    title: string;
    titleImg: string;
    titleImgAlt: string;
}

const TitleBox = ({title, titleImg, titleImgAlt}: TitleBoxProps) => {
    return (
        <div>
            <DynamicSection>
                <div className="p-3 flex justify-center items-center">
                    <BackButton/>
                    <TitleBoxImg titleImg={titleImg} titleImgAlt={titleImgAlt} />
                    <TitleMedium>{title}</TitleMedium>
                </div>
            </DynamicSection>
        </div>
    )
}

export default TitleBox