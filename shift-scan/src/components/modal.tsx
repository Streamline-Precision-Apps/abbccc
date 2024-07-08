import '@/app/globals.css';
import ReactPortal from './ReactPortal';
import React, { useEffect }from 'react';
import BasicButton from './button';

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    handleClose: () => void;
} 

function Modal({ children, isOpen, handleClose }: ModalProps) {

    useEffect(() => {
        if (isOpen) {
        document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }

        return (): void => {
            document.body.style.overflow = 'unset';
        };

    }, [isOpen]);

    if (!isOpen) return null;
    
    return (
        <ReactPortal wrapperId="react-portal-modal-container">
            <div className="modal">
                <div className="fixed top-0 left-0 w-screen h-screen bg-neutral-800 opacity-50"/>
                <div className="fixed rounded flex flex-col box-border min-w-fit overflow-hidden p-5 bg-white inset-y-32 inset-x-40">
                        <div className="modal-content">{children}</div>
                        <div className='flex flex-col'>
                            <button onClick={handleClose} className="close-btn">
                                <BasicButton>Close</BasicButton>
                            </button>
                        </div>
                </div>
            </div>        
        // </ReactPortal>
    );
}
export default Modal;