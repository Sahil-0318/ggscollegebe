import ugRegularSem4User from "../models/userModel/UG-Regular-Sem-4/user.js"
import ugRegularSem4AdmissionForm from "../models/userModel/UG-Regular-Sem-4/admForm.js"
import FileUpload from '../fileUpload/fileUpload.js'
import jwt from 'jsonwebtoken'
import qrcode from 'qrcode'
import unirest from 'unirest'
import nodemailer from 'nodemailer'
import PortalOnOff from '../models/adminModel/portalOnOffSchema.js'


export const signup = async (req, res) => {
    try {
        const portal = await PortalOnOff.findOne({ portal: "ugRegularSem4_23-27" })
        if (portal.isOn == true) {
            return res.render("ugRegularSem4Signup")
        }
        if (portal.isOn == false) {
            return res.render('pageNotFound', { status: "UG Regular Sem 4 (2023 - 27) admission has been closed. Thankyou", loginPage: "ugRegularSem4Login" })
        }
    } catch (error) {
        console.log("Error in Ug Reg Sem 4 Signup Get Method =====>", error)
    }
}


export const signupPost = async (req, res) => {
    try {
        const { course, fullName, mobileNumber, email } = req.body

        // Generate userId Function
        let generateUserId = () => {
            return (email.slice(0, 6) + mobileNumber.slice(3, 7) + "@MDCN").toUpperCase()
        }
        let createdUserId = generateUserId()

        // Generate Paaword Function
        let genPassword = ""
        function generatePassword() {
            const characters = 'ABC0DEF1GHI2JKL3MNO4PQR5STU6VWX7Y89';
            let password = '';
            for (let i = 0; i < 8; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                password += characters[randomIndex];
            }
            return password;
        }
        genPassword = generatePassword()

        if (await ugRegularSem4User.findOne({ password: genPassword }) !== null) {
            genPassword = generatePassword()
        }


        // =======================================================
        console.log(genPassword, "During Signup")

        const checkedUserMobileNumber = await ugRegularSem4User.findOne({ mobileNumber })
        // console.log(checkedUserMobileNumber)
        const checkedUserEmail = await ugRegularSem4User.findOne({ email })
        // console.log(checkedUserEmail)

        if (checkedUserMobileNumber === null && checkedUserEmail === null) {

            // Sending userId and password on mobile
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
                to: email,
                subject: 'Login Credentials',
                // text: 'Yout CLC approved... 🎉',
                text: `Dear Students, Your login credentials are \nUserName is ${createdUserId} and Password is ${genPassword}. \n \n MD College, Patna`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error while sending credentials to email :', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });



            const newUser = new ugRegularSem4User({
                course,
                fullName,
                email,
                mobileNumber,
                userId: createdUserId,
                password: genPassword
            })

            const registered = await newUser.save();
            res.status(201).redirect('ugRegularSem4Login')

        } else {
            res.render("ugRegularSem4Signup", { "invalid": 'Mobile No or Email already registered' })
        }
    } catch (error) {
        console.log("Error in Ug Reg Sem 4 Signup Post Method =====>", error)
    }
}


export const login = async (req, res) => {
    try {
        res.render("ugRegularSem4Login")
    } catch (error) {
        console.log("Error in Ug Reg Sem 4 Login Get Method =====>", error)
    }
}


export const loginPost = async (req, res) => {
    try {
        const { userId, password } = req.body
        const foundUser = await ugRegularSem4User.findOne({ userId })
        // console.log(foundUser)

        if (foundUser != null) {
            if (foundUser.password === password) {
                const token = jwt.sign({
                    id: foundUser._id,
                    mobileNumber: foundUser.mobileNumber,
                    email: foundUser.email
                }, process.env.SECRET_KEY,
                    { expiresIn: "7d" })
                res.cookie('uid', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })

                res.status(201).redirect('/ugRegularSem4AdmissionForm')
            } else {
                return res.render('ugRegularSem4Login', { invalid: "User Id or Password is incorrect" })
            }
        } else {
            return res.render('ugRegularSem4Login', { invalid: "User doesn't exists, Please register now." })
        }

    } catch (error) {
        console.log("Error in Ug Reg Sem 4 Login Post Method =====>", error)
    }
}


export const logout = async (req, res) => {
    res.clearCookie("uid");
    res.status(201).redirect('https://www.mdcollegenaubatpur.ac.in/')
    // res.status(201).redirect('/ugRegularSem4Login')
}


export const admissionForm = async (req, res) => {
    try {
        const user = await ugRegularSem4User.findOne({ _id: req.id })
        // console.log(user)
        const appliedUser = await ugRegularSem4AdmissionForm.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser)
        const portal = await PortalOnOff.findOne({ portal: "ugRegularSem4_23-27" })

        if (appliedUser != null) {
            res.render('ugRegularSem4AdmForm', { user, appliedUser })
        } else {
            res.render('ugRegularSem4AdmForm', { user, portal: portal.isOn })
        }
    } catch (error) {
        console.log("Error in Ug Reg Sem 4 Admission Form get Method =====>", error)
    }
}


export const admissionFormPost = async (req, res) => {
    try {
        const user = await ugRegularSem4User.findOne({ _id: req.id })
        const { studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, examResult, obtMarks, fullMarks, obtPercent } = req.body

        const appliedUser = await ugRegularSem4AdmissionForm.findOne({ appliedBy: user._id.toString() })
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
                        admissionFee = 2905
                    } else if (category === "BC-1") {
                        admissionFee = 2305
                    } else {
                        admissionFee = 1500
                    }
                } else {
                    if (category === "GENERAL" || category === "BC-2") {
                        admissionFee = 2305
                    } else if (category === "BC-1") {
                        admissionFee = 1705
                    } else {
                        admissionFee = 900
                    }
                }

            } else {
                if (user.course === "Bachelor of Science" || paper1 === "Psychology") {
                    admissionFee = 1500
                } else {
                    admissionFee = 900
                }
            }

            const newAdmissionForm = new ugRegularSem4AdmissionForm({
                studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, examResult, obtMarks, fullMarks, obtPercent,
                studentPhoto: photoURL,
                studentSign: signURL,
                appliedBy: user._id,
                admissionFee : admissionFee + 100
            })

            const savedForm = await newAdmissionForm.save()
            await ugRegularSem4User.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isPaid: true } })
            res.redirect("/ugRegularSem4Pay")

        }

    } catch (error) {
        console.log("Error in ug reg sem 4 Admission Form Post Method =====>", error)
        res.redirect('/ugRegularSem4Login')
    }
}


export const ugRegularSem4Pay = async (req, res) => {
    try {
        const user = await ugRegularSem4User.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem4AdmissionForm.findOne({ appliedBy: user._id.toString() })

        qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.studentName}`, function (err, src) {
            res.status(201).render('ugRegularSem4PayPage', { "qrcodeUrl": src, user, appliedUser, "upiId": process.env.UPI_ID })
        })

    } catch (error) {
        console.log("Error in UG Regular Sem 4 Pay Page =====>", error)
    }
}

export const payPost = async (req, res) => {
    try {
        const { refNo } = req.body
        const user = await ugRegularSem4User.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem4AdmissionForm.findOne({ appliedBy: user._id.toString() })

        const existRefNo = await ugRegularSem4AdmissionForm.findOne({ paymentId: refNo })

        if (existRefNo) {
            qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.studentName}`, function (err, src) {
                res.status(201).render('ugRegularSem4PayPage', { "qrcodeUrl": src, user, appliedUser, "upiId": process.env.UPI_ID,  invalid: "Please enter valid UTR / Ref no. (कृपया वैध यूटीआर/रेफ नंबर दर्ज करें।)" })
            })
        }

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

        let receiptNo = "25MDC" + appliedUser.uniRollNumber;

        await ugRegularSem4AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL } })

        await ugRegularSem4AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { dateAndTimeOfPayment } })

        await ugRegularSem4AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentId: refNo } })
        await ugRegularSem4AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { isPaid: true } })
        await ugRegularSem4AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { receiptNo } })
        // await ugRegularSem3User.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isPaid: true } })

        res.redirect("/ugRegularSem4Receipt")

    } catch (error) {
        console.log("Error in UG Regular Sem 4 Pay Page Post =====>", error)
    }
}


export const ugRegularSem4Receipt = async (req, res) => {
    try {
        const { refNo } = req.body
        const user = await ugRegularSem4User.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem4AdmissionForm.findOne({ appliedBy: user._id.toString() })

        if (appliedUser.isPaid === true) {
            res.render("ugRegularSem4Receipt", { appliedUser, user })
        } else {
            res.redirect("/ugRegularSem4AdmissionForm")
        }

    } catch (error) {
        console.log("Error in ug reg sem 4 Receipt Page =====>", error)
    }
}


export const admFormCopy = async (req, res) => {
    try {
        const user = await ugRegularSem4User.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem4AdmissionForm.findOne({ appliedBy: user._id.toString() })
        if (appliedUser.isPaid === true) {
            res.render("ugRegularSem4AdmFormCopy", { appliedUser, user })
        } else {
            res.redirect("/ugRegularSem4AdmissionForm")
        }
    } catch (error) {
        console.log("Error in ug reg sem 4 Adm Form Copy Page =====>", error)

    }
}