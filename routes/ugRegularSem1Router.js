import express from 'express'
const ugRegularSem1Router = express.Router()
import jwt from 'jsonwebtoken'
import multer from 'multer'

import {
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
} from '../controllers/ugRegularSem1Controller.js'

const userAuth = async (req, res , next)=>{
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        req.id = verifiedUser.id
        next()
        
    } catch (error) {
        res.status(401).redirect('ug-regular-sem-1-login')
    }
}


const storage = multer.diskStorage({})
  
const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})

ugRegularSem1Router.get('/ug-regular-sem-1', ugRegularSem1)
ugRegularSem1Router.post('/ug-regular-sem-1', ugRegularSem1Post)
ugRegularSem1Router.get('/ug-regular-sem-1-login', ugRegularSem1Login)
ugRegularSem1Router.post('/ug-regular-sem-1-login', ugRegularSem1LoginPost)
ugRegularSem1Router.get('/ug-regular-sem-1-logout', ugRegularSem1Logout)
ugRegularSem1Router.post('/otpForm', otpForm)
ugRegularSem1Router.get('/resendOTP/:mobNum', resendOTP)
ugRegularSem1Router.get('/ug-reg-adm-form', userAuth, ugRegularSem1AdmForm)
ugRegularSem1Router.post('/ug-reg-adm-form', userAuth, upload.array('studentPhoto'), ugRegularSem1AdmFormPost)
ugRegularSem1Router.get('/ug-reg-sen-1-pay', userAuth, ugRegularSem1Pay)
ugRegularSem1Router.post('/ugRegularSem1PayPage', userAuth, upload.single('paymentSS'), ugRegularSem1PayPage)
ugRegularSem1Router.get('/ugRegularSem1Receipt', userAuth, ugRegularSem1Receipt)
ugRegularSem1Router.get('/ugRegularSem1ExamForm', userAuth, ugRegularSem1ExamForm)


export default ugRegularSem1Router