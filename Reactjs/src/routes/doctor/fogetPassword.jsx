import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import OtpForm from './otpForm';
import decryptionProcess from "../../components/common/decrypt.jsx";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ForgotPassword = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email format').required('Required'),
    }),
    onSubmit: async (values) => {
      setError('');
      setMessage('');

      try {
        const response = await api.post('http://localhost:8080/sendOTPForgotPassword', {
          email: values.email,
        });
        const decryption = await decryptionProcess(response);
        setMessage(decryption);
        setOtpSent(true);
        alert("Email Sent Successfully.");
        navigate("/otpForm");
      } catch (err) {
        setError(err.response?.data?.message || 'Error sending OTP');
      }
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-xl font-bold text-gray-700 mb-6">
          Forgot Password
        </h2>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {!otpSent ? (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
                required
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              ) : null}
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-2"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <OtpForm email={formik.values.email} />
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;