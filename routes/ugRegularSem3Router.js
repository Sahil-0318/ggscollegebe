import express from 'express'
const ugRegularSem3Router = express.Router()
import jwt from 'jsonwebtoken'
import multer from 'multer'

import {
    signup, signupPost, login, loginPost, logout, OTPFormPost, resendOTP, admissionForm, admissionFormPost, ugRegularSem3Pay, payPost, ugRegularSem3Receipt, admFormCopy
} from '../controllers/ugRegularSem3Controller.js'

const userAuth = async (req, res , next)=>{
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        req.id = verifiedUser.id
        next()
        
    } catch (error) {
        res.status(401).redirect('/ugRegularSem3Login')
    }
}


const storage = multer.diskStorage({})
  
const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})

ugRegularSem3Router.get('/ugRegularSem3Signup', signup)
ugRegularSem3Router.post('/ugRegularSem3Signup', signupPost)

ugRegularSem3Router.get('/ugRegularSem3Login', login)
ugRegularSem3Router.post('/ugRegularSem3Login', loginPost)

ugRegularSem3Router.get('/ugRegularSem3Logout', logout)

ugRegularSem3Router.post('/ugRegularSem3OtpFormPost', OTPFormPost)
ugRegularSem3Router.get('/ugRegularSem3ResendOTP/:mobNum', resendOTP)

ugRegularSem3Router.get('/ugRegularSem3AdmissionForm', userAuth, admissionForm)
ugRegularSem3Router.post('/ugRegularSem3AdmissionForm', userAuth, upload.array('studentPhoto'), admissionFormPost)

ugRegularSem3Router.get('/ugRegularSem3Pay', userAuth, ugRegularSem3Pay)
ugRegularSem3Router.post('/ugRegularSem3Pay', userAuth, upload.single('paymentSS'), payPost)

ugRegularSem3Router.get('/ugRegularSem3Receipt', userAuth, ugRegularSem3Receipt)
ugRegularSem3Router.get('/ugRegularSem3AdmFormCopy', userAuth, admFormCopy)


export default ugRegularSem3Router