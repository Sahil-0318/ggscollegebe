import express from 'express'
const ugRegularSem4Router = express.Router()
import jwt from 'jsonwebtoken'
import multer from 'multer'

import {
    signup, signupPost, login, loginPost, logout, admissionForm, admissionFormPost, ugRegularSem4Pay, payPost, ugRegularSem4Receipt, admFormCopy
} from '../controllers/ugRegularSem4Controller.js'

const userAuth = async (req, res , next)=>{
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        req.id = verifiedUser.id
        next()
        
    } catch (error) {
        res.status(401).redirect('/ugRegularSem4Login')
    }
}


const storage = multer.diskStorage({})
  
const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})

ugRegularSem4Router.get('/ugRegularSem4Signup', signup)
ugRegularSem4Router.post('/ugRegularSem4Signup', signupPost)

ugRegularSem4Router.get('/ugRegularSem4Login', login)
ugRegularSem4Router.post('/ugRegularSem4Login', loginPost)

ugRegularSem4Router.get('/ugRegularSem4Logout', logout)

// ugRegularSem4Router.post('/ugRegularSem3OtpFormPost', OTPFormPost)
// ugRegularSem4Router.get('/ugRegularSem3ResendOTP/:mobNum', resendOTP)

ugRegularSem4Router.get('/ugRegularSem4AdmissionForm', userAuth, admissionForm)
ugRegularSem4Router.post('/ugRegularSem4AdmissionForm', userAuth, upload.array('studentPhoto'), admissionFormPost)

ugRegularSem4Router.get('/ugRegularSem4Pay', userAuth, ugRegularSem4Pay)
ugRegularSem4Router.post('/ugRegularSem4Pay', userAuth, upload.single('paymentSS'), payPost)

ugRegularSem4Router.get('/ugRegularSem4Receipt', userAuth, ugRegularSem4Receipt)
ugRegularSem4Router.get('/ugRegularSem4AdmFormCopy', userAuth, admFormCopy)


export default ugRegularSem4Router