"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const PageLoader = () => {
    const [showLoader, setShowLoader] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false)
        }, 2500)
        return () => clearTimeout(timer)
    }, [])

    if (!showLoader) return null

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-linear-to-r from-gray-800 via-blue-700 to-gray-900 animate-gradient z-100">
            <motion.h1
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
                className="text-4xl md:text-6xl font-bold text-white mb-4 text-center"
            >
                Welcome to School Dashboard
            </motion.h1>

            <motion.div
                className="flex space-x-3 mt-6 z-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                <motion.div
                    className="w-5 h-5 bg-white rounded-full"
                    animate={{
                        y: [0, -20, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "easeInOut",
                        delay: 0,
                    }}
                />
                <motion.div
                    className="w-5 h-5 bg-white rounded-full"
                    animate={{
                        y: [0, -20, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "easeInOut",
                        delay: 0.2,
                    }}
                />
                <motion.div
                    className="w-5 h-5 bg-white rounded-full"
                    animate={{
                        y: [0, -20, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "easeInOut",
                        delay: 0.4,
                    }}
                />
            </motion.div>
        </div>
    )
}

export default PageLoader
