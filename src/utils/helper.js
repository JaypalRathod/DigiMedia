import crypto from 'crypto';
import nodemailer from 'nodemailer';

function fail(res, msg) {
    return res.status(200).send({ status: 0, message: msg, data: null });
}

function success(res, msg, data) {
    return res.status(200).send({ status: 1, message: msg, data: data });
}

function md5Hash(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

function generateOTP() {
    // return "1234";
    // Generate a random 4-digit number
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
}

async function sendEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'creativejaypal@gmail.com',
            pass: 'utij vqsp emkg vnso'
        }
    });

    const mailOptions = {
        from: 'creativejaypal@gmail.com',
        to: email,
        subject: 'Your Friendzy Verification Code:',
        text: `Dear User,\n\n Your Otp ${otp} for Friendzy.`
    }

    await transporter.sendMail(mailOptions);
}

export {
    fail,
    success,
    md5Hash,
    generateOTP,
    sendEmail
};
