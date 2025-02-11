const PHONE_PAY_HOST_URL = process.env.PHONE_PAY_HOST_URL
const MERCHANT_ID = process.env.MERCHANT_ID
const SALT_INDEX = process.env.SALT_INDEX
const SALT_KEY = process.env.SALT_KEY
import axios from 'axios'
import uniqid from 'uniqid'
import sha256 from 'sha256'
import AdmissionForm from '../models/userModel/admissionFormSchema.js'
import AdmissionFormPP from '../models/userModel/admissionFormSchemaPP.js'
import UgRegularAdmissionForm from '../models/userModel/ugRegularAdmissionFormSchema.js'
import BBAadmissionForm from '../models/userModel/bbaAdmissionFormSchema.js'
import User from '../models/userModel/userSchema.js'
import FileUpload from '../fileUpload/fileUpload.js'
import qrcode from 'qrcode'
import clcSchema from '../models/userModel/clcSchema.js'




const payment = (req, res) => {
    // let obj = {
    //     PHONE_PAY_HOST_URL,
    //     MERCHANT_ID,
    //     SALT_INDEX,
    //     SALT_KEY
    // }
    // res.send(obj)
    //=======================================
    const {fullName, category, amount, mobileNumber}= req.body
    console.log("In Payment Post Route line 22", fullName, category, amount, mobileNumber)

    const payEndpoint = "/pg/v1/pay"
    const merchantTransactionId = uniqid()
    const userId = uniqid()

    const payload = {
        "merchantId": MERCHANT_ID,
        "merchantTransactionId": merchantTransactionId,
        "merchantUserId": userId,
        "amount":amount * 100,
        "redirectUrl": `http://localhost:5001/redirect-url/${merchantTransactionId}`,
        // "redirectUrl": 'https://webhook.site/redirect-url',
        "redirectMode": "REDIRECT",
        "mobileNumber": mobileNumber,
        "paymentInstrument": {
            "type": "PAY_PAGE"
        }
    }
    const bufferObj = Buffer.from(JSON.stringify(payload), "utf-8")
    const base64EncodedPayload = bufferObj.toString("base64")
    const xVerify = sha256(base64EncodedPayload + payEndpoint + SALT_KEY) + "###" + SALT_INDEX


    const options = {
        method: 'post',
        url: `${PHONE_PAY_HOST_URL}${payEndpoint}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': xVerify
        },
        data: {
            "request": base64EncodedPayload,
        }
    };
    axios
        .request(options)
        .then(function (response) {
            console.log(response.data);
            const url = response.data.data.instrumentResponse.redirectInfo.url
            res.status(200).redirect(url)
        })
        .catch(function (error) {
            console.error(error);
        });


}

const paymentInvoice = (req, res) => {
    const { merchantTransactionId } = req.params
    // console.log('merchantTransactionId', merchantTransactionId);
    if (merchantTransactionId) {
        const xVerify = sha256(`/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY) + "###" + SALT_INDEX
        const options = {
            method: 'get',
            url: `${PHONE_PAY_HOST_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                "X-MERCHANT-ID": merchantTransactionId,
                "X-VERIFY": xVerify
            },

        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                if (response.data.success) {
                    let paymentStatus = response.data
                    res.render("paymentStatus", {paymentStatus})
                    
                } else {
                    
                }
            })
            .catch(function (error) {
                console.error(error);
            });

        // res.send(merchantTransactionId)
    } else {
        res.send(error, 'Error')

    }

}

const checkoutPage = async (req, res) => {
    try {
        res.render("checkoutPage")
    } catch (error) {
        console.log(error)
    }
}

const paymentStatus = async (req, res) => {
    try {
        res.render("paymentStatus")
    } catch (error) {
        console.log(error)
    }
}

let fee = 0
const refNoPost = async (req, res) => {
    const { refNo } = req.body
    console.log("ref No. ", refNo);

    const user = await User.findOne({ _id: req.id })
    // console.log(user);

    const photoUpload = await FileUpload(req.file.path)
    const paymentSSURL = photoUpload.secure_url
    // console.log(paymentSSURL);
    const paidAt = photoUpload.created_at.slice(0, 10)

    await AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL } })
    await AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paidAt } })
    await AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { refNo: refNo } })

    const appliedUser = await AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { isPaid: "true" } })

    if (appliedUser.category === "General" || appliedUser.category === "BC-2") {
        fee = 3000
    } else {
        fee = 2830
    }
    return res.render('slip', { user, appliedUser, "fee": fee })

}

const getSlipPost = async (req, res) => {
    const user = await User.findOne({ _id: req.id })
    const appliedUser = await AdmissionForm.findOne({ appliedBy: user._id.toString() })

    if (appliedUser.category === "General" || appliedUser.category === "BC-2") {
        fee = 3000
    } else {
        fee = 2830
    }
    return res.render('slip', { user, appliedUser, "fee": fee })
}


const paymentCourseId = async (req, res) => {
    const { course, id } = req.params
    const user = await User.findOne({ _id: req.id })
    if (course === 'BBA') {
        const appliedUser = await BBAadmissionForm.findOne({ appliedBy: id })

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

    if (course === 'B.A' || course === 'B.Com' || course === 'B.Sc') {
        const appliedUser = await UgRegularAdmissionForm.findOne({ appliedBy: id })

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

}


const payRefNoForm = async (req, res) => {
    const { refNo, formCourse, formAppliedBy } = req.body

    const user = await User.findOne({ _id: req.id })
    // console.log(user);

    const photoUpload = await FileUpload(req.file.path)
    const paymentSSURL = photoUpload.secure_url
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
    const year = currentDate.getFullYear();
    const admDate = `${day}-${month}-${year}`

    if (formCourse === 'BBA') {
        await BBAadmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL } })
        await BBAadmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { admDate } })
        await BBAadmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { refNo } })
        const appliedUser = await BBAadmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { isPaid: "true" } })
        return res.render('receipt', { user, appliedUser })
    }

    if (formCourse === 'B.A' || formCourse === 'B.Com' || formCourse === 'B.Sc') {
        await UgRegularAdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL } })
        await UgRegularAdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { admDate } })
        await UgRegularAdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { refNo } })
        const appliedUser = await UgRegularAdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { isPaid: "true" } })
        return res.render('receipt', { user, appliedUser })
    }
}

const receiptCourseId = async (req, res) => {
    const { course, id } = req.params
    const user = await User.findOne({ _id: req.id })
    let appliedUser = ""
    if (course === 'BBA') {
        appliedUser = await BBAadmissionForm.findOne({ appliedBy: user._id.toString() })
    }

    if (course === 'B.A' || course === 'B.Com' || course === 'B.Sc') {
        appliedUser = await UgRegularAdmissionForm.findOne({ appliedBy: user._id.toString() })
    }

    return res.render('receipt', { user, appliedUser })

}

const paymentCertificateId = async (req, res) => {
    const { certificate, id } = req.params
    const user = await User.findOne({ _id: req.id })


    if (certificate === "clc") {
        const appliedUser = await clcSchema.findOne({ appliedBy: id })

        qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=600&tn=${appliedUser.fullName}`, function (err, src) {
            res.status(201).render('certificatePayPage', { "qrcodeUrl": src, user, appliedUser })
        })
    }

}

const certificatePayRefNoForm = async (req, res) => {
    const { refNo, formCertificate, formAppliedBy } = req.body

    const user = await User.findOne({ _id: req.id })
    // console.log(user);

    const photoUpload = await FileUpload(req.file.path)
    // console.log(photoUpload);

    const paymentSSURL = photoUpload.secure_url
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
    const year = currentDate.getFullYear();
    const clcFeePayDate = `${day}-${month}-${year}`

    if (formCertificate === 'clc') {
        await clcSchema.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL } })
        await clcSchema.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { clcFeePayDate } })
        await clcSchema.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { refNo } })
        const appliedUser = await clcSchema.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { isPaid: "true" } })
        return res.render('clcReceipt', { user, appliedUser })
    }

}

const receiptCertificateId = async (req, res) => {
    const { certificate, id } = req.params

    const user = await User.findOne({ _id: req.id })
    let appliedUser = ""
    if (certificate === 'clc') {
        appliedUser = await clcSchema.findOne({ appliedBy: id })
        return res.render('clcReceipt', { user, appliedUser })
    }

}

export {
    payment,
    paymentInvoice,
    checkoutPage,
    paymentStatus,
    paymentCourseId,
    payRefNoForm,
    receiptCourseId,
    refNoPost,
    getSlipPost,
    paymentCertificateId,
    certificatePayRefNoForm,
    receiptCertificateId
}