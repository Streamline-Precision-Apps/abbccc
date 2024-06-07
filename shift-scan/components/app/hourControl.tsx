interface ControlComponentProps {
    scrollLeft: () => void;
    scrollRight: () => void;
    returnToMain: () => void;
}

const ControlComponent: React.FC<ControlComponentProps> = ({ scrollLeft, scrollRight, returnToMain }) => {
    const Weekday = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const datetoday = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div>
            <div className="flex justify-between w-1/2 mt-4">
                <button onClick={scrollLeft} className="bg-blue-500 text-white p-2 rounded">Scroll Left</button>
                <button onClick={returnToMain} className="bg-red-500 text-white p-2 rounded">Return</button>
                <button onClick={scrollRight} className="bg-blue-500 text-white p-2 rounded">Scroll Right</button>
            </div>

            <div className="flex justify-between w-full mt-4 flex flex-col items-center">
                <h1>{Weekday}</h1>
                <h1>{datetoday}</h1>
            </div>
        </div>
    );
};

export default ControlComponent;