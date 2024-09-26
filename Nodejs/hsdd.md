To implement the functionality of sending an email to the doctor after a successful appointment booking, you'll need to create a `sendMailToDoctor` function. This function will utilize an EJS template to format the email and send it with the appointment details. Here’s how you can structure it:

### 1. Install Necessary Packages

If you haven't already, ensure you have the necessary packages installed:

bash
npm install nodemailer ejs


### 2. Create the EJS Template

Create a new EJS file for the email template, e.g., `appointmentNotification.ejs`:

ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Notification</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { background: white; padding: 20px; border-radius: 5px; }
        h2 { color: #333; }
        p { line-height: 1.6; }
    </style>
</head>
<body>
    <div class="container">
        <h2>New Appointment Notification</h2>
        <p><strong>Patient Name:</strong> <%= patientName %></p>
        <p><strong>Patient Age:</strong> <%= patientAge %></p>
        <p><strong>Disease:</strong> <%= disease %></p>
        <p><strong>Appointment Date:</strong> <%= appointmentDate %></p>
        <p><strong>Appointment Time:</strong> <%= appointmentTime %></p>
        <p><strong>Message:</strong> <%= message %></p>
        <p>Thank you for your attention.</p>
    </div>
</body>
</html>


### 3. Create the `sendMailToDoctor` Function

Now, implement the `sendMailToDoctor` function in your controller:

javascript
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const sendMailToDoctor = async (doctorEmail, appointmentDetails) => {
    try {
        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service
            auth: {
                user: 'mailto:your-email@gmail.com',
                pass: 'your-email-password'
            }
        });

        // Load the EJS template
        const templatePath = path.join(__dirname, 'path/to/appointmentNotification.ejs');
        const template = fs.readFileSync(templatePath, 'utf-8');

        // Render the EJS template with the appointment details
        const htmlContent = ejs.render(template, appointmentDetails);

        // Define mail options
        const mailOptions = {
            from: 'mailto:your-email@gmail.com',
            to: doctorEmail,
            subject: 'New Appointment Notification',
            html: htmlContent
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


### 4. Modify the `bookAppointment` Function

Now, update your `bookAppointment` function to call `sendMailToDoctor` after successfully creating the appointment:

javascript
exports.bookAppointment = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, "jwt_secret");
        const patientId = decoded.userId;

        const userData = await patient.findById(patientId);
        if (!userData) {
            return sendError(req, res, { message: "User Not Found" }, 404);
        }

        const { doctorId, appointmentDate, appointmentTime, appointmentFor } = req.body;

        if (!doctorId) {
            return sendError(req, res, { message: "doctorId is Required" });
        }

        if (moment(appointmentDate).isBefore(moment(), 'day')) {
            return sendError(req, res, { message: "Date must be today or later." }, 400);
        }

        const existingAppointment = await appointment.findOne({
            doctorId,
            appointmentDate,
            appointmentTime,
        });

        if (existingAppointment) {
            return sendError(req, res, { message: "Doctor is already booked at this time." }, 400);
        }

        const newAppointment = await appointment.create({
            doctorId,
            patientId,
            appointmentFor,
            appointmentDate,
            appointmentTime,
            disease: req.body.disease,
            message: req.body.message,
        });

        // Prepare appointment details for the email
        const appointmentDetails = {
            patientName: userData.name,
            patientAge: userData.age,
            disease: req.body.disease,
            appointmentDate,
            appointmentTime,
            message: req.body.message
        };

        // Send email to the doctor
        const doctorData = await doctor.findById(doctorId); // Assume this fetches doctor's email
        await sendMailToDoctor(doctorData.email, appointmentDetails);

        return sendSuccess(req, res, {
            message: "Appointment registered successfully."
        });
    } catch (error) {
        console.error('Error registering appointment:', error);
        return sendError(req, res, {
            message: "Appointment not created.",
            error: error.message,
        }, 500);
    }
};


### Summary

This setup will send a well-structured email to the doctor whenever a new appointment is booked. Make sure to replace placeholders with actual values (like your email service credentials) and adjust paths as necessary. Always remember to handle sensitive information securely!
