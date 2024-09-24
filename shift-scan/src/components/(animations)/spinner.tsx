export default function Spinner() {
    // there is a custom class for the spinner in the tailwind config
    return (
        <div className="flex justify-center h-screen">
            <div className="animate-spin-custom rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
        </div>
    );
}