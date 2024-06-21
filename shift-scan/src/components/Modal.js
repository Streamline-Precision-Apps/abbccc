import '@/app/globals.css';


const Modal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="flex justify-center fixed top-0 left-0 right-0 h-full">
            <div className=" block w-full h-full bg-black bg-opacity-70">
                <button className=" flex text-2xl text-red" onClick={onClose}>X</button>
                {children}
            </div>

        </div>
    );
}; 
export default Modal;