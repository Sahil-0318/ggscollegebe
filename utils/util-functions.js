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

export const sendCredentialsOnEmail = async (email, userId, password) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Login Credentials',
        text: `Dear Student,\nYour login credentials are:\nUserId: ${userId}\nPassword: ${password}\n\nSGGS College, Patna City`
    };

    return transporter.sendMail(mailOptions); // now returns a Promise
};