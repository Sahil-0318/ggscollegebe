import User from '../models/userModel/userSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import unirest from 'unirest'
import nodemailer from 'nodemailer'

import ugRegularPart3User from "../models/userModel/UG-Regular-Part-3/user.js"
import bca1UserModel from "../models/userModel/BCA-1/user.js"
import bca2UserModel from "../models/userModel/BCA-2/user.js"
import InterExamFormList from "../models/adminModel/interExamFormList.js"
import ugRegularSem4User from "../models/userModel/UG-Regular-Sem-4/user.js"

const login = (req, res) => {
    res.render('login')
}

const loginPost = async (req, res) => {
    try {
        const { userName, password } = req.body
        const result = await User.findOne({ userName })

        if (result != null) {
            const isMatch = await bcrypt.compare(password, result.password)
            if (result.userName == userName && isMatch && result.isSuperAdmin == true) {
                // console.log(result);

                const token = jwt.sign({
                    id: result._id,
                    email: result.email,
                    isAdmin: result.isAdmin
                }, process.env.SECRET_KEY,
                    { expiresIn: "1d" })
                res.cookie('uid', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                return res.redirect('superAdminPage')
            }
            else if (result.userName == userName && isMatch && result.isAdmin == true) {
                // console.log(result);

                const token = jwt.sign({
                    id: result._id,
                    email: result.email,
                    isAdmin: result.isAdmin
                }, process.env.SECRET_KEY,
                    { expiresIn: "1d" })
                res.cookie('uid', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                return res.redirect('adminPage')
            }
            else if (result.userName == userName && isMatch && result.isRecordRoom == true) {
                // console.log(result);

                const token = jwt.sign({
                    id: result._id,
                    email: result.email,
                    isAdmin: result.isAdmin
                }, process.env.SECRET_KEY,
                    { expiresIn: "1d" })
                res.cookie('uid', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                return res.redirect('recordRoomPage')
            }
            else if (result.userName == userName && isMatch) {
                // console.log(result);

                const token = jwt.sign({
                    id: result._id,
                    userName: result.userName,
                    email: result.email,
                    isAdmin: result.isAdmin
                }, process.env.SECRET_KEY,
                    { expiresIn: "1d" })
                res.cookie('uid', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                return res.redirect('userPage')
            } else {
                return res.render('login', { "invalid": "Invalid Username or Password" })
                // res.send('Invalid email or password')
            }
        } else {
            return res.redirect('register')
        }
    } catch (error) {
        console.log(error);

    }
}

const logout = async (req, res) => {
    res.clearCookie("uid");
    res.status(201).redirect('http://localhost:5001')
}


// Main Password Recovery
const recoverPassword = async (req, res) => {
    try {
        res.render("recoverPassword")

    } catch (error) {
        console.log("Error in recoverPassword", error)
    }
}

const recoverPasswordPost = async (req, res) => {
    try {
        const { mobileNumber } = req.body

        const foundUser = await User.findOne({ mobileNumber })
        // Generate Password Function
        let generatePassword = () => {
            let pass = ""
            for (let index = 0; index < 8; index++) {
                pass = pass + Math.floor(Math.random() * 10)
            }
            return pass
        }
        let createdPassword = generatePassword()

        if (foundUser !== null) {
            const hashpassword = await bcrypt.hash(createdPassword, 10)
            await User.findOneAndUpdate({ mobileNumber }, { $set: { password: hashpassword } })

            var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            req.headers({
                "authorization": process.env.FAST2SMS_API
            });

            req.form({
                "sender_id": process.env.DLT_USER_PSSWORD_SENDER_ID,
                "message": process.env.YOUR_USER_PSSWORD_MESSAGE_ID,
                "variables_values": `${foundUser.userName}|${createdPassword}`,
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

            res.status(201).redirect('/login')
        } else {
            res.render("recoverPassword", { invalid: "Please enter registerd mobile number." })
        }

    } catch (error) {
        console.log("Error in recoverPasswordPost", error)
    }
}


// portal Password Recovery
const forgotPassword = async (req, res) => {
    try {
        const portal = req.params.portal
        let registerRoute = ''
        if (portal === "ugRegularPart3") {
            registerRoute = "ugRegularPart3Signup"
        }

        if (portal === "bcaPart1") {
            registerRoute = "bca1Signup"
        }

        if (portal === "bcaPart2") {
            registerRoute = "bca2Signup"
        }

        if (portal === "interExamForm") {
            registerRoute = "interExamFormSignup"
        }

        if (portal === "ugRegularSem4") {
            registerRoute = "ugRegularSem4Signup"
        }

        res.render("forgotPassword", { portal, registerRoute })

    } catch (error) {
        console.log("Error in forgotPassword", error)
    }
}

const forgotPasswordPost = async (req, res) => {
    try {
        const { mobileNumber, portal } = req.body
        let foundUser = ''
        let userId = ""
        let password = ""
        let registerRoute = ""
        let redirectLink = ""

        if (portal === "ugRegularPart3") {
            foundUser = await ugRegularPart3User.findOne({ mobileNumber })
            registerRoute = "ugRegularPart3Signup"
            if (foundUser !== null) {
                userId = foundUser.userId
                password = foundUser.password
            }
            redirectLink = "ugRegularPart3Login"
        }

        if (portal === "bcaPart1") {
            foundUser = await bca1UserModel.findOne({ mobileNumber })
            registerRoute = "bca1Signup"
            if (foundUser !== null) {
                userId = foundUser.userId
                password = foundUser.password
            }
            redirectLink = "bca1Login"
        }

        if (portal === "bcaPart2") {
            foundUser = await bca2UserModel.findOne({ mobileNumber })
            registerRoute = "bca2Signup"
            if (foundUser !== null) {
                userId = foundUser.userId
                password = foundUser.password
            }
            redirectLink = "bca2Login"
        }

        if (portal === "interExamForm") {
            foundUser = await InterExamFormList.findOne({ mobileNumber })
            registerRoute = "interExamFormSignup"
            if (foundUser !== null) {
                userId = foundUser.userID
                password = foundUser.password
            }
            redirectLink = "interExamFormLogin"
        }

        if (portal === "ugRegularSem4") {
            foundUser = await ugRegularSem4User.findOne({ mobileNumber })
            registerRoute = "ugRegularSem4Signup"
            if (foundUser !== null) {
                userId = foundUser.userId
                password = foundUser.password
            }
            redirectLink = "ugRegularSem4Login"
        }


        if (foundUser !== null) {
            var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            req.headers({
                "authorization": process.env.FAST2SMS_API
            });

            req.form({
                "sender_id": process.env.DLT_USER_PSSWORD_SENDER_ID,
                "message": process.env.YOUR_USER_PSSWORD_MESSAGE_ID,
                "variables_values": `${userId}|${password}`,
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

            if (foundUser.email) {

                // Sending userId and password on email
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
                    to: foundUser.email,
                    subject: 'Login Credentials',
                    // text: 'Yout CLC approved... 🎉',
                    text: `Dear Students, Your login credentials are \nUserName is ${userId} and Password is ${password}. \n \n MD College, Patna`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error while sending credentials to email :', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
            }

            res.status(201).redirect(redirectLink)
        } else {
            res.render("forgotPassword", { portal, registerRoute, invalid: "Please enter registerd mobile number." })
        }

    } catch (error) {
        console.log("Error in forgotPasswordPost", error)
    }
}

export {
    login,
    loginPost,
    logout,
    // Main Password Recovery
    recoverPassword,
    recoverPasswordPost,
    // Portal Password Recovery
    forgotPassword,
    forgotPasswordPost
}