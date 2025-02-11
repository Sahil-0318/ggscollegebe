import express from 'express'
const apiRouter = express.Router()

import {noticeAPI} from '../controllers/apiController.js'

apiRouter.get("/notices", noticeAPI)

export default apiRouter