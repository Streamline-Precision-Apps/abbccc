import TitleMedium from "./(text)/title_h2"
import { useRouter } from "next/navigation";


interface ButtonRoutProps {
    text?: string;
    color?: string;
    width?: string;
    height?: string;
    href?: string;
    // titleImg?: string;
    // titleImgAlt?: string;
}

const ButtonRout = ({
    text = "Button",
    color = "bg-orange-500 ",
    width = "w-50 ",
    height = "w-50 ",
    href
    // titleImg,
    // titleImgAlt
    }: ButtonRoutProps) => {

    const router = useRouter();
    const pageRouter = () => {
        if (href) {
            router.push(href);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <button onClick={() => {pageRouter()}}className={[color, width, height].join(' ')}>
 {/* + " hover:bg-orange-900 border-black border-2 font-bold m-5 mx-20 py-4 rounded-xl flex-1"> */}
            <TitleMedium>{text}</TitleMedium>
        </button>
        </div>

    )
}

export default ButtonRout

