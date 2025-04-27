import React from 'react'
import { TbNumbers } from "react-icons/tb";


const NumberOfSchools = ({totalSchools}) => {
    return (
        <>
            <div className="bg-gray-200 dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4 min-w-44 min-h-44 flex flex-col just-evenly items-start">

                <div className='text-5xl w-16 h-16 rounded-full dark:bg-gray-400 bg-gray-400 p-2'>
                    <TbNumbers />
                </div>
                <div className='flex flex-col justify-evenly items-start mt-2'>
                    <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Number of Schools</h2>
                    <p className="text-gray-600 dark:text-gray-400">Total Schools: <span className='text-lg font-semibold text-black dark:text-white'>{totalSchools}</span></p>
                </div>

            </div>
        </>
    )
}

export default NumberOfSchools