import React from 'react'
import { RiNumbersFill } from "react-icons/ri";


const NumberOfTransactionCard = ({totalTransactions, todayTransactions}) => {
    return (
        <>
            <div>
                <div className="bg-gray-200 dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4 md:min-w-44 md:min-h-44 w-48 h-44 flex flex-col justify-evenly ">
                    <div className='text-5xl w-16 h-16 rounded-full dark:bg-gray-400 bg-gray-400 p-2'>
                        <RiNumbersFill />
                    </div>
                    <div className='flex flex-col justify-evenly items-start mt-2'>
                        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Number of Transactions</h2>
                        <p className="text-gray-600 dark:text-gray-400">Total : <span className='text-lg font-semibold text-black dark:text-white'>{totalTransactions}</span></p>
                        <p className="text-gray-600 dark:text-gray-400">Today's : <span className='text-lg font-semibold text-black dark:text-white'>{todayTransactions}</span></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NumberOfTransactionCard
