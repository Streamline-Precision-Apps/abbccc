"use client";
import React, { useState } from "react";
import Modal from "react-modal";

const ClockOut = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleOptionClick = (option) => {
    console.log(option);
    closeModal();
  };

  return (
    <div>
      <button onClick={openModal}>Clock Out</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Clock Out options"
        ClassName="modal"
        overlayClassName="overlay"
      >
        <button onClick={() => handleOptionClick("End Shift")}>
          End Shift
        </button>
        <button onClick={() => handleOptionClick("Lunch")}>Lunch</button>
        <button onClick={closeModal}>Home</button>
      </Modal>
    </div>
  );
};
export default ClockOut;
