import express from "express";
const studentSem1Route = express.Router();

// Importing Student Auth Middleware
import { studentAuth } from "../../middlewares/authMiddleware.js";

// Importing Media Upload Middleware
import { upload } from "../../middlewares/mediaUploadMiddleware.js";

// Importing Controllers
import { admForm, admFormPost, checkoutPage, checkoutPagePost, admFormCopy } from "../../controllers/studentControllers/sem1Controller.js";

studentSem1Route.get('/:courseSession/admForm', studentAuth, admForm)
studentSem1Route.post('/:courseSession/admForm', studentAuth, upload.fields([ { name: 'studentPhoto', maxCount: 1 }, { name: 'studentSign', maxCount: 1 } ]), admFormPost)

studentSem1Route.get('/:courseSession/checkoutPage/:formId', studentAuth, checkoutPage)

studentSem1Route.post('/:courseSession/checkoutPage/:formId', studentAuth, upload.fields([ { name: 'paymentScreenshot', maxCount: 1 } ]), checkoutPagePost)

studentSem1Route.get('/:courseSession/admFormCopy', studentAuth, admFormCopy)

// studentSem1Route.get('/:courseSession/receiptCopy', studentAuth, receiptCopy)

export default studentSem1Route
