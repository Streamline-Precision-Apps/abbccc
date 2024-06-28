import { useMemo, useState } from "react";
import ViewComponent from "../(content)/hourView";
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
        <div className="w-11/12 mx-auto">
            <div className=" border bg-gray-200 rounded mb-2">
            <ViewComponent scrollLeft={scrollLeft} scrollRight={scrollRight} returnToMain={returnToMain} currentDate={currentDate} />
            </div>
            <div className="p-1 border-2 border-black rounded flex flex-col items-center justify-center w-full ">
                <p className="text-xs p-1">Pay Period Hours: {payPeriodHours}</p>
                {/* This div needs to be here for the chart to render correctly. */}
                <div style={{ width: '50%', height: 180 }}> 
                <BarChartComponent data={currentData}/>
                <h2>Hours: {data[currentIndex]}</h2>
                </div>
            </div>
        </div>

    );
};

export default ControlComponent;