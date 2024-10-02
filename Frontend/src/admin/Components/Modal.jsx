import React, { useState } from "react";

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    // Body scroll disable karna
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    // Body scroll wapas enable karna
    document.body.style.overflow = "auto";
  };

  return (
    <div>
      {/* Modal Trigger Button */}
      <button
        onClick={openModal}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Open Modal
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          {/* Overlay for disabling background */}
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-2xl font-bold mb-4">This is the Modal</h2>
              <p className="mb-4">Your modal content goes here...</p>
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Close Modal
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Modal;
