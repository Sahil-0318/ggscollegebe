import express from "express";
const studentSem1Route = express.Router();

// Importing Student Auth Middleware
import { studentAuth } from "../../middlewares/authMiddleware.js";

// Importing Media Upload Middleware
import { upload } from "../../middlewares/mediaUploadMiddleware.js";

// Importing Controllers
import { admForm, admFormPost, checkoutPage, checkoutPagePost, admFormCopy, receiptCopy } from "../../controllers/studentControllers/sem1Controller.js";

studentSem1Route.get('/:courseSession/sem1/admForm', studentAuth, admForm)
studentSem1Route.post('/:courseSession/sem1/admForm', studentAuth, upload.fields([ { name: 'studentPhoto', maxCount: 1 }, { name: 'studentSign', maxCount: 1 } ]), admFormPost)

studentSem1Route.get('/:courseSession/sem1/checkoutPage/:formId', studentAuth, checkoutPage)

studentSem1Route.post('/:courseSession/sem1/checkoutPage/:formId', studentAuth, upload.fields([ { name: 'paymentScreenshot', maxCount: 1 } ]), checkoutPagePost)

studentSem1Route.get('/:courseSession/sem1/admFormCopy', studentAuth, admFormCopy)

studentSem1Route.get('/:courseSession/sem1/receiptCopy', studentAuth, receiptCopy)

export default studentSem1Route
