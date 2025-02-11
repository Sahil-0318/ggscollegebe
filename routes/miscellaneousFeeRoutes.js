import express from 'express'
import { userAuth } from '../middlewares/userMiddleware.js'
import { 
    // Marksheet
    marksheet,
    opci,
    fdm,
    rf,
    dvp,
    miscellaneous,
    miscellaneousFormPost,
    miscellaneousFeePayment,
    miscellaneousFeePaymentPost,
    miscellaneousReceipt
 } from '../controllers/miscellaneousFeeController.js'
const miscellaneousFeeRouter = express.Router()
import multer from 'multer'


const upload = multer({
    storage: multer.memoryStorage()
})

// marksheet
miscellaneousFeeRouter.get('/miscellaneousFee/marksheet', userAuth, marksheet)

miscellaneousFeeRouter.get('/miscellaneousFee/original-passing-certificate-inter', userAuth, opci)

miscellaneousFeeRouter.get('/miscellaneousFee/forwading-degree-migration', userAuth, fdm)

miscellaneousFeeRouter.get('/miscellaneousFee/registration-forwading', userAuth, rf)

miscellaneousFeeRouter.get('/miscellaneousFee/document-verification-private', userAuth, dvp)

miscellaneousFeeRouter.get('/miscellaneousFee/miscellaneous', userAuth, miscellaneous)

miscellaneousFeeRouter.post('/miscellaneousFee/:formType', userAuth, miscellaneousFormPost)

miscellaneousFeeRouter.get('/miscellaneousFeePayment/:formType', userAuth, miscellaneousFeePayment)

miscellaneousFeeRouter.post('/miscellaneousFeePayment', upload.single('paymentSS'), userAuth, miscellaneousFeePaymentPost)

miscellaneousFeeRouter.get('/miscellaneousReceipt/:formType', userAuth, miscellaneousReceipt)


export default miscellaneousFeeRouter