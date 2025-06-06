import React from 'react';
import { Link } from 'react-router-dom';
import splitImage from '../../assets/images/splitImage.png'; 

const AuthLayout = ({ children }) => {
    return (
        <div className="flex h-screen"> 
            <div className="w-full md:w-1/2 px-6 md:px-12 pt-8 pb-6 flex flex-col justify-center">
                <Link to='/'>
                    <span className="mx-auto text-2xl font-black leading-none text-gray-900 select-none">
                        Orbit<span className="text-indigo-600">.</span>
                    </span>
                </Link>
                {children}
            </div>

            <div
                className="hidden md:flex w-full md:w-1/2 items-center justify-center p-6"
                style={{
                    backgroundImage: `url(${splitImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat', 
                    opacity: 0.7,
                    height: '100vh', 
                }}
            />
            <div
                className="absolute text-white px-4 text-center hidden md:block"
                style={{ top: '50%', right: '10%' }} 
            >
                <h1 className="text-2xl md:text-4xl font-bold leading-snug">
                    Keep all your tasks<br /> in perfect <span className='font-black text-gray-900'>Orbit</span><span className="text-primary">.</span>
                </h1>
            </div>
        </div>
    );
};

export default AuthLayout;
