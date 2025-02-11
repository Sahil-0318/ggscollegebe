import express from 'express'
const bca3Router = express.Router()
import jwt from 'jsonwebtoken'
import multer from 'multer'

import {bca3Form, bca3FormPost, bca3Signup, bca3SignupPost, bca3Login, bca3LoginPost, logout, bca3OTP, bca3ResendOTP, bca3Pay, bca3PayPost, bca3Receipt, bca3AdmFormCopy} from '../controllers/bca3Controller.js'

const userAuth = async (req, res , next)=>{
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        req.id = verifiedUser.id
        next()
        
    } catch (error) {
        res.status(401).redirect('/bca3Login')
    }
}

const storage = multer.diskStorage({})
  
const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})

bca3Router.get("/bca3Signup", bca3Signup)
bca3Router.post("/bca3Signup", bca3SignupPost)

bca3Router.get("/bca3Login", bca3Login)
bca3Router.post("/bca3Login", bca3LoginPost)

bca3Router.get('/bca3Logout', logout)

bca3Router.post('/bca3OTP', bca3OTP)
bca3Router.get('/bca3ResendOTP/:mobNum', bca3ResendOTP)

bca3Router.get("/bca3Form",userAuth, bca3Form)
bca3Router.post("/bca3Form", userAuth, upload.array('studentPhoto'), bca3FormPost)

bca3Router.get("/bca3Pay",userAuth, bca3Pay)
bca3Router.post('/bca3Pay', userAuth, upload.single('paymentSS'), bca3PayPost)

bca3Router.get('/bca3Receipt', userAuth, bca3Receipt)
bca3Router.get('/bca3AdmFormCopy', userAuth, bca3AdmFormCopy)


export default bca3Router