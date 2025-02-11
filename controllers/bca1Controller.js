import unirest from 'unirest'
import jwt from 'jsonwebtoken'
import FileUpload from '../fileUpload/fileUpload.js'
import PortalOnOff from '../models/adminModel/portalOnOffSchema.js'
import qrcode from 'qrcode'

import bca1UserModel from "../models/userModel/BCA-1/user.js"
import bca1FormModel from "../models/userModel/BCA-1/form.js"

// merit lists
import bca1MeritList1 from "../models/adminModel/BCA1MeritList/bca1MeritList1.js"


export const bca1Signup = async (req, res) => {
    try {
        const portal = await PortalOnOff.findOne({ portal: "bca1_24-27" })
        if (portal.isOn == true) {
            return res.render("bca1Signup")
        }
        if (portal.isOn == false) {
            return res.render('pageNotFound', { status: "BCA Part 1 (2024 - 27) admission has been closed.", loginPage: "bca1Login" })
        }
    } catch (error) {
        console.log("Error in get method bca1Signup", error)
    }
}


export const bca1SignupPost = async (req, res) => {
    try {
        // const { appNo, mobileNumber } = req.body
        const { fullName, mobileNumber, email } = req.body

        // const isExistAppNoInMeritList = await bca1MeritList1.findOne({ appNo })

        // if (isExistAppNoInMeritList != null) {
        // const isExistAppNoInUserModel = await bca1UserModel.findOne({ appNo })
        const isExistMobileNumber = await bca1UserModel.findOne({ mobileNumber })

        // if (isExistAppNoInUserModel == null && isExistMobileNumber == null) {
        if (isExistMobileNumber == null) {

            // Generate userName Function
            let generateUserName = () => {
                return (email.slice(0, 6) + mobileNumber.slice(3, 7) + "@MDCN").toUpperCase()
            }
            let createdUserName = generateUserName()

            // Generate Paaword Function
            let password = ""
            function generatePassword() {
                const characters = 'ABC0DEF1GHI2JKL3MNO4PQR5STU6VWX7Y89';
                let otp = '';
                for (let i = 0; i < 8; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    otp += characters[randomIndex];
                }
                return otp;
            }
            password = generatePassword()

            const newUser = new bca1UserModel({
                fullName: fullName.trim(),
                email: email.trim(),
                mobileNumber: mobileNumber.trim(),
                userId: createdUserName,
                password,
            })
            const savedUser = await newUser.save()

            var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            req.headers({
                "authorization": process.env.FAST2SMS_API
            });

            req.form({
                "sender_id": process.env.DLT_USER_PSSWORD_SENDER_ID,
                "message": process.env.YOUR_USER_PSSWORD_MESSAGE_ID,
                "variables_values": `${savedUser.userId}|${savedUser.password}`,
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

            res.status(201).redirect('bca1Login')

        } else {
            // res.render('bca1Signup', { "invalid": 'Application or Mobile Number already exists' })
            res.render('bca1Signup', { "invalid": 'Mobile Number already exists' })
        }

        // } else {
        //     res.render('bca1Signup', { "invalid": 'Invalid Application Number' })
        // }

    } catch (error) {
        console.log("Error in post method bca1SignupPost", error)
    }
}


export const bca1Login = async (req, res) => {
    try {
        res.render("bca1Login")
    } catch (error) {
        console.log("Error in get method bca1Login", error)
    }
}


export const bca1LoginPost = async (req, res) => {
    try {
        const { userId, password } = req.body
        const foundUser = await bca1UserModel.findOne({ userId, password })

        if (foundUser != null) {
            const token = jwt.sign(
                {
                    id: foundUser._id,
                    appNo: foundUser.appNo
                },
                process.env.SECRET_KEY,
                { expiresIn: "7d" }
            )

            res.cookie('uid', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
            res.status(201).redirect('bca1Form')

        } else {
            res.render('bca1Login', { "invalid": "Invalid userId or password" })
        }
    } catch (error) {
        console.log("Error in post method bca1LoginPost", error)
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("uid");
        res.status(201).redirect('https://www.mdcollegenaubatpur.ac.in/')
    } catch (error) {
        console.log("Error in get method logout", error)
    }
}


export const bca1Form = async (req, res) => {
    try {
        const user = await bca1UserModel.findOne({ _id: req.id })
        const appliedUser = await bca1FormModel.findOne({ appliedBy: user._id.toString() })
        if (appliedUser != null) {
            res.render('bca1Form', { user, appliedUser })
        } else {
            res.render('bca1Form', { user })
        }
    } catch (error) {
        console.log("Error in get method bca1Form", error)
    }
}


export const bca1FormPost = async (req, res) => {
    try {
        const user = await bca1UserModel.findOne({ _id: req.id })
        const { fullName, fatherName, mobileNumber, email, dOB, gender, motherName, category, aadharNumber, address, district, policeStation, state, pinCode, subject, subsidiary1, subsidiary2, examResult, obtMarks, fullMarks, obtPercent } = req.body

        const appliedUser = await bca1FormModel.findOne({ appliedBy: user._id.toString() })

        if (appliedUser == null) {
            const images = req.files

            // console.log(images[0].path);
            const photoUpload = await FileUpload(images[0].buffer)
            const photoURL = photoUpload.secure_url
            // console.log(photoURL);

            // console.log(images[1].path);
            const signUpload = await FileUpload(images[1].buffer)
            const signURL = signUpload.secure_url
            // console.log(signURL);

            const newForm = new bca1FormModel({
                fullName, fatherName, mobileNumber, email, dOB, gender, motherName, category, aadharNumber, address, district, policeStation, state, pinCode, subject: "Computer Application", subsidiary1: "Maths", subsidiary2: "English", examResult, obtMarks, fullMarks, obtPercent,
                studentPhoto: photoURL,
                studentSign: signURL,
                appliedBy: user._id
            })

            await newForm.save()
            await bca1UserModel.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isFormFilled: true } })
            res.redirect("/bca1Pay")

        } else {

        }
    } catch (error) {
        console.log("Error in post method bca 1 FormPost", error)
    }
}


export const bca1Pay = async (req, res) => {
    try {
        const user = await bca1UserModel.findOne({ _id: req.id })
        // console.log(user)
        const appliedUser = await bca1FormModel.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser)

        qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.fullName}`, function (err, src) {
            res.status(201).render('bca1PayPage', { "qrcodeUrl": src, upiId: process.env.UPI_ID, user, appliedUser })
        })

        // if (appliedUser.admissionFee == 15250) {
        //     qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=15250&tn=${appliedUser.fullName}`, function (err, src) {
        //         res.status(201).render('bca1PayPage', { "qrcodeUrl": src, user, appliedUser, upiId: process.env.UPI_ID, })
        //     })
        // }
        // if (appliedUser.admissionFee == 15500) {
        //     qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=15500&tn=${appliedUser.fullName}`, function (err, src) {
        //         res.status(201).render('bca1PayPage', { "qrcodeUrl": src, user, appliedUser, upiId: process.env.UPI_ID, })
        //     })
        // }
    } catch (error) {
        console.log("Error in get method bca1Pay", error)
    }
}


export const bca1PayPost = async (req, res) => {
    try {
        const { refNo } = req.body
        const user = await bca1UserModel.findOne({ _id: req.id })
        const appliedUser = await bca1FormModel.findOne({ appliedBy: user._id.toString() })

        const existPaymentId = await bca1FormModel.findOne({ paymentId: refNo })

        if (existPaymentId === null) {
            const photoUpload = await FileUpload(req.file.buffer)
            const paymentSSURL = photoUpload.secure_url

            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const dateAndTimeOfPayment = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`

            let receiptNo = `MDC-${Date.now()}`
            let paidCount = await bca1FormModel.find({isPaid: true})
            // console.log(paidCount)
            let collegeRollNumber = Number(paidCount.length) + 21
            // console.log(collegeRollNumber)

            await bca1FormModel.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL, dateAndTimeOfPayment, paymentId: refNo, isPaid: true, receiptNo, collegeRollNumber } })

            res.redirect("/bca1Receipt")
        } else {
            qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.fullName}`, function (err, src) {
                res.status(201).render('bca1PayPage', { "qrcodeUrl": src, upiId: process.env.UPI_ID, user, appliedUser, invalid: "Please enter valid UTR / Ref no. (कृपया वैध यूटीआर/रेफ नंबर दर्ज करें।)" })
            })
        }
    } catch (error) {
        console.log("Error in post method bca1PayPost", error)

    }
}


export const bca1Receipt = async (req, res) =>{
    try {
        const user = await bca1UserModel.findOne({ _id: req.id })
        const appliedUser = await bca1FormModel.findOne({ appliedBy: user._id.toString() })

        if (appliedUser.isPaid === true) {
            res.render("bca1Receipt", { appliedUser, user })
        } else {
            res.redirect("bca1Form")
        }
    } catch (error) {
        console.log("Error in get method bca1Receipt", error)
    }
}


export const bca1AdmFormCopy = async (req, res) => {
    try {
        const user = await bca1UserModel.findOne({ _id: req.id })
        const appliedUser = await bca1FormModel.findOne({ appliedBy: user._id.toString() })
        if (user.isFormFilled === true) {
            res.render("bca1AdmFormCopy", { appliedUser, user })
        } else {
            res.redirect("/bca1Form")
        }
    } catch (error) {
        console.log("Error in get method bca1AdmFormCopy", error)
    }
}