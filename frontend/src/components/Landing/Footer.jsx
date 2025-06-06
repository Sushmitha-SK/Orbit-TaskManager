import { AiOutlineMail } from "react-icons/ai";
import { IoIosPhonePortrait } from "react-icons/io";
import { FaFacebookF, FaInstagram, FaTwitter, FaGithub } from 'react-icons/fa';
import { RiTwitterXFill } from "react-icons/ri";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <section className="bg-white" id="contact">
                <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
                    <nav className="flex flex-wrap justify-center -mx-5 -my-2">
                        <div className="px-5 py-2">
                            <a href="#hero" className="text-base leading-6 text-gray-500 hover:text-gray-900">
                                Home
                            </a>
                        </div>
                        <div className="px-5 py-2">
                            <a href="#about" className="text-base leading-6 text-gray-500 hover:text-gray-900">
                                About
                            </a>
                        </div>


                        <div className="px-5 py-2">
                            <a href="#features" className="text-base leading-6 text-gray-500 hover:text-gray-900">
                                What We Offer
                            </a>
                        </div>
                        <div className="px-5 py-2">
                            <a href="#contact" className="text-base leading-6 text-gray-500 hover:text-gray-900">
                                Contact
                            </a>
                        </div>
                        
                    </nav>

                    <div className="flex justify-center space-x-16 text-gray-700 text-sm my-6">
                        <div className="flex items-center space-x-3  p-3 rounded-md  max-w-xs">

                            <AiOutlineMail className='w-6 h-6' />
                            <div>
                                <h4 className="font-semibold text-gray-900">Email</h4>
                                <a href="mailto:support@orbit.com" className="text-primary hover:underline">
                                    support@orbit.com
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3  p-3 rounded-md max-w-xs">
                            <IoIosPhonePortrait className='w-6 h-6' />

                            <div>
                                <h4 className="font-semibold text-gray-900">Phone</h4>
                                <a href="tel:+1234567890" className="text-primary hover:underline">
                                    +1 (234) 567-890
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-8 space-x-6">
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Facebook</span>
                            <FaFacebookF className="w-4 h-4" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Instagram</span>
                            <FaInstagram className="w-4 h-4" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Twitter</span>
                            <RiTwitterXFill className="w-4 h-4" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">GitHub</span>
                            <FaGithub className="w-4 h-4" />
                        </a>

                    </div>
                    <p className="mt-8 text-sm leading-6 text-center text-gray-400">
                        &copy; Copyright Orbit {currentYear}. All rights reserved.
                    </p>
                </div>
            </section>
        </>
    )
}

export default Footer