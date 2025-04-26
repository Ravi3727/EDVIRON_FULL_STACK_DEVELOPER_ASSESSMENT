import React, { useState } from 'react';
import axios from 'axios';

const CheckPaymentStatus = () => {
  const [collectRequestId, setCollectRequestId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckStatus = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/payments/check-status`,
        {
          params: {
            collect_request_id: collectRequestId,
            school_id: schoolId,
          },
        }
      );

      setStatus(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-center">Check Payment Status</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Collect Request ID</label>
        <input
          type="text"
          value={collectRequestId}
          onChange={(e) => setCollectRequestId(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring focus:ring-blue-300"
          placeholder="e.g. 680b28f2cb70eb51f077ca5a"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">School ID</label>
        <input
          type="text"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg outline-none focus:ring focus:ring-blue-300"
          placeholder="e.g. 65b0e6293e9f76a9694d84b4"
        />
      </div>

      <button
        onClick={handleCheckStatus}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Checking...' : 'Check Status'}
      </button>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      {status && (
        <div className="bg-gray-50 p-4 mt-4 border rounded-md">
          <p><span className="font-semibold">Status:</span> {status.status}</p>
          <p><span className="font-semibold">Amount:</span> ₹{status.data.amount}</p>
        </div>
      )}
    </div>
  );
};

export default CheckPaymentStatus;
