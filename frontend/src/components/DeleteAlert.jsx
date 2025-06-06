import React from 'react'

const DeleteAlert = ({ content, onDelete, onClose }) => {
    return (
        <div>
            <p className="text-sm">
                {content}
            </p>
            <div className="flex justify-end mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 mx-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                    Cancel
                </button>
                <button className='flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 whitespace-nowrap
                bg-rose-50 border border-rose-100 rounded-lg px-4 py-2 cursor-pointer'
                    type='button'
                    onClick={onDelete}>
                    Delete
                </button>
            </div>

        </div>
    )
}

export default DeleteAlert