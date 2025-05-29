import express from "express";
const studentSem2Route = express.Router();

// Importing Student Auth Middleware
import { studentAuth } from "../../middlewares/authMiddleware.js";

// Importing Media Upload Middleware
import { upload } from "../../middlewares/mediaUploadMiddleware.js";

// Importing Controllers
import { admForm } from "../../controllers/studentControllers/sem2Controller.js";

studentSem2Route.get('/:courseSession/sem2/admForm', studentAuth, admForm)
// studentSem2Route.post('/:courseSession/sem1/admForm', studentAuth, upload.fields([ { name: 'studentPhoto', maxCount: 1 }, { name: 'studentSign', maxCount: 1 } ]), admFormPost)

// studentSem2Route.get('/:courseSession/sem1/checkoutPage/:formId', studentAuth, checkoutPage)

// studentSem2Route.post('/:courseSession/sem1/checkoutPage/:formId', studentAuth, upload.fields([ { name: 'paymentScreenshot', maxCount: 1 } ]), checkoutPagePost)

// studentSem2Route.get('/:courseSession/sem1/admFormCopy', studentAuth, admFormCopy)

// studentSem2Route.get('/:courseSession/sem1/receiptCopy', studentAuth, receiptCopy)

export default studentSem2Route
