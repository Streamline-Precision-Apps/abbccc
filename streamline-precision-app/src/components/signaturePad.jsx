import React, { useRef, useState } from "react";
import Popup from "reactjs-popup";
import SignaturePad from "react-signature-canvas";

const SignaturePadComponent = () => {
  const [imgURL, setImgURL] = useState(null);

  const sigCanvas = useRef();

  const clear = () => {
    sigCanvas.current.clear();
  };

  const save = () => {
    setImgURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-lg mb-4">Signature Pad</h1>
        <Popup modal trigger={<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Click here to sign</button>} closeOnDocumentClick={false}>
          {close => (
            <>
              <SignaturePad
                ref={sigCanvas}
                canvasProps={{
                  className: "border border-black w-64 h-32" // Tailwind CSS classes
                }}
              />
              <div className="flex justify-between mt-4">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={save}>Save</button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={clear}>Clear</button>
                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={close}>Close</button>
              </div>
            </>
          )}
        </Popup>
        <br />
        <br />
        {imgURL ? (
          <img src={imgURL} alt="signature" className="w-64 h-32" />
        ) : null}
      </div>
    </div>
  );
};

export default SignaturePadComponent;