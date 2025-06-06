import express from 'express'
const noticeAPIRoute = express.Router()

// Importing Controllers
import { notices, newsNotices, examNotices, admissionNotices } from '../../controllers/noticeControllers/noticeAPIController.js'

noticeAPIRoute.get('/notices', notices)
noticeAPIRoute.get('/notices/news', newsNotices)
noticeAPIRoute.get('/notices/exam', examNotices)
noticeAPIRoute.get('/notices/admission', admissionNotices)

export default noticeAPIRoute