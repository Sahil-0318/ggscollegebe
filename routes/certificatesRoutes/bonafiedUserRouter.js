import express from 'express'
import { userAuth } from '../../middlewares/userMiddleware.js'
import {
    // clc
    clcApply, clcApplyPost,

    // bonafied
    bonafiedForm, bonafiedFormPost,

    //TC
    tcForm, tcFormPost,

    //Character Certificate
    ccForm, ccFormPost,

    //Certificate Payment Routes
    certificateFeePay, certificateFeePayPost, certificateReceipt
} from "../../controllers/certificateController/certificateUserController.js"
const bonafiedUserRouter = express.Router()
import multer from 'multer'


const upload = multer({
    storage: multer.memoryStorage()
})

// clc
bonafiedUserRouter.get('/clcApply', userAuth, clcApply)
bonafiedUserRouter.post('/clcApply', userAuth, clcApplyPost)

// bonafied
bonafiedUserRouter.get('/bonafied', userAuth, bonafiedForm)
bonafiedUserRouter.post('/bonafied', upload.array('bonafiedFormPhotos'), userAuth, bonafiedFormPost)

//TC
bonafiedUserRouter.get('/tc', userAuth, tcForm)
bonafiedUserRouter.post('/tc', upload.array('TCFormPhotos'), userAuth, tcFormPost)

//Character Certificate
bonafiedUserRouter.get('/cc', userAuth, ccForm)
bonafiedUserRouter.post('/cc', userAuth, ccFormPost)


bonafiedUserRouter.get('/certificateFee/:certificateType', userAuth, certificateFeePay)
bonafiedUserRouter.post('/certificateFeePay', upload.single('paymentSS'), userAuth, certificateFeePayPost)

bonafiedUserRouter.get('/certificateReceipt/:certificateType', userAuth, certificateReceipt)

export default bonafiedUserRouter