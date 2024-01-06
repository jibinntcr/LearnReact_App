import React, { useState } from "react";

const Sidebar1 = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="w-64 bg-gray-800 h-screen">
            <div className="text-white text-xl font-semibold p-5">Logo</div>
            <ul className="p-2">
                <li className="text-gray-400 hover:text-white cursor-pointer py-1">
                    Menu Item 1
                </li>
                <li className="text-gray-400 hover:text-white cursor-pointer py-1">
                    Menu Item 2
                </li>
                <li
                    className="relative text-gray-400 hover:text-white cursor-pointer py-1"
                    onClick={toggleDropdown}
                >
                    Menu Item 3
                    {isDropdownOpen && (
                        <ul className="absolute bg-gray-800 w-full">
                            <li className="p-2 text-white hover:bg-gray-700 cursor-pointer">
                                Submenu Item 1
                            </li>
                            <li className="p-2 text-white hover:bg-gray-700 cursor-pointer">
                                Submenu Item 2
                            </li>
                            <li className="p-2 text-white hover:bg-gray-700 cursor-pointer">
                                Submenu Item 3
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default Sidebar1;
