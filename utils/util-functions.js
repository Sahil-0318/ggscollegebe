import nodemailer from 'nodemailer'

export const generateUserId = (email, mobileNumber) => {
    const namePart = email.split('@')[0]; // part before @
    const mobileDigits = mobileNumber.toString();

    const getRandomChars = (str, count) => {
        let result = '';
        for (let i = 0; i < count; i++) {
            result += str[Math.floor(Math.random() * str.length)];
        }
        return result;
    };

    // Pick 4 random characters from name and 4 digits from mobile
    const randomFromEmail = getRandomChars(namePart, 4);
    const randomFromMobile = getRandomChars(mobileDigits, 4);

    const userId = (randomFromEmail + randomFromMobile + "@SGGS").toUpperCase();
    return userId;
}

export const generatePassword = () => {
    const length = 8;
    const charset = "ABC0DEF1GHI2JKL3MNO4PQR5STU6VWX7Y89";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

export const sendCredentialsOnEmail = (email, userId, password) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail.com',
        // port: 587,
        port: 465,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Login Credentials',
        text: `Dear Student,\nYour login credentials are :\nUserId is ${userId} and Password is ${password}. \n \nSGGS College, Patna City`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error while sending credentials to email ::', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}