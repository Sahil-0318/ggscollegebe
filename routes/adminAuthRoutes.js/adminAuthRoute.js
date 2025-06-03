import express from 'express'
const adminAuthRoute = express.Router()

import { adminLogin, adminLoginPost, adminLogout } from '../../controllers/adminAuthControllers/adminAuthController.js'

adminAuthRoute.get('/login', adminLogin)
adminAuthRoute.post('/login', adminLoginPost)

adminAuthRoute.get('/logout', adminLogout)

export default adminAuthRoute