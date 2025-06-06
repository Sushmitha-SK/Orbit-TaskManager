import React, { useState } from 'react';
import defaultAvatar from '../assets/images/user.png';

const AvatarGroup = ({ avatars, maxVisible = 3 }) => {
    const [fallbacks, setFallbacks] = useState({});

    const handleImageError = (index) => {
        setFallbacks((prevFallbacks) => ({
            ...prevFallbacks,
            [index]: true,
        }));
    };

    return (
        <div className='flex items-center'>
            {avatars.slice(0, maxVisible).map((avatar, index) => (
                <img
                    key={index}
                    src={
                        fallbacks[index] || !avatar
                            ? defaultAvatar
                            : avatar
                    }
                    alt={`Avatar ${index}`}
                    className='w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0'
                    onError={() => handleImageError(index)}
                />
            ))}
            {avatars.length > maxVisible && (
                <div className="w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3">
                    +{avatars.length - maxVisible}
                </div>
            )}
        </div>
    );
};

export default AvatarGroup;
