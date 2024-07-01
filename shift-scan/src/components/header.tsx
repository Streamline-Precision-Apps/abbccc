import TestingComponents from "./testingComponents";

export const Header = () => {
    return (
        <div className="flex flex-row justify-between items-center p-4 bg-gray-200 h-24 lg:h-10">
            <TestingComponents />
            <h2 className="text-3xl">=</h2>
        </div>
    );
}