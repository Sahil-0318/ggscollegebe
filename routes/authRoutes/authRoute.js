import express from 'express'
const authRoute = express.Router()

import { login, register, registerPost, loginPost, logout, semRegister, semRegisterPost } from '../../controllers/authControllers/authController.js'

authRoute.get('/:courseSession/register', register)
authRoute.post('/:courseSession/register', registerPost)

// student/ug-reg-25-29-admission/login
authRoute.get('/login', login)
authRoute.post('/login', loginPost)
authRoute.get('/logout', logout)

// semester 2 to 8 register routes for before 2025-2029 sessions
// student/ug-reg-24-28-admission/sem2/register

authRoute.get('/:courseSession/:semester/register', semRegister)
authRoute.post('/:courseSession/:semester/register', semRegisterPost)

export default authRoute