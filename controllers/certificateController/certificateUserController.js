import User from '../../models/userModel/userSchema.js'
import NewClc from '../../models/certificateModels/newClc.js'
import Bonafied from '../../models/certificateModels/bonafied.js'
import TC from '../../models/certificateModels/tc.js'
import CC from '../../models/certificateModels/cc.js'


import FileUpload from '../../fileUpload/fileUpload.js'
import qrcode from 'qrcode'

// ========================= CLC ===================================
export const clcApply = async (req, res) => {
    try {
        const { type } = req.query
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await NewClc.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser)
        if (type === undefined) {
            if (appliedUser != null) {
                return res.render('clcForm', { user, type: "normal", appliedUser })
            }
            return res.render('clcForm', { user, type: "normal" })
        } else {
            if (appliedUser != null) {
                return res.render('clcForm', { user, type, appliedUser })
            }
            return res.render('clcForm', { user, type })
        }

    } catch (error) {
        console.log("Error in NewClc Form => ", error)
    }
}

export const clcApplyPost = async (req, res) => {
    try {
        const { type } = req.query
        console.log("Line 30 type in clcApplyPost", type)
        const user = await User.findOne({ _id: req.id })
        const { fullName, fatherName, motherName, aadharNumber, parmanentAddress, dOB, course, session, dOAdm, classRollNumber, yearOfExam, resultDivision, regNumber, uniRollNumber } = req.body

        const appliedUser = await NewClc.findOne({ appliedBy: user._id.toString() })
        const appliedUniRegNumber = await NewClc.findOne({ regNumber })

        if (appliedUniRegNumber === null) {
            const collCount = await NewClc.countDocuments()
            // console.log(collCount);
            let serialNo = collCount + 1
            // console.log(serialNo);
            const existSerialNo = await NewClc.findOne({ serialNo })
            if (existSerialNo != null) {
                serialNo = existSerialNo.serialNo + 1
            } else {
                serialNo = collCount + 1
            }

            let studentId = "MDC/" + uniRollNumber

            const newCLCForm = new NewClc({
                fullName: fullName.trim(), fatherName: fatherName.trim(), motherName: motherName.trim(), aadharNumber, parmanentAddress: parmanentAddress.trim(), dOB, course, session, dOAdm, classRollNumber: classRollNumber.trim(), yearOfExam, resultDivision, regNumber: regNumber.trim(), uniRollNumber: uniRollNumber.trim(),
                serialNo,
                studentId,
                appliedBy: user._id,
                isFormFilled: true
            })

            await newCLCForm.save()
            res.redirect(`/certificateFee/clc?type=${type}`)
        }

    } catch (error) {
        console.log("Error in bonafiedFormPost => ", error)
    }
}

// ========================= Bonafied ===================================
export const bonafiedForm = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await Bonafied.findOne({ appliedBy: user._id.toString() })
        if (appliedUser != null) {
            return res.render('bonafiedForm', { user, appliedUser })
        }
        return res.render('bonafiedForm', { user })
    } catch (error) {
        console.log("Error in bonafiedForm => ", error)
    }
}

export const bonafiedFormPost = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const { fullName, sonDaughter, fatherName, motherName, collegeRollNumber, uniRegNumber, mobileNumber, email, course, courseName, honoursName, partSem, partSemName, courseSession, gender } = req.body

        const appliedUser = await Bonafied.findOne({ appliedBy: user._id.toString() })
        const appliedUniRegNumber = await Bonafied.findOne({ uniRegNumber })

        if (appliedUniRegNumber === null) {
            const images = req.files
            let marksheetPhoto = ""
            let studentPhoto = ""
            let lastAdmissionReceipt = ""


            if (images.length == 3) {
                const marksheetPhotoUpload = await FileUpload(images[0].buffer)
                marksheetPhoto = marksheetPhotoUpload.secure_url

                const studentPhotoUpload = await FileUpload(images[1].buffer)
                studentPhoto = studentPhotoUpload.secure_url

                const lastAdmissionReceiptUpload = await FileUpload(images[2].buffer)
                lastAdmissionReceipt = lastAdmissionReceiptUpload.secure_url
            } else {
                const marksheetPhotoUpload = await FileUpload(images[0].buffer)
                marksheetPhoto = marksheetPhotoUpload.secure_url

                const studentPhotoUpload = await FileUpload(images[1].buffer)
                studentPhoto = studentPhotoUpload.secure_url
            }

            const newBonafiedForm = new Bonafied({
                fullName: fullName.trim(), sonDaughter, fatherName: fatherName.trim(), motherName: motherName.trim(), collegeRollNumber: collegeRollNumber.trim(), uniRegNumber: uniRegNumber.trim(), mobileNumber, email, course, courseName, honoursName: honoursName.trim(), partSem, partSemName, courseSession: courseSession.trim(), gender, marksheetPhoto, studentPhoto, lastAdmissionReceipt, appliedBy: user._id
            })

            await newBonafiedForm.save()
            res.redirect("/certificateFee/bonafied")
        }

    } catch (error) {
        console.log("Error in bonafiedFormPost => ", error)
    }
}

// ================================ TC ======================================
export const tcForm = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await TC.findOne({ appliedBy: user._id.toString() })
        if (appliedUser != null) {
            return res.render('tcForm', { user, appliedUser })
        }
        return res.render('tcForm', { user })
    } catch (error) {
        console.log("Error in TCForm => ", error)
    }
}

export const tcFormPost = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const { fullName, fatherName, motherName, aadharNumber, mobileNumber, email, dOB, session, course, courseName, honoursName, collegeClass, lastPassedClass, collegeRollNumber, collegeFrom, collegeTo } = req.body

        const appliedUser = await TC.findOne({ appliedBy: user._id.toString() })
        const appliedCollegeRollNumber = await TC.findOne({ collegeRollNumber })

        if (appliedCollegeRollNumber === null) {
            const images = req.files
            let marksheetPhoto = ""
            let studentPhoto = ""
            let lastAdmissionReceipt = ""


            if (images.length == 3) {
                const marksheetPhotoUpload = await FileUpload(images[0].buffer)
                marksheetPhoto = marksheetPhotoUpload.secure_url

                const studentPhotoUpload = await FileUpload(images[1].buffer)
                studentPhoto = studentPhotoUpload.secure_url

                const lastAdmissionReceiptUpload = await FileUpload(images[2].buffer)
                lastAdmissionReceipt = lastAdmissionReceiptUpload.secure_url
            } else {
                const marksheetPhotoUpload = await FileUpload(images[0].buffer)
                marksheetPhoto = marksheetPhotoUpload.secure_url

                const studentPhotoUpload = await FileUpload(images[1].buffer)
                studentPhoto = studentPhotoUpload.secure_url
            }

            const newTCForm = new TC({
                fullName: fullName.trim(), fatherName: fatherName.trim(), motherName: motherName.trim(), aadharNumber: aadharNumber.trim(), mobileNumber, email, dOB, session: session.trim(), course, courseName, honoursName: honoursName.trim(), collegeClass: collegeClass.trim(), lastPassedClass: lastPassedClass.trim(), collegeRollNumber: collegeRollNumber.trim(), collegeFrom: collegeFrom.trim(), collegeTo: collegeTo.trim(), marksheetPhoto, studentPhoto, lastAdmissionReceipt, appliedBy: user._id
            })

            await newTCForm.save()
            res.redirect("/certificateFee/tc")
        }

    } catch (error) {
        console.log("Error in TCFormPost => ", error)
    }
}

// ====================== Character Certificate ================================
export const ccForm = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await CC.findOne({ appliedBy: user._id.toString() })
        if (appliedUser != null) {
            return res.render('cc', { user, appliedUser })
        }
        return res.render('cc', { user })
    } catch (error) {
        console.log("Error in cc Form => ", error)
    }
}

export const ccFormPost = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const { fullName, fatherName, motherName, courseName, session, collegeRollNumber } = req.body

        const appliedUser = await CC.findOne({ appliedBy: user._id.toString() })
        const appliedCollegeRollNumber = await CC.findOne({ collegeRollNumber })

        if (appliedCollegeRollNumber === null) {
            function generateRandom4DigitNumber() {
                return Math.floor(1000 + Math.random() * 9000);
            }

            const characterCertificateCount = await CC.countDocuments()
            let serialNo = characterCertificateCount + 1

            const newCCForm = new CC({
                fullName: fullName.trim(), fatherName: fatherName.trim(), motherName: motherName.trim(), courseName, session: session.trim(), collegeRollNumber: collegeRollNumber.trim(), appliedBy: user._id, serialNo, studentId: `MDC-${generateRandom4DigitNumber()}${collegeRollNumber}`
            })

            await newCCForm.save()
            res.redirect("/certificateFee/cc")
        }

    } catch (error) {
        console.log("Error in cc Form Post => ", error)
    }
}

// ========================== Certificate Payment ==================================
export const certificateFeePay = async (req, res) => {
    try {
        const { certificateType } = req.params
        console.log("Line 233 certificateType in certificateFeePay", certificateType)
        const { type } = req.query
        console.log("Line 235 type in certificateFeePay", type)

        const user = await User.findOne({ _id: req.id })
        let appliedUser = ""
        let extraInfo = {}

        if (certificateType === "clc") {
            appliedUser = await NewClc.findOne({ appliedBy: user._id.toString() })

            // extra info
            if (type === "normal") {
                extraInfo.title = "normal"
                extraInfo.feeAmount = appliedUser.normalClcFee
            } else if (type === "urgent") {
                extraInfo.title = "urgent"
                extraInfo.feeAmount = appliedUser.urgentClcFee
            } else if (type === "duplicate") {
                extraInfo.title = "duplicate"
                extraInfo.feeAmount = appliedUser.duplicateClcFee
            }
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then CLC receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो CLC रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
        }

        if (certificateType === "bonafied") {
            appliedUser = await Bonafied.findOne({ appliedBy: user._id.toString() })

            // extra info
            extraInfo.title = "Bonafied"
            extraInfo.feeAmount = appliedUser.feeAmount
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then bonafied receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो Bonafied रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
        }

        if (certificateType === "tc") {
            appliedUser = await TC.findOne({ appliedBy: user._id.toString() })

            // extra info
            extraInfo.title = "TC"
            extraInfo.feeAmount = appliedUser.feeAmount
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then TC receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो TC रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
        }

        if (certificateType === "cc") {
            appliedUser = await CC.findOne({ appliedBy: user._id.toString() })

            // extra info
            extraInfo.title = "cc"
            extraInfo.feeAmount = appliedUser.feeAmount
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then Character Certificate receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो Character Certificate रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
        }

        qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(extraInfo.feeAmount)}&tn=${appliedUser.fullName}`, function (err, src) {
            res.status(201).render('certificatePaymentPage', { "qrcodeUrl": src, user, appliedUser, extraInfo, type })
        })

    } catch (error) {
        console.log("Error in certificateFeePay => ", error)
    }
}

export const certificateFeePayPost = async (req, res) => {
    try {
        const { refNo, certificateType } = req.body
        console.log("Line 305 certificateType in certificateFeePayPost", certificateType)
        const { type } = req.query
        console.log("Line 307 type in certificateFeePayPost", type)

        const user = await User.findOne({ _id: req.id })

        let extraInfo = {}
        let appliedUser = ""
        let existPaymentId = ""
        let certificateSchema = ""

        if (certificateType === "clc") {
            appliedUser = await NewClc.findOne({ appliedBy: user._id.toString() })
            certificateSchema = NewClc

            if (type === "normal") {
                extraInfo.title = "normal"
                extraInfo.feeAmount = appliedUser.normalClcFee
                existPaymentId = await NewClc.findOne({ normalPaymentRefNo: refNo })
            } else if (type === "urgent") {
                extraInfo.title = "urgent"
                extraInfo.feeAmount = appliedUser.urgentClcFee
                existPaymentId = await NewClc.findOne({ urgentPaymentRefNo: refNo })
            } else if (type === "duplicate") {
                extraInfo.title = "duplicate"
                extraInfo.feeAmount = appliedUser.duplicateClcFee
                existPaymentId = await NewClc.findOne({ duplicatePaymentRefNo: refNo })
            }
            // extra info
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then CLC receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो CLC रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
        }

        if (certificateType === "Bonafied") {
            appliedUser = await Bonafied.findOne({ appliedBy: user._id.toString() })
            existPaymentId = await Bonafied.findOne({ paymentRefNo: refNo })
            extraInfo.feeAmount = appliedUser.feeAmount

            certificateSchema = Bonafied
            // extra info
            extraInfo.title = "Bonafied"
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then bonafied receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो Bonafied रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
        }

        if (certificateType === "TC") {
            appliedUser = await TC.findOne({ appliedBy: user._id.toString() })
            existPaymentId = await TC.findOne({ paymentRefNo: refNo })

            certificateSchema = TC
            // extra info
            extraInfo.title = "TC"
            extraInfo.feeAmount = appliedUser.feeAmount
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then TC receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो TC रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
        }

        if (certificateType === "cc") {
            appliedUser = await CC.findOne({ appliedBy: user._id.toString() })
            existPaymentId = await CC.findOne({ paymentRefNo: refNo })

            certificateSchema = CC
            // extra info
            extraInfo.title = "cc"
            extraInfo.feeAmount = appliedUser.feeAmount
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then CharacterCertificate receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो CharacterCertificate रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
        }


        if (existPaymentId === null) {
            const photoUpload = await FileUpload(req.file.buffer)
            const paymentSS = photoUpload.secure_url

            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const paidAt = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`

            if (certificateType === "clc") {
                if (type === "normal") {
                    await certificateSchema.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { normalPaymentSS: paymentSS, normalPaidAt: paidAt, normalPaymentRefNo: refNo, isNormalPaid: true, isNormalIssued: false, normalPaymentReceipt: `MDC-${Date.now()}` } })

                    res.redirect(`/certificateReceipt/${certificateType.toLowerCase()}?type=normal`)
                }
                if (type === "urgent") {
                    await certificateSchema.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { urgentPaymentSS: paymentSS, urgentPaidAt: paidAt, urgentPaymentRefNo: refNo, isUrgentPaid: true, isUrgentIssued: false, urgentPaymentReceipt: `MDC-${Date.now()}` } })

                    res.redirect(`/certificateReceipt/${certificateType.toLowerCase()}?type=urgent`)
                }
                if (type === "duplicate") {
                    await certificateSchema.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { duplicatePaymentSS: paymentSS, duplicatePaidAt: paidAt, duplicatePaymentRefNo: refNo, isDuplicatePaid: true, isDuplicateIssued: false, duplicatePaymentReceipt: `MDC-${Date.now()}` } })

                    res.redirect(`/certificateReceipt/${certificateType.toLowerCase()}?type=duplicate`)
                }
            } else {
                await certificateSchema.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS, paidAt, paymentRefNo: refNo, isPaid: true, paymentReceipt: `MDC-${Date.now()}` } })

                res.redirect(`/certificateReceipt/${certificateType.toLowerCase()}`)
            }

        } else {
            qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(extraInfo.feeAmount)}&tn=${appliedUser.fullName}`, function (err, src) {
                res.status(201).render('certificatePaymentPage', { "qrcodeUrl": src, user, appliedUser, extraInfo, type, invalid: "Please enter valid UTR / Ref no. (कृपया वैध यूटीआर/रेफ नंबर दर्ज करें।)" })
            })
        }



    } catch (error) {
        console.log("Error in certificateFeePayPost => ", error)
    }
}

export const certificateReceipt = async (req, res) => {
    try {
        const { certificateType } = req.params
        console.log("Line 430 certificateType in certificateReceipt", certificateType)
        const { type } = req.query
        console.log("Line 432 certificateType in certificateReceipt", type)
        const user = await User.findOne({ _id: req.id })
        let appliedUser = ""
        let extraInfo = {}

        if (certificateType === "clc") {
            appliedUser = await NewClc.findOne({ appliedBy: user._id.toString() })

            // extra Info
            extraInfo.certificateType = "clc"
            extraInfo.type = type

            if (type === "normal") {
                if (appliedUser.isNormalPaid === false) {
                    res.redirect("/clcApply?type=normal")
                }
            }

            if (type === "urgent") {
                if (appliedUser.isUrgentPaid === false) {
                    res.redirect("/clcApply?type=urgent")
                }
            }

            if (type === "duplicate") {
                if (appliedUser.isDuplicatePaid === false) {
                    res.redirect("/clcApply?type=duplicate")
                }
            }
        }

        if (certificateType === "bonafied") {
            appliedUser = await Bonafied.findOne({ appliedBy: user._id.toString() })

            // extra Info
            extraInfo.certificateType = "Bonafied"

            if (!appliedUser.isPaid) {
                res.redirect("/bonafied")
            }
        }

        if (certificateType === "tc") {
            appliedUser = await TC.findOne({ appliedBy: user._id.toString() })

            // extra Info
            extraInfo.certificateType = "TC"

            if (!appliedUser.isPaid) {
                res.redirect("/tc")
            }
        }

        if (certificateType === "cc") {
            appliedUser = await CC.findOne({ appliedBy: user._id.toString() })

            // extra Info
            extraInfo.certificateType = "CC"

            if (!appliedUser.isPaid) {
                res.redirect("/cc")
            }
        }

        res.render("certificateReceipt", { appliedUser, user, extraInfo })

    } catch (error) {
        console.log("Error in certificateFeePayPost => ", error)
    }
}