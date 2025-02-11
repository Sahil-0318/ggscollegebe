import express from 'express'
const bca1Router = express.Router()
import jwt from 'jsonwebtoken'
import multer from 'multer'

import { bca1Signup, bca1SignupPost, bca1Login, bca1LoginPost, logout, bca1Form, bca1FormPost, bca1Pay, bca1PayPost, bca1Receipt, bca1AdmFormCopy } from "../controllers/bca1Controller.js"


const userAuth = async (req, res , next)=>{
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        req.id = verifiedUser.id
        next()
        
    } catch (error) {
        res.status(401).redirect('/bca1Login')
    }
}

const upload = multer({
    storage: multer.memoryStorage()
})

bca1Router.get("/bca1Signup", bca1Signup)
bca1Router.post("/bca1Signup", bca1SignupPost)

bca1Router.get("/bca1Login", bca1Login)
bca1Router.post("/bca1Login", bca1LoginPost)

bca1Router.get('/bca1Logout', logout)

bca1Router.get("/bca1Form", userAuth, bca1Form)
bca1Router.post("/bca1Form", userAuth, upload.array('studentPhoto'), bca1FormPost)

bca1Router.get("/bca1Pay",userAuth, bca1Pay)
bca1Router.post('/bca1Pay', userAuth, upload.single('paymentSS'), bca1PayPost)

bca1Router.get('/bca1Receipt', userAuth, bca1Receipt)
bca1Router.get('/bca1AdmFormCopy', userAuth, bca1AdmFormCopy)


export default bca1Router