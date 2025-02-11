import express from 'express'
const ugRegularPart3Router = express.Router()
import jwt from 'jsonwebtoken'
import multer from 'multer'

import {
    signup, signupPost, login, loginPost, logout, admissionForm, admissionFormPost, ugRegularPart3Pay, payPost, ugRegularPart3Receipt, admFormCopy
} from '../controllers/ugRegularPart3Controller.js'

const userAuth = async (req, res , next)=>{
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        req.id = verifiedUser.id
        next()
        
    } catch (error) {
        res.status(401).redirect('/ugRegularPart3Login')
    }
}
  
const upload = multer({
    storage: multer.memoryStorage()
})

ugRegularPart3Router.get('/ugRegularPart3Signup', signup)
ugRegularPart3Router.post('/ugRegularPart3Signup', signupPost)

ugRegularPart3Router.get('/ugRegularPart3Login', login)
ugRegularPart3Router.post('/ugRegularPart3Login', loginPost)

ugRegularPart3Router.get('/ugRegularPart3Logout', logout)

ugRegularPart3Router.get('/ugRegularPart3AdmissionForm', userAuth, admissionForm)
ugRegularPart3Router.post('/ugRegularPart3AdmissionForm', userAuth, upload.array('studentPhoto'), admissionFormPost)

ugRegularPart3Router.get('/ugRegularPart3Pay', userAuth, ugRegularPart3Pay)
ugRegularPart3Router.post('/ugRegularPart3Pay', userAuth, upload.single('paymentSS'), payPost)

ugRegularPart3Router.get('/ugRegularPart3Receipt', userAuth, ugRegularPart3Receipt)
ugRegularPart3Router.get('/ugRegularPart3AdmFormCopy', userAuth, admFormCopy)


export default ugRegularPart3Router