import React from 'react'
import { FiArrowRight } from "react-icons/fi";
import hero from '../../assets/images/dashboard.jpg'
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <>
            <section className="px-2 py-15 bg-white md:px-0" id="hero">
                <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
                    <div className="flex flex-wrap items-center sm:-mx-3">
                        <div className="w-full md:w-1/2 md:px-3">
                            <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">

                                    <span className="block xl:inline">Effortless Task Management with&nbsp;</span>
                                    <span className="block text-[#4f46e5] xl:inline">Orbit.</span>
                                </h1>
                                <p className="mx-auto text-base text-gray-500 sm:max-w-md lg:text-xl md:max-w-3xl">
                                    Take control of your tasks, boost productivity, and keep your team organized—all in one place.
                                </p>
                                <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                                    <Link
                                        to="/login"
                                        className="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-[#4f46e5] rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
                                    >
                                        Start Managing Tasks
                                        <FiArrowRight />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <div className="w-full h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl">
                                <img
                                    src={hero}
                                />

                            </div>

                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Hero
