import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const LandingHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <>
            <section
                className="w-full px-8 sticky top-0 z-50 bg-white text-gray-700"
                id="header"
            >
                <div className="container flex flex-wrap items-center justify-between py-5 mx-auto md:flex-row max-w-7xl">
                    <div className="relative flex flex-row items-center justify-between w-full md:w-auto">
                        <a
                            href="#"
                            className="text-xl font-bold leading-none select-none "
                        >
                            <span className="mx-auto text-2xl font-black leading-none text-gray-900 select-none">Orbit<span className="text-primary">.</span></span>
                        </a>
                        <button
                            className="inline-flex items-center justify-center p-2 rounded-md md:hidden hover:text-gray-900 focus:outline-none"
                            onClick={toggleMenu}
                        >
                            {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                        </button>
                    </div>

                    <nav
                        className={`flex-col md:flex md:flex-row md:items-center md:static fixed top-0 right-0 h-full w-2/3 max-w-xs bg-white shadow-lg transform z-50 
                        ${menuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:shadow-none`}
                    >
                        <button
                            className="absolute top-5 right-5 md:hidden"
                            onClick={toggleMenu}
                        >
                            <FiX className="w-6 h-6" />
                        </button>

                        <a
                            href="#hero"
                            className="block px-4 py-2 mt-2 text-md font-medium hover:text-primary md:mt-0 whitespace-nowrap"
                        >
                            Home
                        </a>
                        <a
                            href="#about"
                            className="block px-4 py-2 mt-2 text-md font-medium hover:text-primary md:mt-0 whitespace-nowrap"
                        >
                            About
                        </a>
                        <a
                            href="#features"
                            className="block px-4 py-2 mt-2 text-md font-medium hover:text-primary md:mt-0 whitespace-nowrap"
                        >
                            What We Offer
                        </a>

                        <a
                            href="#contact"
                            className="block px-4 py-2 mt-2 text-md font-medium hover:text-primary md:mt-0 whitespace-nowrap"
                        >
                            Contact Us
                        </a>
                    </nav>

                    <div className="hidden md:flex items-center ml-5 space-x-6 lg:justify-end">
                        <Link to='/signup'>
                            <button
                                className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-primary border border-transparent rounded-md shadow-sm hover:bg-[#4338ca] focus:outline-none focus:ring-[#4338ca]"
                            >
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

        </>
    );
};

export default LandingHeader;


