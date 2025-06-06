import React from 'react';
import { IoSearchOutline } from "react-icons/io5";

const SearchInput = ({ value, onChange, placeholder }) => {
    return (
        <div className="flex items-center w-full md:w-1/2 relative my-4">
            <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-10 py-2 bg-white 
                    focus:ring-primary focus:outline-none text-[14px] text-gray-700 shadow-sm"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            <span className="absolute left-3 text-gray-400">
                <IoSearchOutline className="w-5 h-5" />
            </span>
        </div>
    );
};

export default SearchInput;
