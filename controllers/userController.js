import User from '../models/userModel/userSchema.js'
import clcSchema from '../models/userModel/clcSchema.js'
//PP Test
import AdmissionFormPP from '../models/userModel/admissionFormSchemaPP.js'
import AdmissionForm from '../models/userModel/admissionFormSchema.js'
//============================================================================
import BBAadmissionForm from '../models/userModel/bbaAdmissionFormSchema.js'
import UgRegularAdmissionForm from '../models/userModel/ugRegularAdmissionFormSchema.js'
import FileUpload from '../fileUpload/fileUpload.js'
import qrcode from 'qrcode'
import Notice from '../models/adminModel/noticeSchema.js'

// Index Page
const index = async (req, res) => {
    return res.render('index')
}


// User Index Page
const userPage = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const notices = await Notice.find()

        return res.render('userPage', { user, notices })
    } catch (error) {
        res.status(401)
    }
}

// ============================================================
// PP Test

// Admission Form
const admissionForm = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        // console.log(user);

        const appliedUser = await AdmissionForm.findOne({ appliedBy: user._id.toString() })
        // console.log('line 32');
        // console.log(appliedUser);


        if (appliedUser !== null) {

            if (!appliedUser.isPaid) {
                if (appliedUser.category === "General" || appliedUser.category === "BC-2") {
                    qrcode.toDataURL(`upi://pay?pa=digit96938@barodampay&am=3000&tn=${appliedUser.mobileNumber}`, function (err, src) {
                        res.status(201).render('paymentPage', { "amount": "3000", "qrcodeUrl": src, user })
                    })

                } else if (appliedUser.category === "BC-1" || appliedUser.category === "SC" || appliedUser.category === "ST") {
                    qrcode.toDataURL(`upi://pay?pa=digit96938@barodampay&am=2830&tn=${appliedUser.mobileNumber}`, function (err, src) {
                        res.status(201).render('paymentPage', { "amount": "2830", "qrcodeUrl": src, user })
                    })
                }
            }
            else {
                return res.render('admissionForm', { user, appliedUser })
            }
        }
        else {
            return res.render('admissionForm', { user })
        }

    } catch (error) {
        res.status(401)
    }
}


// Admission Form Post
const admissionFormPost = async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.id })
        console.log('line 85');
        // console.log(user);

        const appliedUser = await AdmissionForm.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser);
        console.log("line 90");

        const { fullName, rollNumber, session, aadharNumber, dOB, gender, nationality, category, religion, fatherName, motherName, parmanentAddress, parmanentAddressPin, presentAddress, presentAddressPin, mobileNumber, email, course } = req.body



        const collCount = await AdmissionForm.countDocuments()
        // console.log(collCount);
        const admCount = collCount + 1
        // console.log(admCount);

        let slipNo = ""
        if (course === "I.A") {
            slipNo = "I.A/" + "2023-2025/" + (collCount + 1)
        } else {
            slipNo = "I.Sc/" + "2023-2025/" + (collCount + 1)
        }


        if (appliedUser == null || appliedUser.appliedBy != user._id.toString()) {
            // console.log(req.files);
            const images = req.files

            // console.log(images[0].path);
            const photoUpload = await FileUpload(images[0].path)
            const photoURL = photoUpload.secure_url
            // console.log(photoURL);

            // console.log(images[1].path);
            const signUpload = await FileUpload(images[1].path)
            const signURL = signUpload.secure_url
            // console.log(signURL);

            let admFee = ""
            if (category === "General" || category === "BC-2") {
                admFee = 3000
            } else if (category === "BC-1" || category === "SC" || appliedUser.category === "ST") {
                admFee = 2830
            }



            const admForm = new AdmissionForm({
                fullName: fullName.toUpperCase(),
                rollNumber,
                session,
                aadharNumber,
                dOB,
                gender,
                nationality,
                religion,
                category,
                fatherName,
                motherName,
                parmanentAddress,
                parmanentAddressPin,
                presentAddress,
                presentAddressPin,
                mobileNumber,
                email,
                course,
                admissionPhoto: photoURL,
                studentSign: signURL,
                admNumber: admCount,
                slipNo: slipNo,
                appliedBy: user._id,
                admFee
            })

            const admFormSubmitted = await admForm.save();
            console.log('line 131');

            if (category === "General" || category === "BC-2") {
                qrcode.toDataURL(`upi://pay?pa=digit96938@barodampay&am=3000&tn=${mobileNumber}`, function (err, src) {
                    res.status(201).render('paymentPage', { "amount": "3000", "qrcodeUrl": src, user })
                })
                console.log('Here is problem');

            } else if (category === "BC-1" || category === "SC" || appliedUser.category === "ST") {
                qrcode.toDataURL(`upi://pay?pa=digit96938@barodampay&am=2830&tn=${mobileNumber}`, function (err, src) {
                    res.status(201).render('paymentPage', { "amount": "2830", "qrcodeUrl": src, user })
                })

            }
        }
        else {
            res.status(201).render('admissionForm', { "alreadysubmitted": "You have already submitted the form.", user })
        }
    } catch (error) {
        res.status(401)
    }
}

//===================================== PP Work below

// const admissionFormPP = async (req, res) =>{
//     try {
//         const user = await User.findOne({ _id: req.id })
//         // console.log(user);

//         const appliedUser = await AdmissionFormPP.findOne({ appliedBy: user._id.toString() })
//         // console.log('line 32');
//         // console.log(appliedUser);


//         if (appliedUser !== null) {

//             if (!appliedUser.isPaid) {
//                 const formDetail = {
//                     fullName : appliedUser.fullName,
//                     category : appliedUser.category,
//                     amount : appliedUser.admFee,
//                     mobileNumber : appliedUser.mobileNumber
//                 }
//                 res.status(200).render('checkoutPage', {formDetail})
//             }
//             else {
//                 return res.render('admissionFormPP', { user, appliedUser })
//             }
//         }
//         else {
//             return res.render('admissionFormPP', { user })
//         }

//     } catch (error) {
//         res.status(401)
//     }
// }

// const admissionFormPostPP = async (req, res) =>{
//     try {

//         const user = await User.findOne({ _id: req.id })
//         console.log('line 85');
//         // console.log(user);

//         const appliedUser = await AdmissionFormPP.findOne({ appliedBy: user._id.toString() })
//         // console.log(appliedUser);
//         console.log("line 90");

//         const { fullName, rollNumber, session, aadharNumber, dOB, gender, nationality, category, religion, fatherName, motherName, parmanentAddress, parmanentAddressPin, presentAddress, presentAddressPin, mobileNumber, email, course } = req.body



//         const collCount = await AdmissionFormPP.countDocuments()
//         // console.log(collCount);
//         const admCount = collCount + 1
//         // console.log(admCount);

//         let slipNo = ""
//         if (course === "I.A") {
//             slipNo = "I.A/" + "2023-2025/" + (collCount + 1)
//         } else {
//             slipNo = "I.Sc/" + "2023-2025/" + (collCount + 1)
//         }


//         if (appliedUser == null || appliedUser.appliedBy != user._id.toString()) {
//             // console.log(req.files);
//             const images = req.files

//             // console.log(images[0].path);
//             const photoUpload = await FileUpload(images[0].path)
//             const photoURL = photoUpload.secure_url
//             // console.log(photoURL);

//             // console.log(images[1].path);
//             const signUpload = await FileUpload(images[1].path)
//             const signURL = signUpload.secure_url
//             // console.log(signURL);

//             let admFee = ""
//             if (category === "General" || category === "BC-2") {
//                 admFee = 1
//             } else if (category === "BC-1" || category === "SC" || appliedUser.category === "ST") {
//                 admFee = 1
//             }



//             const admForm = new AdmissionFormPP({
//                 fullName: fullName.toUpperCase(),
//                 rollNumber,
//                 session,
//                 aadharNumber,
//                 dOB,
//                 gender,
//                 nationality,
//                 religion,
//                 category,
//                 fatherName,
//                 motherName,
//                 parmanentAddress,
//                 parmanentAddressPin,
//                 presentAddress,
//                 presentAddressPin,
//                 mobileNumber,
//                 email,
//                 course,
//                 admissionPhoto: photoURL,
//                 studentSign: signURL,
//                 admNumber: admCount,
//                 slipNo: slipNo,
//                 appliedBy: user._id,
//                 admFee
//             })

//             const admFormSubmitted = await admForm.save();
//             console.log('line 131');
//             const formDetail = {
//                 fullName : admFormSubmitted.fullName,
//                 category : admFormSubmitted.category,
//                 amount : admFormSubmitted.admFee,
//                 mobileNumber : admFormSubmitted.mobileNumber
//             }
//             res.status(200).render('checkoutPage', {formDetail})
//             // res.status(200).redirect("checkoutPage")
//         }
//         else {
//             res.status(201).render('admissionForm', { "alreadysubmitted": "You have already submitted the form.", user })
//         }
//     } catch (error) {
//         res.status(401)
//     }
// }

//==========================================================================================================================


// UG Regular Admission Form
// const ugRegularAdmissionForm = async (req, res) => {
//     try {
//         const user = await User.findOne({ _id: req.id })
//         // console.log(user);

//         const appliedUser = await UgRegularAdmissionForm.findOne({ appliedBy: user._id.toString() })
//         // console.log('line 32');
//         // console.log(appliedUser);


//         if (appliedUser !== null) {
//             if (!appliedUser.isPaid) {
//                 if (appliedUser.category === "General" || appliedUser.category === "BC-2") {

//                     qrcode.toDataURL(`upi://pay?pa=digit96938@barodampay&am=3000&tn=${appliedUser.mobileNumber}`, function (err, src) {
//                         res.status(201).render('commonPayPage', { "qrcodeUrl": src, user, appliedUser })
//                     })

//                 } else if (appliedUser.category === "BC-1" || appliedUser.category === "SC" || appliedUser.category === "ST") {

//                     qrcode.toDataURL(`upi://pay?pa=digit96938@barodampay&am=2830&tn=${appliedUser.mobileNumber}`, function (err, src) {
//                         res.status(201).render('commonPayPage', { "qrcodeUrl": src, user, appliedUser })
//                     })

//                 }
//             }
//             else {
//                 return res.render('ugRegularAdmissionForm', { user, appliedUser })
//             }
//         }
//         else {
//             return res.render('ugRegularAdmissionForm', { user })
//         }
//     } catch (error) {
//         res.status(401)
//     }
// }


// UG Regular Admission Form Post
// const ugRegularAdmissionFormPost = async (req, res) => {
//     try {

//         const user = await User.findOne({ _id: req.id })

//         const appliedUser = await UgRegularAdmissionForm.findOne({ appliedBy: user._id.toString() })

//         const { fullName, uniRollNumber, uniRegNumber, collRollNumber, session, dOB, gender, category, aadharNumber, mobileNumber, email, course, twelthBoard, fatherName, motherName, address, addressPin, studentPhoto } = req.body


//         const collCount = await UgRegularAdmissionForm.countDocuments()
//         // console.log(collCount);
//         let admNo = collCount + 1
//         // console.log(admCount);
//         const existAdmNo = await UgRegularAdmissionForm.findOne({ admNo })
//         if (existAdmNo != null) {
//             admNo = existAdmNo.admNo + 1
//         } else {
//             admNo = collCount + 1
//         }

//         let receiptNo = ''

//         if (course === 'B.A') {
//             receiptNo = "UGREG/" + "B.A/" + "2023-2026/" + admNo
//         } else if (course === 'B.Com') {
//             receiptNo = "UGREG/" + "B.Com/" + "2023-2026/" + admNo
//         } else {
//             receiptNo = "UGREG/" + "B.Sc/" + "2023-2026/" + admNo
//         }


//         if (appliedUser == null || appliedUser.appliedBy != user._id.toString()) {
//             const images = req.files

//             const photoUpload = await FileUpload(images[0].path)
//             const photoURL = photoUpload.secure_url

//             const signUpload = await FileUpload(images[1].path)
//             const signURL = signUpload.secure_url

//             let admFee = ""
//             if (category === "General" || category === "BC-2") {
//                 admFee = 3000
//             } else if (category === "BC-1" || category === "SC" || category === "ST") {
//                 admFee = 2830
//             }

//             const admForm = new UgRegularAdmissionForm({
//                 fullName: fullName.toUpperCase(),
//                 uniRollNumber,
//                 uniRegNumber,
//                 collRollNumber,
//                 session,
//                 dOB,
//                 gender,
//                 category,
//                 aadharNumber,
//                 mobileNumber,
//                 email,
//                 course,
//                 twelthBoard,
//                 fatherName: fatherName.toUpperCase(),
//                 motherName: motherName.toUpperCase(),
//                 address: address.toUpperCase(),
//                 addressPin,
//                 studentPhoto: photoURL,
//                 studentSign: signURL,
//                 appliedBy: user._id,
//                 admNo,
//                 receiptNo,
//                 admFee
//             })

//             const admFormSubmitted = await admForm.save();


//             if (category === "General" || category === "BC-2") {

//                 res.redirect(`/payment/${admFormSubmitted.course}/${admFormSubmitted.appliedBy}`)

//             } else if (category === "BC-1" || category === "SC" || category === "ST") {

//                 res.redirect(`/payment/${admFormSubmitted.course}/${admFormSubmitted.appliedBy}`)

//             }
//         }
//         else {
//             res.status(201).render('ugRegularAdmissionForm', { "alreadysubmitted": "You have already submitted the form.", user })
//         }
//     } catch (error) {
//         res.status(401)
//     }
// }


// BBA Admission Form
const bbaAdmissionForm = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        // console.log(user);

        const appliedUser = await BBAadmissionForm.findOne({ appliedBy: user._id.toString() })
        // console.log('line 32');
        // console.log(appliedUser);


        if (appliedUser !== null) {
            if (!appliedUser.isPaid) {
                if (appliedUser.category === "General" || appliedUser.category === "BC-2") {

                    qrcode.toDataURL(`upi://pay?pa=digit96938@barodampay&am=3000&tn=${appliedUser.mobileNumber}`, function (err, src) {
                        res.status(201).render('commonPayPage', { "qrcodeUrl": src, user, appliedUser })
                    })

                } else if (appliedUser.category === "BC-1" || appliedUser.category === "SC" || appliedUser.category === "ST") {

                    qrcode.toDataURL(`upi://pay?pa=digit96938@barodampay&am=2830&tn=${appliedUser.mobileNumber}`, function (err, src) {
                        res.status(201).render('commonPayPage', { "qrcodeUrl": src, user, appliedUser })
                    })

                }
            }
            else {
                return res.render('bbaAdmissionForm', { user, appliedUser })
            }
        }
        else {
            return res.render('bbaAdmissionForm', { user })
        }
    } catch (error) {
        res.status(401)
    }
}


// BBA Admission Form Post
const bbaAdmissionFormPost = async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.id })

        const appliedUser = await BBAadmissionForm.findOne({ appliedBy: user._id.toString() })

        const { fullName, uniRollNumber, uniRegNumber, collRollNumber, session, dOB, gender, category, aadharNumber, mobileNumber, email, course, twelthBoard, fatherName, motherName, address, addressPin, studentPhoto } = req.body


        const collCount = await BBAadmissionForm.countDocuments()
        // console.log(collCount);
        let admNo = collCount + 1
        // console.log(admCount);
        const existAdmNo = await BBAadmissionForm.findOne({ admNo })
        if (existAdmNo != null) {
            admNo = existAdmNo.admNo + 1
        } else {
            admNo = collCount + 1
        }

        let receiptNo = "BBA/" + "2023-2026/" + admNo


        if (appliedUser == null || appliedUser.appliedBy != user._id.toString()) {
            const images = req.files

            const photoUpload = await FileUpload(images[0].path)
            const photoURL = photoUpload.secure_url

            let admFee = ""
            if (category === "General" || category === "BC-2") {
                admFee = 3000
            } else if (category === "BC-1" || category === "SC" || category === "ST") {
                admFee = 2830
            }

            const admForm = new BBAadmissionForm({
                fullName: fullName.toUpperCase(),
                uniRollNumber,
                uniRegNumber,
                collRollNumber,
                session,
                dOB,
                gender,
                category,
                aadharNumber,
                mobileNumber,
                email,
                course,
                twelthBoard,
                fatherName: fatherName.toUpperCase(),
                motherName: motherName.toUpperCase(),
                address: address.toUpperCase(),
                addressPin,
                studentPhoto: photoURL,
                appliedBy: user._id,
                admNo,
                receiptNo,
                admFee
            })

            const admFormSubmitted = await admForm.save();
            // console.log('400');



            if (category === "General" || category === "BC-2") {

                res.redirect(`/payment/${admFormSubmitted.course}/${admFormSubmitted.appliedBy}`)

            } else if (category === "BC-1" || category === "SC" || category === "ST") {

                res.redirect(`/payment/${admFormSubmitted.course}/${admFormSubmitted.appliedBy}`)

            }
        }
        else {
            res.status(201).render('bbaAdmissionForm', { "alreadysubmitted": "You have already submitted the form.", user })
        }
    } catch (error) {
        res.status(401)
    }
}


// CLC Form
const clc = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })

        const appliedUser = await clcSchema.findOne({ appliedBy: user._id.toString() })
        // console.log('line 32');
        // console.log(appliedUser);


        if (appliedUser !== null) {
            if (!appliedUser.isPaid) {

                qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=600&tn=${appliedUser.fullName}`, function (err, src) {
                    res.status(201).render('certificatePayPage', { "qrcodeUrl": src, user, appliedUser })
                })
            }
            else {
                return res.render('clc', { user, appliedUser })
            }
        }
        else {
            return res.render('clc', { user })
        }
    } catch (error) {
        res.status(401)
    }
}


// CLC Form Post
const clcPost = async (req, res) => {
    try {
        const { fullName, fatherName, motherName, aadharNumber, parmanentAddress, dOB, course, session, dOAdm, classRollNumber, yearOfExam, resultDivision, regNumber, uniRollNumber } = req.body
        const user = await User.findOne({ _id: req.id })

        const appliedUser = await clcSchema.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser);

        const appliedRoll = await clcSchema.findOne({ uniRollNumber: uniRollNumber })
        if (appliedRoll === null) {
            const collCount = await clcSchema.countDocuments()
            // console.log(collCount);
            let serialNo = collCount + 1
            // console.log(serialNo);
            const existSerialNo = await clcSchema.findOne({ serialNo })
            if (existSerialNo != null) {
                serialNo = existSerialNo.serialNo + 1
            } else {
                serialNo = collCount + 1
            }

            let studentId = "MDC/" + uniRollNumber

            if (appliedUser == null || appliedUser.appliedBy != user._id.toString()) {
                const clcForm = new clcSchema({
                    fullName: fullName.toUpperCase(),
                    fatherName: fatherName.toUpperCase(),
                    motherName: motherName.toUpperCase(),
                    aadharNumber,
                    parmanentAddress: parmanentAddress.toUpperCase(),
                    dOB,
                    course,
                    session,
                    dOAdm,
                    classRollNumber,
                    yearOfExam: yearOfExam.toUpperCase(),
                    resultDivision: resultDivision.toUpperCase(),
                    regNumber: regNumber.toUpperCase(),
                    uniRollNumber,
                    serialNo,
                    studentId,
                    status: "Pending",
                    clcFee: '600',
                    appliedBy: user._id
                })
                const sendApproval = await clcForm.save();

                res.redirect(`/payment/certificates/${sendApproval.certificateType}/${sendApproval.appliedBy}`)
            }
            else {
                res.status(201).render('clc', { "alreadysubmitted": "You have already submitted the form.", user })
            }
        } else {
            res.status(201).render('clc', { "alreadysubmitted": "Already submitted with this Roll no.", user })
        }


    }
    catch (error) {
        console.log(error);
        res.status(400).render('error');
    }

}


//  Notice
const userNotice = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const notices = await Notice.find()

        return res.render('userNotice', { user, notices })
    } catch (error) {
        res.status(401)
    }
}

const eachUserNotice = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findOne({ _id: req.id })
        const notice = await Notice.findOne({ _id: id })

        return res.render('noticePreview', { user, notice })
    } catch (error) {
        res.status(401)
    }
}

export {
    index,
    userPage,
    admissionForm,
    admissionFormPost,
    // admissionFormPP,
    // admissionFormPostPP,
    // ugRegularAdmissionForm,
    // ugRegularAdmissionFormPost,
    bbaAdmissionForm,
    bbaAdmissionFormPost,
    clc,
    clcPost,
    userNotice,
    eachUserNotice
}