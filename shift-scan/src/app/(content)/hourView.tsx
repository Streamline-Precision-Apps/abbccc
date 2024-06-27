interface ViewComponentProps {
    scrollLeft: () => void;
    scrollRight: () => void;
    returnToMain: () => void;
    currentDate: Date;
}

const ViewComponent: React.FC<ViewComponentProps> = ({ scrollLeft, scrollRight, returnToMain, currentDate }) => {
    let Weekday = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const today = new Date();
    if (Weekday == today.toLocaleDateString('en-US', { weekday: 'long' })) {
        Weekday = "Today";
    }
    const datetoday = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="w-full">
            <div className="flex justify-between w-full  flex flex-row items-center">
                <button onClick={scrollLeft} className="bg-app-blue text-white p-2 rounded">Scroll Left</button>
                <button onClick={returnToMain} className="bg-app-red text-white p-2 rounded">Return</button>
                <button onClick={scrollRight} className="bg-app-blue text-white p-2 rounded">Scroll Right</button>
            </div>

            <div className="flex justify-between w-full mt-4 flex flex-col items-center">
                <h1>{Weekday}</h1>
                <h1>{datetoday}</h1>
            </div>
        </div>
    );
};

export default ViewComponent;