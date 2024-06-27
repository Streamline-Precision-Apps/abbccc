import { useMemo, useState } from "react";
import ViewComponent from "../(content)/hourview";
import { useSavedPayPeriodHours } from "../context/SavedPayPeriodHours";
import {BarChartComponent} from "@/app/(content)/hourData";

interface ControlComponentProps {
    toggle: (toggle: boolean) => void;
}

const ControlComponent: React.FC<ControlComponentProps> = ( { toggle }) => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [currentDate, setCurrentDate] = useState(new Date());
    const data = [1,2,0,0,6, 8, 7, 8 , 9, 12, 0, 14, 16 , 1, 10, 2, 3, 6, 0,13,0,7,6,5,2,1,0,0]; // Replace with pay period data
    const {payPeriodHours} = useSavedPayPeriodHours();

    const currentData = useMemo(() => ({
        day: currentIndex + 1, 
        value: data[currentIndex]
    }), [currentIndex, data]);

    const scrollLeft = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
            setCurrentDate((prevDate) => {
                const newDate = new Date(prevDate);
                newDate.setDate(prevDate.getDate() - 1);
                return newDate;
            });
        }
    };

    const scrollRight = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setCurrentDate((prevDate) => {
                const newDate = new Date(prevDate);
                newDate.setDate(prevDate.getDate() + 1);
                return newDate;
            });
        }
    };

    const returnToMain = () => {
        toggle(false);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="p-5 border w-1/2 bg-gray-200 rounded mb-5">
            <ViewComponent scrollLeft={scrollLeft} scrollRight={scrollRight} returnToMain={returnToMain} currentDate={currentDate} />
            </div>
            <div className="p-5 border w-1/2 bg-gray-200 rounded flex flex-col items-center justify-center">
                <h2>Current Data: {data[currentIndex]}</h2>
                <p className="text-xs mb-5 ">Pay Period Hours: {payPeriodHours}</p>
                <div style={{ width: '100%', height: 200 }}>
                <BarChartComponent data={currentData}/>
                </div>
            </div>
        </div>

    );
};

export default ControlComponent;