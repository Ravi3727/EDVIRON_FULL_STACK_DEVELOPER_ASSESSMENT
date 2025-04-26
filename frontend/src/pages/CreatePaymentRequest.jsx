import React, { useState } from 'react';
import axios from 'axios';


const CreatePaymentRequest = () => {
  const [schoolId, setSchoolId] = useState('');
  const [trusteeId, setTrusteeId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [gatewayName, setGatewayName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleCreatePayment = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/payments/create-payment`, {
        school_id: schoolId,
        trustee_id: trusteeId,
        student_info: {
          name: studentName,
          id: studentId,
          email: studentEmail,
        },
        gateway_name: gatewayName,
        amount: parseFloat(amount),
      },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        });

      console.log(res.data.data.collect_request_url);
      setResponse(res.data.data.collect_request_url);
      const newTab = window.open(res.data.data.collect_request_url, '_blank');
      if (newTab) newTab.focus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    setSchoolId('65b0e6293e9f76a9694d84b4');
    setTrusteeId('65a123abc9f76a9694d9999b');
    setStudentId('stu_003');
    setStudentName('demo');
    setStudentEmail('ravikant@example.com');
    setGatewayName('edviron 3');
    setAmount('3000');
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-gray-300 dark:bg-gray-800 p-6 rounded-xl shadow space-y-5">
      <h2 className="text-xl font-bold text-center">Create Payment</h2>

      <div className="grid grid-cols-1 gap-4">
        <input type="text" placeholder="School ID" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="input p-4 text-sm font-semibold rounded-md text-black" />
        <input type="text" placeholder="Trustee ID" value={trusteeId} onChange={(e) => setTrusteeId(e.target.value)} className="input p-4 text-sm font-semibold rounded-md text-black" />
        <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="input p-4 text-sm font-semibold rounded-md text-black" />
        <input type="text" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="input p-4 text-sm font-semibold rounded-md text-black" />
        <input type="email" placeholder="Student Email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} className="input p-4 text-sm font-semibold rounded-md text-black" />
        <input type="text" placeholder="Gateway Name" value={gatewayName} onChange={(e) => setGatewayName(e.target.value)} className="input p-4 text-sm font-semibold rounded-md text-black" />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="input p-4 text-sm font-semibold rounded-md text-black" />
      </div>

      <div className="flex gap-3">
        <button onClick={handleCreatePayment} disabled={loading} className="flex-1 bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? 'Creating...' : 'Pay'}
        </button>
        <button onClick={handleAutoFill} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
          Auto Fill
        </button>
      </div>
    </div>
  );
};

export default CreatePaymentRequest;
