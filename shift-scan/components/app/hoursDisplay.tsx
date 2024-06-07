import { useState } from "react";
import ControlComponent from "./hourControl";

interface ViewComponentProps {
    payPeriodHours: number;
    setToggle: (toggle: boolean) => void;
}

const ViewComponent: React.FC<ViewComponentProps> = ({ payPeriodHours, setToggle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const data = [6, 8, 7, 8 , 9];

    const scrollLeft = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };

    const scrollRight = () => {
        setCurrentIndex((prevIndex) => (prevIndex < data.length - 1 ? prevIndex + 1 : prevIndex));
    };

    const returnToMain = () => {
        setToggle(false);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <ControlComponent scrollLeft={scrollLeft} scrollRight={scrollRight} returnToMain={returnToMain} />
            <div className="p-5 border w-1/2 bg-gray-200 rounded">
                <h2>Current Data: {data[currentIndex]}</h2>
                <p>Pay Period Hours: {payPeriodHours}</p>
            </div>
        </div>
    );
};

export default ViewComponent;