import express from "express";
const ugReg25_29AdminRoute = express.Router()

// Importing Student Auth Middleware
import { adminAuth } from "../../middlewares/authMiddleware.js";

// Importing Controllers
import { ugRegAdmissionList, studentDetail, studentDetailUpdate } from "../../controllers/ugRegAdmAdminControllers/ugRegAdmListController.js";

// Ex- /admin/ug-reg-25-29-admission-list
ugReg25_29AdminRoute.get('/:courseSession', adminAuth, ugRegAdmissionList)

ugReg25_29AdminRoute.get('/:courseSession/student-detail/:studentId', adminAuth, studentDetail)

ugReg25_29AdminRoute.get('/:courseSession/student-detail-update/:studentId', adminAuth, studentDetailUpdate)
ugReg25_29AdminRoute.post('/:courseSession/student-detail-update/:studentId', adminAuth, studentDetailUpdate)

export default ugReg25_29AdminRoute