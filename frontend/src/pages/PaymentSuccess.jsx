import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const query = new URLSearchParams(useLocation().search);
  const status = query.get("status");

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900">
      {status === "SUCCESS" ? (
        <div className="flex flex-col justify-evenly items-center ">
            <h2 className="text-2xl font-bold text-black leading-12 dark:text-white">🎉 Payment was successful! 🎉</h2>
            <p className="mt-4 text-lg">Thank you for your payment.</p>
            <p className="mt-2 text-lg">Your transaction has been completed successfully.</p>
            <a href="/" className="mt-6 px-4 py-2 bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:text-white text-black rounded dark:hover:bg-gray-800">
                Go to Dashboard
            </a>
        </div>
      ) : (
        <div className="flex flex-col justify-evenly items-center ">
            <h2 className="text-2xl font-bold text-red-600 leading-12 dark:text-white">❌ Payment failed ❌</h2>
            <p className="mt-4 text-lg">Unfortunately, your payment was not successful.</p>
            <p className="mt-2 text-lg">Please try again or contact support.</p>
            <a href="/" className="mt-6 px-4 py-2 bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:text-white  text-black rounded dark:hover:bg-gray-800">
                Go to Dashboard
            </a>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess
