import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "../../assets/css/login.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('doctor'); // default to doctor

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    const handleSubmit = async (values) => {
        console.log('Form data', values);
        const url = userType === "patient" ? 'http://localhost:8080/loginPatient' : 'http://localhost:8080/loginDoctor';

        try {
            await axios.post(url, values);
            alert('Login Successful');
            navigate("/login");
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data) {
                toast.error(Object.values(error.response.data).toString());
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    };

    // const handleDoctorLogin = async (values) => {
    //     try {
    //         const response = await axios.post('http://localhost:8080/loginDoctor', values);
    //         console.log("Login Doctor", response.data);
    //         if (response.data.mac && response.data.value) {
    //             const decryptionResponse = await axios.post('http://localhost:8080/decryptionProcess', {
    //                 mac: response.data.mac,
    //                 value: response.data.value
    //             });
    //             if (decryptionResponse.data) {
    //                 localStorage.setItem("token", decryptionResponse.data.token);
    //                 alert('Login Successfully.');
    //                 navigate("/doctorDashboard");
    //             } else {
    //                 console.error('Unexpected data format after decryption:', decryptionResponse.data);
    //                 alert('Login Failed.');
    //                 navigate("/login");
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         if (error.response && error.response.data) {
    //             toast.error(error.response.data.message || 'Something went wrong');
    //         } else {
    //             toast.error('Network error. Please try again.');
    //         }
    //     }
    // };

    // const handlePatientLogin = async (values) => {
    //     try {
    //         const response = await axios.post('http://localhost:8080/loginPatient', values);
    //         console.log("Login Patient", response.data);

    //         if (response.data.mac && response.data.value) {
    //             const decryptionResponse = await axios.post('http://localhost:8080/decryptionProcess', {
    //                 mac: response.data.mac,
    //                 value: response.data.value
    //             });
    //             console.log("decryptionResponse", decryptionResponse);

    //             if (decryptionResponse.data) {
    //                 localStorage.setItem("token", decryptionResponse.data.token);
    //                 alert('Login Successfully.');
    //                 navigate("/patientDashboard");
    //             } else {
    //                 console.error('Unexpected data format after decryption:', decryptionResponse.data);
    //                 alert('Login Failed.');
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         if (error.response && error.response.data) {
    //             toast.error(error.response.data.message || 'Something went wrong');
    //         } else {
    //             toast.error('Network error. Please try again.');
    //         }
    //     }
    // };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                {/* <h2 className="text-2xl font-bold text-center mb-6">Login</h2> */}
                <h2 className="text-2xl font-bold text-center mb-6">Login as {userType === 'doctor' ? 'Doctor' : 'Patient'}</h2>

                {/* Toggle between doctor and patient */}
                <div className="mb-4 text-center">
                    <button
                        className={`px-4 py-2 mx-2 rounded ${userType === 'doctor' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setUserType('doctor')}
                    >
                        Doctor
                    </button>
                    <button
                        className={`px-4 py-2 mx-2 rounded ${userType === 'patient' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setUserType('patient')}
                    >
                        Patient
                    </button>
                </div>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    //     (values) => {
                    //     if (userType === 'doctor') {
                    //         handleDoctorLogin(values);
                    //     } else {
                    //         handlePatientLogin(values);
                    //     }
                    // }}
                >
                    {({ values }) => (
                        <Form>
                            {/* User Type Selector */}
                            <div className="mb-4">
                                <label htmlFor="userType" className="block text-gray-700 font-medium mb-1">Login As</label>
                                <Field
                                    as="select"
                                    name="userType"
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="doctor">Doctor</option>
                                    <option value="patient">Patient</option>
                                </Field>
                            </div>

                            {/* Email */}
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
                                <Field name="email" type="email" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter your email" />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Password */}
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
                                <Field name="password" type="password" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter your password" />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6">
                                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 w-full">
                                    Login as {userType === 'doctor' ? 'Doctor' : 'Patient'}
                                </button>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-gray-600">Don't have an account?</p>
                                <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                                    Sign Up
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;