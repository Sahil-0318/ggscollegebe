import ugRegularPart3User from "../models/userModel/UG-Regular-Part-3/user.js"
import ugRegularPart3AdmissionForm from "../models/userModel/UG-Regular-Part-3/admForm.js"
import FileUpload from '../fileUpload/fileUpload.js'
import jwt from 'jsonwebtoken'
import qrcode from 'qrcode'
import unirest from 'unirest'
import PortalOnOff from '../models/adminModel/portalOnOffSchema.js'


//Error Page
// const signup = async (req, res) => {
//     res.render('pageNotFound', {status : "UG Regular Part 3 (2022 - 25) admission has been closed.", loginPage : "ugRegularPart3Login"})
// }


const signup = async (req, res) => {
    try {
        const portal = await PortalOnOff.findOne({portal : "ugRegularPart3_22-25"})
        if (portal.isOn == true) {
            return res.render("ugRegularPart3Signup")
        }  
        if (portal.isOn == false) {
            return res.render('pageNotFound', {status : "UG Regular Part 3 (2022 - 25) admission has been closed.", loginPage : "ugRegularPart3Login"})
        }
    } catch (error) {
        console.log("Error in Signup UG Part 3 Get Method =====>", error)
    }
}


const signupPost = async (req, res) => {
    try {
        const { course, fullName, mobileNumber, email } = req.body

        // Generate userName Function
        let generateUserName = () => {
            return (email.slice(0, 6) + mobileNumber.slice(3, 7) + "@MDCN").toUpperCase()
        }
        let createdUserName = generateUserName()

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

        if (await ugRegularPart3User.findOne({ password: genPassword }) !== null) {
            genPassword = generatePassword()
        }

        const checkedUserMobileNumber = await ugRegularPart3User.findOne({ mobileNumber })
        const checkedUserEmail = await ugRegularPart3User.findOne({ email })

        if (checkedUserMobileNumber === null && checkedUserEmail === null) {

            const newUser = new ugRegularPart3User({
                course,
                fullName,
                email,
                mobileNumber,
                userId: createdUserName,
                password: genPassword
            })

            await newUser.save();

            var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            req.headers({
                "authorization": process.env.FAST2SMS_API
            });

            req.form({
                "sender_id": process.env.DLT_USER_PSSWORD_SENDER_ID,
                "message": process.env.YOUR_USER_PSSWORD_MESSAGE_ID,
                "variables_values": `${createdUserName}|${genPassword}`,
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

            res.status(201).redirect('ugRegularPart3Login')

        } else {
            res.render("ugRegularPart3Signup", { "invalid": 'Mobile No or Email already registered' })
        }
    } catch (error) {
        console.log("Error in Signup UG Part 3 Post Method =====>", error)
    }
}


const login = async (req, res) => {
    try {
        res.render("ugRegularPart3Login")
    } catch (error) {
        console.log("Error in Login UG Part 3 Get Method =====>", error)
    }
}


const loginPost = async (req, res) => {
    try {
        const { userId, password } = req.body
        const foundUser = await ugRegularPart3User.findOne({ userId })
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

                res.status(201).redirect('/ugRegularPart3AdmissionForm')
            } else {
                return res.render('ugRegularPart3Login', { invalid: "User Id or Password is incorrect" })
            }
        } else {
            return res.render('ugRegularPart3Login', { invalid: "User doesn't exists, Please register now." })
        }
    } catch (error) {
        console.log("Error in Login UG Part 3 Post Method =====>", error)
    }
}


const logout = async (req, res) => {
    res.clearCookie("uid");
    res.status(201).redirect('https://www.mdcollegenaubatpur.ac.in/')
    // res.status(201).redirect('/ugRegularPart3Login')
}


const admissionForm = async (req, res) => {
    try {
        const user = await ugRegularPart3User.findOne({ _id: req.id })
        // console.log(user)
        const appliedUser = await ugRegularPart3AdmissionForm.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser)
        const portal = await PortalOnOff.findOne({portal : "ugRegularPart3_22-25"})
        
        if (appliedUser != null) {
            res.render('ugRegularPart3AdmForm', { user, appliedUser })
        } else {
            res.render('ugRegularPart3AdmForm', { user, portal : portal.isOn })
        }
    } catch (error) {
        console.log("Error in Admission Form UG Part 3 get Method =====>", error)
    }
}


const admissionFormPost = async (req, res) => {
    try {
        const user = await ugRegularPart3User.findOne({ _id: req.id })
        const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, examResult, obtMarks, fullMarks, obtPercent } = req.body

        const appliedUser = await ugRegularPart3AdmissionForm.findOne({ appliedBy: user._id.toString() })
        let admissionFee = ""

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

            // -------
            if (gender === "MALE") {
                if (category === "GENERAL" || category === "BC-2") {
                    admissionFee = 3330
                } else if (category === "BC-1") {
                    admissionFee = 3160
                } else {
                    admissionFee = 1100
                }

            } else {
                admissionFee = 1100
            }

            const newAdmissionForm = new ugRegularPart3AdmissionForm({
                studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, examResult, obtMarks, fullMarks, obtPercent,
                studentPhoto: photoURL,
                studentSign: signURL,
                appliedBy: user._id,
                admissionFee,
                course: user.course
            })

            await newAdmissionForm.save()
            await ugRegularPart3User.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isFormFilled: true } })
            res.redirect("/ugRegularPart3Pay")
        }

    } catch (error) {
        console.log("Error in Admission Form UG Part 3 Post Method =====>", error)
        // res.redirect('/ugRegularPart3Login')
    }
}


const ugRegularPart3Pay = async (req, res) => {
    try {
        const user = await ugRegularPart3User.findOne({ _id: req.id })
        const appliedUser = await ugRegularPart3AdmissionForm.findOne({ appliedBy: user._id.toString() })

        if (appliedUser.isPaid) {
            return res.redirect("/ugRegularPart3AdmissionForm")
        }

        qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.studentName}`, function (err, src) {
            res.status(201).render('ugRegularPart3PayPage', { "qrcodeUrl": src, upiId : process.env.UPI_ID, user, appliedUser })
        })

    } catch (error) {
        console.log("Error in UG Regular UG Part 3 Pay Page =====>", error)
    }
}


const payPost = async (req, res) => {
    try {
        const { refNo } = req.body
        const user = await ugRegularPart3User.findOne({ _id: req.id })
        const appliedUser = await ugRegularPart3AdmissionForm.findOne({ appliedBy: user._id.toString() })

        const existPaymentId = await ugRegularPart3AdmissionForm.findOne({ paymentId: refNo })

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

            let receiptNo = "24MDC" + appliedUser.uniRollNumber;
            await ugRegularPart3AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL } })

            await ugRegularPart3AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { dateAndTimeOfPayment } })

            await ugRegularPart3AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentId: refNo } })
            await ugRegularPart3AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { isPaid: true } })
            await ugRegularPart3AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { receiptNo } })

            res.redirect("/ugRegularPart3Receipt")

        } else {
            qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.studentName}`, function (err, src) {
                res.status(201).render('ugRegularPart3PayPage', { "qrcodeUrl": src, upiId : process.env.UPI_ID, user, appliedUser, invalid: "Please enter valid UTR / Ref no. (कृपया वैध यूटीआर/रेफ नंबर दर्ज करें।)" })
            })
        }
    } catch (error) {
        console.log("Error in UG Regular Sem 3 Pay Page Post =====>", error)
    }
}


const ugRegularPart3Receipt = async (req, res) => {
    try {
        const user = await ugRegularPart3User.findOne({ _id: req.id })
        const appliedUser = await ugRegularPart3AdmissionForm.findOne({ appliedBy: user._id.toString() })

        if (appliedUser.isPaid === true) {
            res.render("ugRegularPart3Receipt", { appliedUser, user })
        } else {
            res.redirect("ugRegularPart3AdmissionForm")
        }

    } catch (error) {
        console.log("Error in Receipt Page =====>", error)
    }
}


const admFormCopy = async (req, res) => {
    try {
        const user = await ugRegularPart3User.findOne({ _id: req.id })
        const appliedUser = await ugRegularPart3AdmissionForm.findOne({ appliedBy: user._id.toString() })
        if (appliedUser.isPaid === true) {
            res.render("ugRegularPart3AdmFormCopy", { appliedUser, user })
        } else {
            res.redirect("/ugRegularPart3AdmissionForm")
        }
    } catch (error) {
        console.log("Error in Adm Form Copy Page =====>", error)

    }
}


export {
    signup, signupPost, login, loginPost, logout, admissionForm, admissionFormPost, ugRegularPart3Pay, payPost, ugRegularPart3Receipt, admFormCopy
}