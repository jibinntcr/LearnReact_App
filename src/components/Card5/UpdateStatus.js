import React, { useState } from 'react';
import { MdMoreVert } from 'react-icons/md';


const UpdateStatus = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* <div
        onClick={toggleDropdown}
        className=" text-white font-semibold py-2 px-4 rounded-md shadow-md cursor-pointer flex items-center justify-between"
      >
         */}
        <MdMoreVert onClick={toggleDropdown}
        
        />
      {/* </div> */}
      {isOpen && (
        <ul className="absolute top-10 left-0 bg-white shadow-md w-48 rounded-md py-2">
          <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer">Option 1</li>
        </ul>
      )}
    </div>
  );
};

export default UpdateStatus;
