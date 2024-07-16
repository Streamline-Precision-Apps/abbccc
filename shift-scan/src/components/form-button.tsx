import { text } from "stream/consumers";
import TitleMedium from "./(text)/title_h2"
import { useRouter } from "next/navigation";
import { setAuthStep } from "@/app/api/auth";


interface FormButtonRoutProps {
    text?: string;
    color?: string;
    width?: string;
    height?: string;
    href?: string;
    authStep?: string;
}

const FormButtonRout = ({
    text = "Button",
    color = "bg-orange-500",
    width = "w-50",
    height = "h-50",
    href,
    authStep
}: FormButtonRoutProps) => {
    const router = useRouter();

    const pageRouter = (authStep?: string) => {
        if (href) {
            if (authStep) {
                setAuthStep(authStep);
            }
            router.push(href);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <button 
                type="button" 
                onClick={() => pageRouter(authStep)} 
                className={`${color} ${width} ${height} hover:bg-orange-900 border-black border-2 font-bold m-5 mx-20 py-4 rounded-xl flex-1`}
            >
                <TitleMedium>{text}</TitleMedium>
            </button>
        </div>
    );
};

export default FormButtonRout;