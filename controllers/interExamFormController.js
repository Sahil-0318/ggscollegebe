import unirest from 'unirest'
import jwt from 'jsonwebtoken'
import InterExamFormList from "../models/adminModel/interExamFormList.js"
import interExamForm from "../models/userModel/interExamFormSchema.js"
import FileUpload from '../fileUpload/fileUpload.js'
import qrcode from 'qrcode'
import PortalOnOff from '../models/adminModel/portalOnOffSchema.js'

export const signup = async (req, res) => {
    try {
        const portal = await PortalOnOff.findOne({portal : "interExamFormPortal"})
        if (portal.isOn == true) {
            return res.render("interExamFormSignup")
        }  
        if (portal.isOn == false) {
            return res.render('pageNotFound', {status : "Intermediate Exam Form (2023 - 25) Portal has been closed.", loginPage : "interExamFormLogin"})
        }

    } catch (error) {
        console.log("Error in exam form signup", error)
    }
}

export const signupPost = async (req, res) => {
    try {
        const { registrationNumber, mobileNumber } = req.body

        const foundRegistrationNumber = await InterExamFormList.findOne({ registrationNumber, registered: false })
        const foundMobileNumber = await InterExamFormList.findOne({ mobileNumber })

        // console.log(foundRegistrationNumber, foundMobileNumber)
        if (foundRegistrationNumber !== null && foundMobileNumber === null) {

            // Generate Paaword Function
            function generatePassword() {
                const characters = 'ABC0DEF1GHI2JKL3MNO4PQR5STU6VWX7Y89';
                let otp = '';
                for (let i = 0; i < 8; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    otp += characters[randomIndex];
                }
                return otp;
            }
            let password = generatePassword()

            var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            req.headers({
                "authorization": process.env.FAST2SMS_API
            });

            req.form({
                "sender_id": process.env.DLT_USER_PSSWORD_SENDER_ID,
                "message": process.env.YOUR_USER_PSSWORD_MESSAGE_ID,
                "variables_values": `${registrationNumber}|${password}`,
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

            await InterExamFormList.findOneAndUpdate({ registrationNumber }, { $set: { mobileNumber, password, registered: true, userID : registrationNumber } })

            res.redirect("/interExamFormLogin")

        } else {
            res.render("interExamFormSignup", { "invalid": 'Registration No or Mobile already registered' })
        }


    } catch (error) {
        console.log("Error in exam form signupPost", error)
    }
}

export const login = async (req, res) => {
    try {
        res.render("interExamFormLogin")
    } catch (error) {
        console.log("Error in exam form login", error)
    }
}

export const loginPost = async (req, res) => {
    try {
        const { userID, password } = req.body
        const foundUser = await InterExamFormList.findOne({ userID })
        // console.log(foundUser)

        if (foundUser != null) {
            if (foundUser.password === password) {
                const token = jwt.sign({
                    id: foundUser._id,
                    mobileNumber: foundUser.mobileNumber
                }, process.env.SECRET_KEY,
                    { expiresIn: "7d" })
                res.cookie('uid', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })

                res.status(201).redirect('/interExamForm')
            } else {
                return res.render('interExamFormLogin', { invalid: "User Id or Password is incorrect" })
            }
        } else {
            return res.render('interExamFormLogin', { invalid: "User doesn't exists, Please register now." })
        }
    } catch (error) {
        console.log("Error in exam form loginPost", error)
    }
}

export const logout = async (req, res) => {
    res.clearCookie("uid");
    res.status(201).redirect('https://www.mdcollegenaubatpur.ac.in/')
    // res.status(201).redirect('/ugRegularPart3Login')
}

export const interExamForms = async (req, res) => {
    try {
        const user = await InterExamFormList.findOne({ _id: req.id })
        // console.log(user)
        const appliedUser = await interExamForm.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser)

        if (appliedUser != null) {
            res.render('interExamForm', { user, appliedUser })
        } else {
            res.render('interExamForm', { user })
        }

    } catch (error) {
        console.log("Error in exam form interExamForms", error)
    }
}

export const interExamFormPost = async (req, res) => {
    try {
        const user = await InterExamFormList.findOne({ _id: req.id })
        
        const { registrationNoAndYear, BSEBUniqueId, studentCategory, collegeCode, collegeName, districtName, studentName, fatherName, motherName, dOB, matricPassingBoardName, matricBoardRollCode, matricBoardRollNumber, matricBoardPassingYear, gender, casteCategory, differentlyAbled, nationality, religion, aadharNumber, qualifyingCategoryRollCode, qualifyingCategoryRollNumber, qualifyingCategoryPassingYear, qualifyingCategoryInstitutionArea, qualifyingCategoryInstitutionSubDivision, qualifyingCategoryMobileNumber, qualifyingCategoryEmail, qualifyingCategoryStudentName, qualifyingCategoryFatherName, qualifyingCategoryMotherName, qualifyingCategoryAddress, qualifyingCategoryMaritalStatus, qualifyingCategoryStudentBankAccountNumber, qualifyingCategoryIFSCCode, qualifyingCategoryBankAndBranchName, qualifyingCategoryTwoIdentificationMarks, qualifyingCategoryMediumOfExam, compulsorySubject1, compulsorySubject2, electiveSubject1, electiveSubject2, electiveSubject3, additionalSubject } = req.body

        const appliedUser = await interExamForm.findOne({ appliedBy: user._id.toString() })
        let examFee = ""
        if (appliedUser == null){
            const images = req.files

            // console.log(images[0].path);
            const photoUpload = await FileUpload(images[0].buffer)
            const photoURL = photoUpload.secure_url
            // console.log(photoURL);

            // console.log(images[1].path);
            const signUpload = await FileUpload(images[1].buffer)
            const signURL = signUpload.secure_url
            // console.log(signURL);

            // -------------
            if(studentCategory === "Regular"){
                if (casteCategory === "GENERAL" || casteCategory === "BC-2") {
                    examFee = 1930
                } else {
                    examFee = 1670
                }
            } else if (studentCategory === "Improvement") {
                examFee = 2270
            } else if (studentCategory === "Ex Student") {
                examFee = 1590
            } else if (studentCategory === "Compartmental") {
                examFee = 1460
            }

            const newInterExamForm = new interExamForm({
                registrationNoAndYear, BSEBUniqueId, studentCategory, collegeCode, collegeName, districtName, studentName, fatherName, motherName, dOB, matricPassingBoardName, matricBoardRollCode, matricBoardRollNumber, matricBoardPassingYear, gender, casteCategory, differentlyAbled, nationality, religion, aadharNumber,
                qualifyingCategoryRollCode, qualifyingCategoryRollNumber, qualifyingCategoryPassingYear, qualifyingCategoryInstitutionArea, qualifyingCategoryInstitutionSubDivision, qualifyingCategoryMobileNumber, qualifyingCategoryEmail, qualifyingCategoryStudentName, qualifyingCategoryFatherName, qualifyingCategoryMotherName, qualifyingCategoryAddress, qualifyingCategoryMaritalStatus, qualifyingCategoryStudentBankAccountNumber, qualifyingCategoryIFSCCode, qualifyingCategoryBankAndBranchName, qualifyingCategoryTwoIdentificationMarks, qualifyingCategoryMediumOfExam,
                compulsorySubject1, compulsorySubject2, electiveSubject1, electiveSubject2, electiveSubject3, additionalSubject,
                faculty : user.faculty,
                studentPhoto: photoURL,
                studentSign: signURL,
                appliedBy: user._id,
                examFee,
                isFormFilled : true
            }) 

            await newInterExamForm.save()
            await InterExamFormList.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isFormFilled: true } })
            res.redirect("/interExamFormPay")
        }
    } catch (error) {
        console.log("Error in exam form interExamFormPost", error)
    }
}


export const interExamFormPay = async (req, res) => {
    try {
        const user = await InterExamFormList.findOne({ _id: req.id })
        const appliedUser = await interExamForm.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser)

        if (appliedUser.isPaid) {
            return res.redirect("/interExamForm")
        }

        qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.examFee)}&tn=${appliedUser.studentName}`, function (err, src) {
            res.status(201).render('interExamFormPayPage', { "qrcodeUrl": src, upiId : process.env.UPI_ID, user, appliedUser })
        })

    } catch (error) {
        console.log("Error in interExamFormPay =====>", error)
    }
}


export const interExamFormPayPost = async (req, res) => {
    try {
        const { refNo } = req.body
        const user = await InterExamFormList.findOne({ _id: req.id })
        const appliedUser = await interExamForm.findOne({ appliedBy: user._id.toString() })

        const existPaymentId = await interExamForm.findOne({ paymentId: refNo })

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

            await interExamForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL, dateAndTimeOfPayment, paymentId: refNo, isPaid: true, receiptNo } })

            res.redirect("/interExamFormReceipt")

        } else {
            qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.examFee)}&tn=${appliedUser.studentName}`, function (err, src) {
                res.status(201).render('interExamFormPayPage', { "qrcodeUrl": src, upiId : process.env.UPI_ID, user, appliedUser, invalid: "Please enter valid UTR / Ref no. (कृपया वैध यूटीआर/रेफ नंबर दर्ज करें।)" })
            })
        }
        

    } catch (error) {
        console.log("Error in interExamFormPayPost =====>", error)
    }
}


export const interExamFormReceipt = async (req, res) => {
    try {
        const user = await InterExamFormList.findOne({ _id: req.id })
        const appliedUser = await interExamForm.findOne({ appliedBy: user._id.toString() })
        
        if (appliedUser.isPaid === true) {
            res.render("interExamFormReceipt", { appliedUser, user })
        } else {
            res.redirect("interExamForm")
        }

    } catch (error) {
        console.log("Error in interExamFormReceipt =====>", error)
    }
}


export const interExamFormCopy = async (req, res) => {
    try {
        const user = await InterExamFormList.findOne({ _id: req.id })
        const appliedUser = await interExamForm.findOne({ appliedBy: user._id.toString() })
        
        if (appliedUser.isPaid === true) {
            res.render("interExamFormCopy", { appliedUser, user })
        } else {
            res.redirect("/interExamForm")
        }

    } catch (error) {
        console.log("Error in interExamFormCopy =====>", error)
    }
}

// const appliedUser = {}
// res.render("interExamFormCopy", {appliedUser})