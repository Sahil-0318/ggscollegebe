import express from 'express'
const adminDashboardRoute = express.Router()

// Importing Admin Auth Middleware
import { adminAuth } from '../../middlewares/authMiddleware.js'

// Importing Controllers
import { adminDashboard } from '../../controllers/adminControllers/dashboardController.js'

adminDashboardRoute.get('/dashboard', adminAuth, adminDashboard)

export default adminDashboardRoute