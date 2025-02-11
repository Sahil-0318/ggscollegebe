import express from 'express'
const bca2Router = express.Router()
import jwt from 'jsonwebtoken'
import multer from 'multer'

import { bca2Signup, bca2SignupPost, bca2Login, bca2LoginPost, logout, bca2Form, bca2FormPost, bca2Pay, bca2PayPost, bca2Receipt, bca2AdmFormCopy } from '../controllers/bca2Controller.js'

const userAuth = async (req, res , next)=>{
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        req.id = verifiedUser.id
        next()
        
    } catch (error) {
        res.status(401).redirect('/bca2Login')
    }
}

const upload = multer({
    storage: multer.memoryStorage()
})

bca2Router.get("/bca2Signup", bca2Signup)
bca2Router.post("/bca2Signup", bca2SignupPost)

bca2Router.get("/bca2Login", bca2Login)
bca2Router.post("/bca2Login", bca2LoginPost)

bca2Router.get('/bca2Logout', logout)

bca2Router.get("/bca2Form",userAuth, bca2Form)
bca2Router.post("/bca2Form", userAuth, upload.array('studentPhoto'), bca2FormPost)

bca2Router.get("/bca2Pay",userAuth, bca2Pay)
bca2Router.post('/bca2Pay', userAuth, upload.single('paymentSS'), bca2PayPost)

bca2Router.get('/bca2Receipt', userAuth, bca2Receipt)
bca2Router.get('/bca2AdmFormCopy', userAuth, bca2AdmFormCopy)


export default bca2Router