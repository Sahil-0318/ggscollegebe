import express from 'express'
const userDashboardRoute = express.Router()

// Importing Student Auth Middleware
import { studentAuth } from '../../middlewares/authMiddleware.js'

// Importing Controllers
import { dashboard } from '../../controllers/studentControllers/dashboardController.js'

userDashboardRoute.get('/:courseSession/dashboard', studentAuth, dashboard)

export default userDashboardRoute