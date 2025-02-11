import ugRegularSem1AdmissionPortal from "../models/userModel/ugRegularSem1AdmissionPortalSchema.js"
import ugRegularSem1AdmissionForm from "../models/userModel/ugRegularSem1AdmissionFormSchema.js"
import FileUpload from '../fileUpload/fileUpload.js'
import jwt from 'jsonwebtoken'
import qrcode from 'qrcode'
import ugRegularSem1MeritList from "../models/adminModel/ugRegularSem1MeritList.js"
import ugRegularSem1MeritList2 from "../models/adminModel/ugRegularSem1MeritList2.js"
import ugRegularSem1MeritList3 from "../models/adminModel/ugRegularSem1MeritList3.js"
import ugRegularSem1MeritList4 from "../models/adminModel/ugRegularSem1MeritList4.js"
import ugRegularSem1MeritList5 from "../models/adminModel/ugRegularSem1MeritList5.js"
import ugRegularSem1MeritList6 from "../models/adminModel/ugRegularSem1MeritList6.js"
import unirest from 'unirest'
import PortalOnOff from '../models/adminModel/portalOnOffSchema.js'



const ugRegularSem1 = async (req, res) => {
    try {
        const portal = await PortalOnOff.findOne({portal : "ugRegularSem1_24-28"})
        if (portal.isOn == true) {
            return res.render("ugRegularSem1")
        }  
        if (portal.isOn == false) {
            return res.render('pageNotFound', {status : "UG Regular Sem 1 (2024 - 28) admission has been closed.", loginPage : "ug-regular-sem-1-login"})
        }
    } catch (error) {
        console.log("Error in Signup UG Part 3 Get Method =====>", error)
    }
}

const ugRegularSem1Post = async (req, res) => {
    try {
        let { referenceNumber, mobileNumber } = req.body
        // console.log(course, referenceNumber, mobileNumber)

        // Generate OTP Function
        let generateOTP = () => {
            let pass = ""
            for (let index = 0; index < 4; index++) {
                pass = pass + Math.floor(Math.random() * 10)
            }
            return pass
        }
        let genPassword = generateOTP()
        console.log(genPassword, "Generated OTP");


        const isExistRefNoINMeritList = await ugRegularSem1MeritList6.findOne({ appNo: referenceNumber })
        // console.log(isExistRefNoINMeritList);


        if (isExistRefNoINMeritList != null) {
            const existReferenceNumber = await ugRegularSem1AdmissionPortal.findOne({ referenceNumber })
            // console.log(existReferenceNumber);
            const existMobileNumber = await ugRegularSem1AdmissionPortal.findOne({ mobileNumber })
            // console.log(existMobileNumber);

            let course = ""
            if (isExistRefNoINMeritList.majorSubject === "Botany" || isExistRefNoINMeritList.majorSubject === "Mathematics" || isExistRefNoINMeritList.majorSubject === "Chemistry" || isExistRefNoINMeritList.majorSubject === "Physics" || isExistRefNoINMeritList.majorSubject === "Zoology") {
                course = "Bachelor of Science"

            } else if (isExistRefNoINMeritList.majorSubject === "English" || isExistRefNoINMeritList.majorSubject === "Hindi" || isExistRefNoINMeritList.majorSubject === "Urdu" || isExistRefNoINMeritList.majorSubject === "Philosophy") {
                course = "Bachelor of Arts (Humanities Subjects)"
            } else {
                course = "Bachelor of Arts (Social Science Subjects)"
            }


            if (existReferenceNumber === null && existMobileNumber == null) {

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


                const newUser = new ugRegularSem1AdmissionPortal({
                    course,
                    referenceNumber,
                    mobileNumber,
                    userId: referenceNumber,
                    password: genPassword
                })

                const registered = await newUser.save();
                // res.status(201).redirect('ug-regular-sem-1-login')
                res.render("otp", { OTPComesFrom: "Register", OTPNumber: mobileNumber })
            } else {
                res.render('ugRegularSem1', { "invalid": 'Reference No or Mobile No already register' });
                // res.render('otp', { OTPComesFrom: "Register", OTPNumber: mobileNumber });
            }
        } else {
            res.render('ugRegularSem1', { "invalid": 'Invalid Reference No' });
        }

    } catch (error) {

    }
}

const ugRegularSem1Login = async (req, res) => {
    res.render('ugRegularSem1Login')
}

const ugRegularSem1Logout = async (req, res) => {
    res.clearCookie("uid");
    res.status(201).redirect('https://www.mdcollegenaubatpur.ac.in/')
}

const otpForm = async (req, res) => {
    try {
        const { otpInput, OTPNum } = req.body
        const foundUser = await ugRegularSem1AdmissionPortal.findOne({ password: otpInput })
        // console.log(foundUser, "otp submission time")
        if (foundUser != null) {
            // if (otpInput === foundUser.password) {
                const token = jwt.sign({
                    id: foundUser._id,
                    course: foundUser.course,
                    referenceNumber: foundUser.referenceNumber
                }, process.env.SECRET_KEY,
                    { expiresIn: "7d" })
                res.cookie('uid', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })

                res.status(201).redirect('ug-reg-adm-form')
        } else {
            res.render('otp', { OTPComesFrom: "Login", OTPNumber: OTPNum, "invalid": "Invalid OTP, You can request resend OTP" })
        }
    } catch (error) {
        console.log(error)
    }
}

const resendOTP = async (req, res) => {
    const { mobNum } = req.params
    try {
        const foundUser = await ugRegularSem1AdmissionPortal.findOne({ mobileNumber: mobNum })

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

            await ugRegularSem1AdmissionPortal.findOneAndUpdate({ mobileNumber: mobNum }, { $set: { password: genPassword } })

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

            res.render("otp", { OTPComesFrom: "Login", OTPNumber: mobNum })

        } else {
            return res.redirect('ug-regular-sem-1')
        }
    } catch (error) {
        console.log(error)
    }
}

const ugRegularSem1LoginPost = async (req, res) => {
    try {
        const { mobileNumber } = req.body
        const foundUser = await ugRegularSem1AdmissionPortal.findOne({ mobileNumber })

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

            await ugRegularSem1AdmissionPortal.findOneAndUpdate({ mobileNumber }, { $set: { password: genPassword } })

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
            res.render("otp", { OTPComesFrom: "Login", OTPNumber: mobileNumber })

        } else {
            return res.redirect('ug-regular-sem-1')
        }
    } catch (error) {
        console.log(error)
    }
}

const ugRegularSem1AdmForm = async (req, res) => {
    const convertDateFormat = (dateString) => {
        const months = {
            jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
            jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
        };
        const [day, month, year] = dateString.toLowerCase().split('-');
        const formattedDate = `20${year}-${months[month]}-${day.padStart(2, '0')}`;
        return formattedDate;
    };

    const user = await ugRegularSem1AdmissionPortal.findOne({ _id: req.id })
    // console.log(user)
    const appliedUser = await ugRegularSem1AdmissionForm.findOne({ appliedBy: user._id.toString() })

    // changes start here for all merit list
    let meritListTwoData = ""
    if (await ugRegularSem1MeritList.findOne({ appNo: user.referenceNumber }) !== null) {
        meritListTwoData = await ugRegularSem1MeritList.findOne({ appNo: user.referenceNumber })
    } else if (await ugRegularSem1MeritList2.findOne({ appNo: user.referenceNumber }) !== null) {
        meritListTwoData = await ugRegularSem1MeritList2.findOne({ appNo: user.referenceNumber })
    } else if (await ugRegularSem1MeritList3.findOne({ appNo: user.referenceNumber }) !== null) {
        meritListTwoData = await ugRegularSem1MeritList3.findOne({ appNo: user.referenceNumber })
    } else if (await ugRegularSem1MeritList4.findOne({ appNo: user.referenceNumber }) !== null) {
        meritListTwoData = await ugRegularSem1MeritList4.findOne({ appNo: user.referenceNumber })
    } else if (await ugRegularSem1MeritList5.findOne({ appNo: user.referenceNumber }) !== null) {
        meritListTwoData = await ugRegularSem1MeritList5.findOne({ appNo: user.referenceNumber })
    } else if (await ugRegularSem1MeritList6.findOne({ appNo: user.referenceNumber }) !== null) {
        meritListTwoData = await ugRegularSem1MeritList6.findOne({ appNo: user.referenceNumber })
    }
    // changes start here for end merit list
    // const meritListTwoData = await ugRegularSem1MeritList3.findOne({ appNo: user.referenceNumber })
    // meritListTwoData.dOB = convertDateFormat(meritListTwoData.dOB);
    // console.log(meritListTwoData)

    const portal = await PortalOnOff.findOne({portal : "ugRegularSem1_24-28"})

    if (appliedUser != null) {
        res.render('ugRegularSem1AdmForm', { user, appliedUser })
    } else {
        res.render('ugRegularSem1AdmForm', { user, meritListTwoData, portal : portal.isOn })
    }

}

const ugRegularSem1AdmFormPost = async (req, res) => {
    try {
        const user = await ugRegularSem1AdmissionPortal.findOne({ _id: req.id })

        const { studentName, fatherName, motherName, guardianName, referenceNumber, email, applicantId, dOB, gender, familyAnnualIncome, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent, ppuConfidentialNumber } = req.body

        const appliedUser = await ugRegularSem1AdmissionForm.findOne({ appliedBy: user._id.toString() })

        let admissionFee = ""
        let collegeRollNo = ""

        //Test start
        let Physics = await ugRegularSem1AdmissionForm.find({ paper1: "Physics" })
        let physicsCount = Physics.length
        console.log("183", physicsCount)
        let Chemistry = await ugRegularSem1AdmissionForm.find({ paper1: "Chemistry" })
        let ChemistryCount = Chemistry.length
        console.log("186", ChemistryCount)
        let Zoology = await ugRegularSem1AdmissionForm.find({ paper1: "Zoology" })
        let ZoologyCount = Zoology.length
        console.log("189", ZoologyCount)
        let Botany = await ugRegularSem1AdmissionForm.find({ paper1: "Botany" })
        let BotanyCount = Botany.length
        console.log("192", BotanyCount)
        let Mathematics = await ugRegularSem1AdmissionForm.find({ paper1: "Mathematics" })
        let MathematicsCount = Mathematics.length
        console.log("195", MathematicsCount)

        let totalSciStu = physicsCount + ChemistryCount + ZoologyCount + BotanyCount + MathematicsCount

        if (paper1 === "Physics" || paper1 === "Chemistry" || paper1 === "Zoology" || paper1 === "Botany" || paper1 === "Mathematics") {

            collegeRollNo = `BS${totalSciStu}`
            const existRollNo = await ugRegularSem1AdmissionForm.findOne({ collegeRollNo })

            if (existRollNo != null) {
                collegeRollNo = `BS${Number(existRollNo.collegeRollNo.slice(2)) + 1}`
            } else {
                collegeRollNo = `BS${totalSciStu + 1}`
            }

        } else {
            const totalStu = await ugRegularSem1AdmissionForm.countDocuments()
            console.log("212", totalStu);

            let totalArtsStu = totalStu - totalSciStu
            collegeRollNo = `BA${totalArtsStu}`

            const existRollNo = await ugRegularSem1AdmissionForm.findOne({ collegeRollNo })

            if (existRollNo != null) {
                collegeRollNo = `BA${Number(existRollNo.collegeRollNo.slice(2)) + 1}`
            } else {
                collegeRollNo = `BA${totalArtsStu + 1}`
            }

        }
        //Test end 

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
                        admissionFee = 3455
                    } else if (category === "BC-1") {
                        admissionFee = 2855
                    } else {
                        admissionFee = 1200
                    }
                } else {
                    if (category === "GENERAL" || category === "BC-2") {
                        admissionFee = 2855
                    } else if (category === "BC-1") {
                        admissionFee = 2255
                    } else {
                        admissionFee = 600
                    }
                }

            } else {
                if (user.course === "Bachelor of Science" || paper1 === "Psychology") {
                    admissionFee = 1200
                } else {
                    admissionFee = 600
                }
            }

            const newAdmissionForm = new ugRegularSem1AdmissionForm({
                studentName, fatherName, motherName, guardianName, referenceNumber, email, applicantId, dOB, gender, familyAnnualIncome, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent, ppuConfidentialNumber,
                studentPhoto: photoURL,
                studentSign: signURL,
                appliedBy: user._id,
                admissionFee,
                collegeRollNo
            })

            const savedForm = await newAdmissionForm.save()
            await ugRegularSem1AdmissionPortal.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isPaid: true } })
            res.redirect("ug-reg-sen-1-pay")

        } else {

        }

    } catch (error) {
        console.log('Error', error);

    }
}

const ugRegularSem1Pay = async (req, res) => {
    try {
        const user = await ugRegularSem1AdmissionPortal.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem1AdmissionForm.findOne({ appliedBy: user._id.toString() })

        if (appliedUser.admissionFee === "2855") {
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=2855&tn=${appliedUser.referenceNumber}`, function (err, src) {
                res.status(201).render('ugRegularSem1PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        } else if (appliedUser.admissionFee === "2255") {
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=2255&tn=${appliedUser.referenceNumber}`, function (err, src) {
                res.status(201).render('ugRegularSem1PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        } else if (appliedUser.admissionFee === "600") {
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=600&tn=${appliedUser.referenceNumber}`, function (err, src) {
                res.status(201).render('ugRegularSem1PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        } else if (appliedUser.admissionFee === "3455") {
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=3455&tn=${appliedUser.referenceNumber}`, function (err, src) {
                res.status(201).render('ugRegularSem1PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        } else if (appliedUser.admissionFee === "1200") {
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=1200&tn=${appliedUser.referenceNumber}`, function (err, src) {
                res.status(201).render('ugRegularSem1PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        }

    } catch (error) {

    }
}

const ugRegularSem1PayPage = async (req, res) => {
    try {
        const { refNo } = req.body
        const user = await ugRegularSem1AdmissionPortal.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem1AdmissionForm.findOne({ appliedBy: user._id.toString() })

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

        let receiptNo = "24MDC" + appliedUser.referenceNumber.substring(3, 10);

        await ugRegularSem1AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL } })

        await ugRegularSem1AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { dateAndTimeOfPayment } })

        await ugRegularSem1AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentId: refNo } })
        await ugRegularSem1AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { isPaid: true } })
        await ugRegularSem1AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { receiptNo } })

        res.redirect("ugRegularSem1Receipt")
    } catch (error) {
        console.log(error);
    }
}

const ugRegularSem1Receipt = async (req, res) => {
    try {
        const user = await ugRegularSem1AdmissionPortal.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem1AdmissionForm.findOne({ appliedBy: user._id.toString() })
        if (appliedUser.isPaid === true) {
            res.render("ugRegularSem1Receipt", { appliedUser, user })
        } else {
            res.redirect("ug-reg-adm-form")
        }

    } catch (error) {
        console.log(error)
    }
}

const ugRegularSem1ExamForm = async (req, res) => {
    try {
        const user = await ugRegularSem1AdmissionPortal.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem1AdmissionForm.findOne({ appliedBy: user._id.toString() })
        if (appliedUser.isPaid === true) {
            res.render("ugRegularSem1ExamForm", { appliedUser, user })
        } else {
            res.redirect("ug-reg-adm-form")
        }
    } catch (error) {
        console.log(error)
    }
}


export {
    ugRegularSem1,
    ugRegularSem1Post,
    ugRegularSem1Login,
    ugRegularSem1Logout,
    ugRegularSem1LoginPost,
    otpForm,
    resendOTP,
    ugRegularSem1AdmForm,
    ugRegularSem1AdmFormPost,
    ugRegularSem1Pay,
    ugRegularSem1PayPage,
    ugRegularSem1Receipt,
    ugRegularSem1ExamForm
}