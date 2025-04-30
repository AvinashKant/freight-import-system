import React from "react";

const ModalBox = ({ isOpen, onClose, title, children, widthClass = "max-w-4xl" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(178, 178, 172, 0.7)' }}>
            <div className={`bg-[#d9d9d6] rounded-lg w-full ${widthClass} shadow-xl relative border-2 border-[#B3B3B3]`}>
                {title && (
                    <div className="bg-white rounded-t-lg flex justify-between items-center mb-4 border-b py-2 px-4 border-gray-200">
                        <h2 className="text-md font-semibold">{title}</h2>
                        <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-3xl">
                            &times;
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

export default ModalBox;
