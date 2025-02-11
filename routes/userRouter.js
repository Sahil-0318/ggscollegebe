import express from 'express'
import {userAuth} from '../middlewares/userMiddleware.js'
import { index, userPage, admissionForm, admissionFormPost, bbaAdmissionForm, bbaAdmissionFormPost, clc, clcPost,userNotice, eachUserNotice} from '../controllers/userController.js'
const userRouter = express.Router()
import multer from 'multer'

const storage = multer.diskStorage({})
  
const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})


userRouter.get('/', index)

userRouter.get('/userPage',userAuth, userPage)

// PP Test
userRouter.get('/admissionForm',userAuth, admissionForm)

userRouter.post('/admissionForm',userAuth, upload.array('photo'),  admissionFormPost)

// userRouter.get('/admissionFormPP',userAuth, admissionFormPP)

// userRouter.post('/admissionFormPP',userAuth, upload.array('photo'),  admissionFormPostPP)

// ================================================================================================

// userRouter.get('/ugRegularAdmissionForm',userAuth, ugRegularAdmissionForm)

// userRouter.post('/ugRegularAdmissionForm',userAuth, upload.array('studentPhoto'),  ugRegularAdmissionFormPost)

userRouter.get('/bbaAdmissionForm',userAuth, bbaAdmissionForm)

userRouter.post('/bbaAdmissionForm',userAuth, upload.array('studentPhoto'),  bbaAdmissionFormPost)

userRouter.get('/clc',userAuth, clc)

userRouter.post('/clc',userAuth, clcPost)

userRouter.get('/userNotice',userAuth, userNotice)

userRouter.get('/userNotice/:id',userAuth, eachUserNotice)

export default userRouter