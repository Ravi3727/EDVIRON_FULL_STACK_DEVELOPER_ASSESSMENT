import React from 'react'
import { GiReceiveMoney } from "react-icons/gi";

const TransactionAmountDisplayCard = ({totalAmount, todayAmount}) => {
    return (
        <>
            <div>
                <div className="bg-gray-200 dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4 md:min-w-44 md:min-h-44 min-w-28 min-h-28 flex flex-col justify-evenly ">
                    <div className='text-5xl w-16 h-16 rounded-full dark:bg-gray-400 bg-gray-400 p-2'>
                        <GiReceiveMoney />
                    </div>

                    <div className='flex flex-col jutsify-evenly items-start mt-2'>
                        <h2 className="text-sm font-semibold leading-6 text-gray-800 dark:text-white">Transaction Amount</h2>
                        <p className="text-gray-600 dark:text-gray-400 font-semibold text-sm">Total: <span className='text-lg font-semibold text-black dark:text-white'>₹{totalAmount}</span></p>
                        <p className="text-gray-600 dark:text-gray-400 font-semibold  text-sm">Today: <span className='text-lg font-semibold text-black dark:text-white'>₹{todayAmount}</span></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TransactionAmountDisplayCard