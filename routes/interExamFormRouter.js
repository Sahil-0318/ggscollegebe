import express from 'express'
const interExamFormRouter = express.Router()
import jwt from 'jsonwebtoken'
import multer from 'multer'

import {
    signup, signupPost, login, loginPost, logout, interExamForms, interExamFormPost, interExamFormPay, interExamFormPayPost, interExamFormReceipt, interExamFormCopy
} from '../controllers/interExamFormController.js'

const userAuth = async (req, res , next)=>{
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        req.id = verifiedUser.id
        next()
        
    } catch (error) {
        res.status(401).redirect('/interExamFormLogin')
    }
}
  
const upload = multer({
    storage: multer.memoryStorage()
})

interExamFormRouter.get('/interExamFormSignup', signup)
interExamFormRouter.post('/interExamFormSignup', signupPost)

interExamFormRouter.get('/interExamFormLogin', login)
interExamFormRouter.post('/interExamFormLogin', loginPost)

interExamFormRouter.get('/interExamFormLogout', logout)

interExamFormRouter.get('/interExamForm', userAuth, interExamForms)
interExamFormRouter.post('/interExamForm', userAuth, upload.array('studentPhoto'), interExamFormPost)

interExamFormRouter.get('/interExamFormPay', userAuth, interExamFormPay)
interExamFormRouter.post('/interExamFormPay', userAuth, upload.single('paymentSS'), interExamFormPayPost)

interExamFormRouter.get('/interExamFormReceipt', userAuth, interExamFormReceipt)
interExamFormRouter.get('/interExamFormCopy', userAuth, interExamFormCopy)


export default interExamFormRouter