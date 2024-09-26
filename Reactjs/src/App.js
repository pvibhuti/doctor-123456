
import './App.css';
import Home from './components/common/home';
import Login from './components/common/login';
import RegisterForm from './components/common/register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DoctorDashboard from './routes/doctor/doctorDashboard';
import PatientDashboard from './routes/patient/patientDashboard';
import Appointment from './components/layout/doctor/appointment';
import MyProfile from './components/layout/doctor/doctorProfile';
import UpdateProfile from './components/layout/doctor/updateProfile';
import ChangePassword from './routes/doctor/changePassword';
import ForgetPassword from './routes/doctor/fogetPassword';
import OtpForm from './routes/doctor/otpForm';
import PatientProfile from './components/patient/patientProfile';
import UpdatePatientProfile from './components/patient/updatePatientProfile';
import AppointmentLists from './routes/patient/appointmentList';
import ChangePatientPassword from './routes/patient/changePatientPassword';
import ForgotPatientPassword from './routes/patient/forgotPatientPassword';
import Otp from './routes/patient/otp';
import BookAppointment from './routes/patient/bookAppintment';

function App() {
  return (
    <div>
      {/* <Home /> */}
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/bookApointment' element={<Login />} />
          <Route path='/register' element={<RegisterForm />} />

          <Route path='/doctorDashboard' element={<DoctorDashboard />} />
          <Route path='/patientDashboard' element={<PatientDashboard />} />

          <Route path='/appointment' element={<Appointment />} />
          <Route path='/appointmentlists' element={<AppointmentLists />} />

          <Route path='/myProfile' element={<MyProfile />} />
          <Route path='/patientProfile' element={<PatientProfile />} />

          <Route path='/updateProfile' element={<UpdateProfile />} />
          <Route path='/updatePatientProfile' element={<UpdatePatientProfile />} />

          <Route path='/changePassword' element={<ChangePassword />} />
          <Route path='/changePatientPassword' element={<ChangePatientPassword />} />

          <Route path='/forgetPassword' element={<ForgetPassword />} />
          <Route path='/forgotPatientPassword' element={<ForgotPatientPassword />} />

          <Route path='/otpForm' element={<OtpForm />} />
          <Route path='/otp' element={<Otp />} />

          <Route path='/bookAppointment' element={<BookAppointment />} />
          
          {/* <RegisterForm /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
