import express from 'express'
const paymentRouter = express.Router()
import {userAuth} from '../middlewares/userMiddleware.js'
import multer from 'multer'

import {
    payment,
    paymentInvoice,
    checkoutPage,
    paymentStatus,
    paymentCourseId,
    payRefNoForm,
    receiptCourseId,
    refNoPost,
    getSlipPost,
    paymentCertificateId,
    certificatePayRefNoForm,
    receiptCertificateId
} from '../controllers/paymentController.js'

const storage = multer.diskStorage({})
  
const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})

// paymentRouter.get('/payment', payment)
paymentRouter.post('/payment', payment)
paymentRouter.get('/redirect-url/:merchantTransactionId', paymentInvoice)
paymentRouter.get('/checkoutPage',userAuth, checkoutPage)
paymentRouter.get('/paymentStatus', paymentStatus)
paymentRouter.get('/payment/:course/:id',userAuth, paymentCourseId)
paymentRouter.post('/payRefNoForm',userAuth, upload.single('paymentSS'), payRefNoForm)
paymentRouter.get('/receipt/:course/:id',userAuth, receiptCourseId)
paymentRouter.post('/refNo',userAuth, upload.single('paymentSS'), refNoPost)
paymentRouter.post('/getSlip',userAuth, getSlipPost)
paymentRouter.get('/payment/certificates/:certificate/:id',userAuth, paymentCertificateId)
paymentRouter.post('/certificatePayRefNoForm',userAuth, upload.single('paymentSS'), certificatePayRefNoForm)
paymentRouter.get('/certificateReceipt/:certificate/:id',userAuth, receiptCertificateId)




export default paymentRouter