import express from 'express'
const authRoute = express.Router()

import { login, register, registerPost, loginPost } from '../../controllers/authControllers/authController.js'

authRoute.get('/:courseSession/register', register)
authRoute.post('/:courseSession/register', registerPost)

// student/ug-reg-25-29-admission/login
authRoute.get('/:courseSession/login', login)
authRoute.post('/:courseSession/login', loginPost)

export default authRoute