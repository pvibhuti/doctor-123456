import React, { useEffect, useState } from 'react';
import axios from 'axios';
import decryptionProcess from "../../common/decrypt.jsx";
import { Link } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState({ day: 'today', time: '', status: '' });
    const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const token = localStorage.getItem('token');

    const api = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });


    const fetchAppointments = async () => {
        try {
            const response = await api.get('/getAppointment', { params: filter });
            const decryption = await decryptionProcess(response);
            setAppointments(decryption.allAppointments || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchAppointmentCounts = async () => {
        try {
            const response = await api.get('/getAppointmentCounts');
            const decryption = await decryptionProcess(response);
            setCounts({
                total: decryption.total || 0,
                pending: decryption.pending || 0,
                approved: decryption.approved || 0,
                rejected: decryption.rejected || 0,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchAppointments();
        fetchAppointmentCounts();
    }, [filter]);

    const handleAppointmentAction = async (action, appointmentId) => {
        if (action === 'Approve') {
            try {
                const response = await api.post(`/approveAppointment?id=${appointmentId}`);
                await decryptionProcess(response);
                alert('Appointment Approved Successfully.');
                fetchAppointments();
                fetchAppointmentCounts();
            } catch (error) {
                console.error('Error:', error);
                if (error.response && error.response.data) {
                    toast.error(Object.values(error.response.data).toString());
                } else {
                    toast.error('An unexpected error occurred. Please try again.');
                }
                alert('Failed to approve appointment.');
            }
        } else {
            try {
                const response = await api.post(`/rejectAppointment?id=${appointmentId}`);
                await decryptionProcess(response);
                alert('Appointment Rejected.');
                fetchAppointments();
                fetchAppointmentCounts();
            } catch (error) {
                console.error('Error:', error);
                if (error.response && error.response.data) {
                    toast.error(Object.values(error.response.data).toString());
                } else {
                    toast.error('An unexpected error occurred. Please try again.');
                }
                alert('Failed to reject appointment.');
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Appointments</h1>

            {/* {/ Filters /} */}
            <div className="flex mb-6">
                <div className="mr-4">
                    <label className="block text-sm font-medium">Filter by Day</label>
                    <select
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                        value={filter.day}
                        onChange={(e) => setFilter({ ...filter, day: e.target.value })}
                    >
                        <option value="today">Today</option>
                        <option value="tomorrow">Tomorrow</option>
                        <option value="before">Before Today</option>
                        <option value="under_week">Under a Week</option>
                        <option value="month">This Month</option>
                        <option value="all">All</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Filter by Time</label>
                    <input
                        type="time"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                        value={filter.time}
                        onChange={(e) => setFilter({ ...filter, time: e.target.value })}
                    />
                </div>
                <div className="mr-4 ml-4">
                    <label className="block text-sm font-medium">Filter by Status</label>
                    <select
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <Link to="/doctorDashboard">
                    <button className="flex items-center space-x-2 px-5 py-3 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        <IoHome className="w-3 h-3" />
                        <span>Back to Dashboard</span>
                    </button>
                </Link>
            </div>

            {/* {/ Cards showing count summary for each status /} */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-200 shadow-md rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold">Total Appointments</h3>
                    <p className="text-2xl font-semibold">{counts.total}</p>
                </div>
                <div className="bg-blue-100 shadow-md rounded-lg p-4 text-center ">
                    <h3 className="text-lg font-bold">Pending Appointments</h3>
                    <p className="text-2xl font-semibold">{counts.pending}</p>
                </div>
                <div className="bg-pink-200 shadow-md rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold">Approved Appointments</h3>
                    <p className="text-2xl font-semibold">{counts.approved}</p>
                </div>
                <div className="bg-green-200 shadow-md rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold">Rejected Appointments</h3>
                    <p className="text-2xl font-semibold">{counts.rejected}</p>
                </div>
            </div>

            {/* {/ Appointment List /} */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold">All Appointments</h2>
                <table className="min-w-full mt-4 bg-white shadow-md rounded">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Patient Name</th>
                            <th className="py-2 px-4 border-b">Date</th>
                            <th className="py-2 px-4 border-b">Time</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">{appointment.patientId.fullName}</td>
                                <td className="py-2 px-4 border-b">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">{appointment.appointmentTime}</td>
                                <td className="py-2 px-4 border-b">
                                    {appointment.status === 0 ? "Pending" : appointment.status === 1 ? "Approved" : "Rejected"}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {appointment.status === 0 ? (
                                        <>
                                            <button
                                                onClick={() => handleAppointmentAction('Approve', appointment._id)}
                                                className="bg-green-500 text-white px-2 py-1 rounded"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAppointmentAction('Reject', appointment._id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <span>
                                            {appointment.status === 1 ? (
                                                <span className="bg-green-200 text-white px-2 py-1 rounded"> Approved </span>
                                            ) : (
                                                <span className="bg-red-200 text-white px-2 py-1 rounded"> Rejected </span>
                                            )}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Appointments;