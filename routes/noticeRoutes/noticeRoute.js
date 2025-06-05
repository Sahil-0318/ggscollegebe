import express from 'express'
const noticeRoute = express.Router()

// Importing Admin Auth Middleware
import { adminAuth } from '../../middlewares/authMiddleware.js'

// Importing Controllers
import { notice, noticePost } from '../../controllers/noticeControllers/noticeController.js'

// Importing Media Upload Middleware
import { upload } from "../../middlewares/mediaUploadMiddleware.js";

noticeRoute.get('/notice', adminAuth, notice)
noticeRoute.post('/notice', upload.fields([ { name: 'noticeMedia', maxCount: 1 } ]), adminAuth, noticePost)

export default noticeRoute