import User from '../models/userModel/userSchema.js'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import unirest from 'unirest'


const register = (req, res) => {
    res.render('register')
}

const registerPost = async (req, res) => {
    try {
        let { fullName, gender, dOB, mobileNumber, email } = req.body
        let lCEmail = email.toLowerCase()
        
        
        // Generate userName Function
        let generateUserName = () => {
            return (lCEmail.slice(0, 6) + mobileNumber.slice(3, 7) + "@MDCN")
        }
        let createdUserName = generateUserName().toUpperCase()
        
        // Generate Password Function
        let generatePassword = () => {
            let pass = ""
            for (let index = 0; index < 8; index++) {
                pass = pass + Math.floor(Math.random() * 10)
            }
            return pass
        }
        let createdPassword = generatePassword()
        console.log(lCEmail);
        console.log(createdPassword);

        const existEmail = await User.findOne({ email : lCEmail })
        const existMobileNo = await User.findOne({ mobileNumber })
        
        if (existEmail === null && existMobileNo === null) {
            const hashpassword = await bcrypt.hash(createdPassword, 10)
            const registerUser = new User({
                fullName,
                gender,
                dOB,
                mobileNumber,
                email: lCEmail,
                userName: createdUserName,
                password: hashpassword
            })

            const registered = await registerUser.save();

            // sending userName and password through mail
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
                to: lCEmail,
                subject: 'Login Credentials',
                // text: 'Yout CLC approved... 🎉',
                text: `Dear Students, Your login credentials are \nUserName is ${createdUserName} and Password is ${createdPassword}. \n \n MD College, Patna`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error while sending credentials to email ::', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });

            //sending userName and password on mobile
            var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            req.headers({
                "authorization": process.env.FAST2SMS_API
            });

            req.form({
                "sender_id": process.env.DLT_USER_PSSWORD_SENDER_ID,
                "message": process.env.YOUR_USER_PSSWORD_MESSAGE_ID,
                "variables_values": `${createdUserName}|${createdPassword}`,
                "route": "dlt",
                "numbers": mobileNumber,
            });

            req.end(function (res) {
                if (res.error) {
                    console.error('Request error:', res.error);
                    return; // Exit the function if there's an error
                }

                if (res.status >= 400) {
                    console.error('Error response:', res.status, res.body);
                    return; // Exit the function if the response status code indicates an error
                }

                console.log('Success:', res.body);
            });

            res.status(201).redirect('login')
        }
        else if (existMobileNo!==null){
            res.render('register', {"invalidMobile" : 'Mobile No already exists...'});
        }
        else{
            res.render('register', {"invalid" : 'Email already exists...'});
        }

    } catch (err) {
        console.log(err);
        res.status(400).render('error');
    }
}

export {
    register,
    registerPost
}