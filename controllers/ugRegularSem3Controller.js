import ugRegularSem3User from "../models/userModel/UG-Regular-Sem-3/user.js"
import ugRegularSem3AdmissionForm from "../models/userModel/UG-Regular-Sem-3/admForm.js"
import FileUpload from '../fileUpload/fileUpload.js'
import jwt from 'jsonwebtoken'
import qrcode from 'qrcode'
import unirest from 'unirest'
import PortalOnOff from '../models/adminModel/portalOnOffSchema.js'


//Error Page
// const signup = async (req, res) => {
//     res.render('pageNotFound', {status : "UG Regular Sem 3 admission has been closed.", loginPage : "ugRegularSem3Login"})
// }

// const signup = async (req, res) => {
//     try {
//         res.render("ugRegularSem3Signup")
//     } catch (error) {
//         console.log("Error in Signup Get Method =====>", error)
//     }
// }


const signup = async (req, res) => {
    try {
        const portal = await PortalOnOff.findOne({portal : "ugRegularSem3_23-27"})
        if (portal.isOn == true) {
            return res.render("ugRegularSem3Signup")
        }  
        if (portal.isOn == false) {
            return res.render('pageNotFound', {status : "UG Regular Sem 3 (2023 - 27) admission has been closed due to Technical issue. It will resume after sometimes. So please wait. Thankyou", loginPage : "ugRegularSem3Login"})
        }
    } catch (error) {
        console.log("Error in Signup UG Part 3 Get Method =====>", error)
    }
}



const signupPost = async (req, res) => {
    try {
        const {course, fullName, mobileNumber, email } = req.body
        // Generate OTP Function
        let generateOTP = () => {
            let pass = ""
            for (let index = 0; index < 4; index++) {
                pass = pass + Math.floor(Math.random() * 10)
            }
            return pass
        }
        let genPassword = generateOTP()
        console.log(genPassword, "During Signup")

        const checkedUserMobileNumber = await ugRegularSem3User.findOne({ mobileNumber })
        // console.log(checkedUserMobileNumber)
        const checkedUserEmail = await ugRegularSem3User.findOne({ email })
        // console.log(checkedUserEmail)

        if (checkedUserMobileNumber === null && checkedUserEmail === null) {
            var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            req.headers({
                "authorization": process.env.FAST2SMS_API
            });

            req.form({
                "sender_id": process.env.DLT_SENDER_ID,
                "message": process.env.YOUR_MESSAGE_ID,
                "variables_values": genPassword,
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

            const newUser = new ugRegularSem3User({
                course,
                fullName,
                email,
                mobileNumber,
                password: genPassword
            })

            const registered = await newUser.save();
            // res.status(201).redirect('ug-regular-sem-1-login')
            res.render("ugRegularSem3OTP", { OTPComesFrom: "Register", OTPNumber: mobileNumber })

        } else {
            res.render("ugRegularSem3Signup", { "invalid": 'Mobile No or Email already registered' })
        }
    } catch (error) {
        console.log("Error in Signup Post Method =====>", error)
    }
}



const login = async (req, res) => {
    try {
        res.render("ugRegularSem3Login")
    } catch (error) {
        console.log("Error in Login Get Method =====>", error)
    }
}



const loginPost = async (req, res) => {
    try {
        const { mobileNumber } = req.body
        const foundUser = await ugRegularSem3User.findOne({ mobileNumber })
        // console.log(foundUser)

        // Generate OTP Function
        let generateOTP = () => {
            let pass = ""
            for (let index = 0; index < 4; index++) {
                pass = pass + Math.floor(Math.random() * 10)
            }
            return pass
        }
        let genPassword = generateOTP()
        console.log(genPassword, "Generated OTP in Login page");

        if (foundUser != null) {

            await ugRegularSem3User.findOneAndUpdate({ mobileNumber }, { $set: { password: genPassword } })

            var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            req.headers({
                "authorization": process.env.FAST2SMS_API
            });

            req.form({
                "sender_id": process.env.DLT_SENDER_ID,
                "message": process.env.YOUR_MESSAGE_ID,
                "variables_values": genPassword,
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
            res.render("ugRegularSem3OTP", { OTPComesFrom: "Login", OTPNumber: mobileNumber })

        } else {
            return res.redirect('ugRegularSem3Signup')
        }
    } catch (error) {
        console.log("Error in Login Post Method =====>", error)
    }
}


const logout = async (req, res) => {
    res.clearCookie("uid");
    res.status(201).redirect('https://www.mdcollegenaubatpur.ac.in/')
    // res.status(201).redirect('/ugRegularSem3Login')
}

const OTPFormPost = async (req, res) => {
    try {
        const { otpInput, OTPNum } = req.body
        // console.log("Line 172",otpInput, OTPNum)
        const foundUser = await ugRegularSem3User.findOne({ mobileNumber : OTPNum, password: otpInput })
        // console.log(foundUser, "otp submission time")
        if (foundUser != null) {
            // if (otpInput === foundUser.password) {
                const token = jwt.sign({
                    id: foundUser._id,
                    mobileNumber: foundUser.mobileNumber
                }, process.env.SECRET_KEY,
                    { expiresIn: "7d" })
                res.cookie('uid', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })

                res.status(201).redirect('/ugRegularSem3AdmissionForm')
        } else {
            res.render('ugRegularSem3OTP', { OTPComesFrom: "Login", OTPNumber: OTPNum, "invalid": "Invalid OTP, You can request resend OTP" })
        }
    } catch (error) {
        console.log("Error in OTP Form Post Method =====>", error)
    }
}


const resendOTP = async (req, res) => {
    const { mobNum } = req.params
    // console.log("Line 196", mobNum)
    try {
        const foundUser = await ugRegularSem3User.findOne({ mobileNumber: mobNum })

        // Generate OTP Function
        let generateOTP = () => {
            let pass = ""
            for (let index = 0; index < 4; index++) {
                pass = pass + Math.floor(Math.random() * 10)
            }
            return pass
        }
        let genPassword = generateOTP()
        console.log(genPassword, "Resend OTP");

        if (foundUser != null) {

            await ugRegularSem3User.findOneAndUpdate({ mobileNumber: mobNum }, { $set: { password: genPassword } })

            var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            req.headers({
                "authorization": process.env.FAST2SMS_API
            });

            req.form({
                "sender_id": process.env.DLT_SENDER_ID,
                "message": process.env.YOUR_MESSAGE_ID,
                "variables_values": genPassword,
                "route": "dlt",
                "numbers": mobNum,
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
            res.render("ugRegularSem3OTP", { OTPComesFrom: "Login", OTPNumber: mobNum })

        } else {
            return res.redirect('/ugRegularSem3Signup')
        }
    } catch (error) {
        console.log(error)
    }
}


const admissionForm = async (req, res) => {
    try {
        const user = await ugRegularSem3User.findOne({ _id: req.id })
        // console.log(user)
        const appliedUser = await ugRegularSem3AdmissionForm.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser)
        const portal = await PortalOnOff.findOne({portal : "ugRegularSem3_23-27"})

        if (appliedUser != null) {
            res.render('ugRegularSem3AdmForm', { user, appliedUser })
        } else {
            res.render('ugRegularSem3AdmForm', { user, portal : portal.isOn })
        }
    } catch (error) {
        console.log("Error in Admission Form get Method =====>", error)
    }
}


const admissionFormPost = async (req, res) =>{
    try {
        const user = await ugRegularSem3User.findOne({ _id: req.id })
        const { studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, examResult, obtMarks, fullMarks, obtPercent } = req.body

        const appliedUser = await ugRegularSem3AdmissionForm.findOne({ appliedBy: user._id.toString() })
        let admissionFee = ""

        if (appliedUser == null) {
            const images = req.files

            // console.log(images[0].path);
            const photoUpload = await FileUpload(images[0].path)
            const photoURL = photoUpload.secure_url
            // console.log(photoURL);

            // console.log(images[1].path);
            const signUpload = await FileUpload(images[1].path)
            const signURL = signUpload.secure_url
            // console.log(signURL);

            // -------
            if (gender === "MALE") {
                if (user.course === "Bachelor of Science" || paper1 === "Psychology") {
                    if (category === "GENERAL" || category === "BC-2") {
                        admissionFee = 2755
                    } else if (category === "BC-1") {
                        admissionFee = 2155
                    } else {
                        admissionFee = 1350
                    }
                } else {
                    if (category === "GENERAL" || category === "BC-2") {
                        admissionFee = 2155
                    } else if (category === "BC-1") {
                        admissionFee = 1555
                    } else {
                        admissionFee = 750
                    }
                }

            } else {
                if (user.course === "Bachelor of Science" || paper1 === "Psychology") {
                    admissionFee = 1350
                } else {
                    admissionFee = 750
                }
            }

            const newAdmissionForm = new ugRegularSem3AdmissionForm({
                studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, examResult, obtMarks, fullMarks, obtPercent,
                studentPhoto: photoURL,
                studentSign: signURL,
                appliedBy: user._id,
                admissionFee
            })

            const savedForm = await newAdmissionForm.save()
            await ugRegularSem3User.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isPaid: true } })
            res.redirect("/ugRegularSem3Pay")

        } else {

        }

    } catch (error) {
        console.log("Error in Admission Form Post Method =====>", error)
        res.redirect('/ugRegularSem3Login')
    }
}


const ugRegularSem3Pay = async (req, res) =>{
    try {
        const user = await ugRegularSem3User.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem3AdmissionForm.findOne({ appliedBy: user._id.toString() })
    
        if (appliedUser.admissionFee === "2755") {
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=2755&tn=${appliedUser.studentName}`, function (err, src) {
                res.status(201).render('ugRegularSem3PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        } else if (appliedUser.admissionFee === "2155") {
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=2155&tn=${appliedUser.studentName}`, function (err, src) {
                res.status(201).render('ugRegularSem3PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        } else if (appliedUser.admissionFee === "1555") {
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=1555&tn=${appliedUser.studentName}`, function (err, src) {
                res.status(201).render('ugRegularSem3PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        } else if (appliedUser.admissionFee === "1350") {
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=1350&tn=${appliedUser.studentName}`, function (err, src) {
                res.status(201).render('ugRegularSem3PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        } else if (appliedUser.admissionFee === "750") {
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=750&tn=${appliedUser.studentName}`, function (err, src) {
                res.status(201).render('ugRegularSem3PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        }
    
    } catch (error) {
        console.log("Error in UG Regular Sem 3 Pay Page =====>", error)
    }
}


const payPost = async (req, res) =>{
    try {
        const { refNo } = req.body
        const user = await ugRegularSem3User.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem3AdmissionForm.findOne({ appliedBy: user._id.toString() })

        const photoUpload = await FileUpload(req.file.path)
        const paymentSSURL = photoUpload.secure_url

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const dateAndTimeOfPayment = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`

        let receiptNo = "24MDC" + appliedUser.uniRollNumber;

        await ugRegularSem3AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL } })

        await ugRegularSem3AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { dateAndTimeOfPayment } })

        await ugRegularSem3AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentId: refNo } })
        await ugRegularSem3AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { isPaid: true } })
        await ugRegularSem3AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { receiptNo } })
        // await ugRegularSem3User.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isPaid: true } })

        res.redirect("/ugRegularSem3Receipt")
    
    } catch (error) {
        console.log("Error in UG Regular Sem 3 Pay Page Post =====>", error)
    }
}


const ugRegularSem3Receipt = async (req, res) =>{
    try {
        const { refNo } = req.body
        const user = await ugRegularSem3User.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem3AdmissionForm.findOne({ appliedBy: user._id.toString() })

        if (appliedUser.isPaid === true) {
            res.render("ugRegularSem3Receipt", { appliedUser, user })
        } else {
            res.redirect("admissionForm")
        }
    
    } catch (error) {
        console.log("Error in Receipt Page =====>", error)
    }
}



const admFormCopy =  async(req, res) =>{
    try {
        const user = await ugRegularSem3User.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem3AdmissionForm.findOne({ appliedBy: user._id.toString() })
        if (appliedUser.isPaid === true) {
            res.render("ugRegularSem3AdmFormCopy", { appliedUser, user })
        } else {
            res.redirect("/ugRegularSem3/admissionForm")
        }
    } catch (error) {
        console.log("Error in Adm Form Copy Page =====>", error)
        
    }
}

export {
    signup, signupPost, login, loginPost, logout, OTPFormPost, resendOTP, admissionForm, admissionFormPost, ugRegularSem3Pay, payPost, ugRegularSem3Receipt, admFormCopy
}