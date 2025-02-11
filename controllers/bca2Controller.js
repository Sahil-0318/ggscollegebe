import unirest from 'unirest'
import jwt from 'jsonwebtoken'
import FileUpload from '../fileUpload/fileUpload.js'
import qrcode from 'qrcode'
import PortalOnOff from '../models/adminModel/portalOnOffSchema.js'

import bca2UserModel from "../models/userModel/BCA-2/user.js"
import bca2FormModel from "../models/userModel/BCA-2/form.js"

export const bca2Signup = async (req, res) =>{
    try {
        const portal = await PortalOnOff.findOne({portal : "bca2_23-26"})
        if (portal.isOn == true) {
            return res.render("bca2Signup")
        }  
        if (portal.isOn == false) {
            return res.render('pageNotFound', {status : "BCA Part 2 (2023 - 26) admission has been closed.", loginPage : "bca2Login"})
        }
    } catch (error) {
        console.log("Error in bca2Signup", error)
    }
}


export const bca2SignupPost = async (req, res) =>{
    try {
        const { fullName, mobileNumber, email } = req.body

        // Generate userName Function
        let generateUserId = () => {
            return (email.slice(0, 6) + mobileNumber.slice(3, 7) + "@MDCN").toUpperCase()
        }
        let createdUserId = generateUserId()
        // console.log(createdUserId)

        // Generate Paaword Function
        let genPassword = ""
        function generatePassword() {
            const characters = 'ABC0DEF1GHI2JKL3MNO4PQR5STU6VWX7Y89';
            let otp = '';
            for (let i = 0; i < 8; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              otp += characters[randomIndex];
            }
            return otp;
          }
        genPassword = generatePassword()
        // console.log(genPassword)

        if (await bca2UserModel.findOne({ password: genPassword }) !== null) {
            genPassword = generatePassword()
        }
        
        const checkedUserMobileNumber = await bca2UserModel.findOne({ mobileNumber })
        const checkedUserEmail = await bca2UserModel.findOne({ email })

        if (checkedUserMobileNumber === null && checkedUserEmail === null) {

            var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            req.headers({
                "authorization": process.env.FAST2SMS_API
            });

            req.form({
                "sender_id": process.env.DLT_USER_PSSWORD_SENDER_ID,
                "message": process.env.YOUR_USER_PSSWORD_MESSAGE_ID,
                "variables_values": `${createdUserId}|${genPassword}`,
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

            const newUser = new bca2UserModel({
                fullName : fullName.trim(),
                email : email.trim(),
                mobileNumber : mobileNumber.trim(),
                userId: createdUserId,
                password: genPassword
            })

            await newUser.save();

            res.status(201).redirect('bca2Login')

        } else {
            res.render("bca2Signup", { "invalid": 'Mobile No or Email already registered' })
        }


    } catch (error) {
        console.log("Error in bca2SignupPost", error)
    }
}


export const bca2Login = async (req, res) =>{
    try {
        res.render("bca2Login")
    } catch (error) {
        console.log("Error in bca2Login", error)
    }
}


export const bca2LoginPost = async (req, res) =>{
    try {
        const { userId, password } = req.body
        const foundUser = await bca2UserModel.findOne({ userId, password })

        if (foundUser != null) {
            const token = jwt.sign(
                {
                    id: foundUser._id,
                    userId: foundUser.userId
                },
                process.env.SECRET_KEY,
                { expiresIn: "7d" }
            )

            res.cookie('uid', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
            res.status(201).redirect('bca2Form')

        } else {
            res.render('bca2Login', { "invalid": "Invalid userId or password" })
        }
    } catch (error) {
        console.log("Error in bca2LoginPost", error)
    }
}


export const logout = async (req, res) =>{
    try {
        res.clearCookie("uid");
        res.status(201).redirect('https://www.mdcollegenaubatpur.ac.in/')
        // res.status(201).redirect('/bca2Login')
    } catch (error) {
        console.log("Error in logout", error)
    }
}


export const bca2Form = async (req, res) =>{
    try {
        const user = await bca2UserModel.findOne({ _id: req.id })
        const appliedUser = await bca2FormModel.findOne({ appliedBy: user._id.toString() })
        if (appliedUser != null) {
            res.render('bca2Form', { user, appliedUser })
        } else {
            res.render('bca2Form', { user })
        }
    } catch (error) {
        console.log("Error in bca2Form", error)
    }
}


export const bca2FormPost = async (req, res) =>{
    try {
        const user = await bca2UserModel.findOne({ _id: req.id })
        const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, subject, examResult, obtMarks, fullMarks, obtPercent } = req.body

        const appliedUser = await bca2FormModel.findOne({ appliedBy: user._id.toString() })

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

            const newForm = new bca2FormModel({
                studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, subject, examResult, obtMarks, fullMarks, obtPercent,
                studentPhoto: photoURL,
                studentSign: signURL,
                appliedBy: user._id
            })

            const savedForm = await newForm.save()
            await bca2UserModel.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isPaid: true } })
            res.redirect("/bca2Pay")
        }
        else{

        }
    } catch (error) {
        console.log("Error in bca2FormPost", error)
    }
}


export const bca2Pay = async (req, res) =>{
    try {
        const user = await bca2UserModel.findOne({ _id: req.id })
        const appliedUser = await bca2FormModel.findOne({ appliedBy: user._id.toString() })

        if (appliedUser.isPaid) {
            return res.redirect("/bca2Form")
        }

        qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.studentName}`, function (err, src) {
            res.status(201).render('bca2PayPage', { "qrcodeUrl": src, upiId : process.env.UPI_ID, user, appliedUser })
        })
    } catch (error) {
        console.log("Error in bca2Pay", error)
    }
}


export const bca2PayPost = async (req, res) =>{
    try {
        const { refNo } = req.body
        const user = await bca2UserModel.findOne({ _id: req.id })
        const appliedUser = await bca2FormModel.findOne({ appliedBy: user._id.toString() })

        const existPaymentId = await bca2FormModel.findOne({ paymentId: refNo })

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

            await bca2FormModel.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL, dateAndTimeOfPayment, paymentId: refNo, isPaid: true, receiptNo } })

            res.redirect("/bca2Receipt")

        } else {
            qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.studentName}`, function (err, src) {
                res.status(201).render('bca2PayPage', { "qrcodeUrl": src, upiId : process.env.UPI_ID, user, appliedUser, invalid: "Please enter valid UTR / Ref no. (कृपया वैध यूटीआर/रेफ नंबर दर्ज करें।)" })
            })
        }
    } catch (error) {
        console.log("Error in bca2PayPost", error)
    }
}


export const bca2Receipt = async (req, res) =>{
    try {
        const user = await bca2UserModel.findOne({ _id: req.id })
        const appliedUser = await bca2FormModel.findOne({ appliedBy: user._id.toString() })

        if (appliedUser.isPaid === true) {
            res.render("bca2Receipt", { appliedUser, user })
        } else {
            res.redirect("bca2Form")
        }
    } catch (error) {
        console.log("Error in bca2Receipt", error)
    }
}


export const bca2AdmFormCopy = async (req, res) =>{
    try {
        const user = await bca2UserModel.findOne({ _id: req.id })
        const appliedUser = await bca2FormModel.findOne({ appliedBy: user._id.toString() })
        if (appliedUser.isPaid === true) {
            res.render("bca2AdmFormCopy", { appliedUser, user })
        } else {
            res.redirect("/bca2Form")
        }
    } catch (error) {
        console.log("Error in bca2AdmFormCopy", error)
    }
}