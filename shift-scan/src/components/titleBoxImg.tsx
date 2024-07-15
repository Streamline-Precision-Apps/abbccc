interface TitleBoxImgProps {
    titleImg: string;
    titleImgAlt: string;
}

const TitleBoxImg = ({titleImg, titleImgAlt}: TitleBoxImgProps) => {
    return (
        <div>
            <img src={titleImg} alt={titleImgAlt} width={60} height={60} />
        </div>
    )
}

export default TitleBoxImg