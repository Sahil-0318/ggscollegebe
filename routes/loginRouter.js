import express from 'express'
const loginRouter = express.Router()

import {
    login,
    loginPost,
    logout,
    // Main Password Recovery
    recoverPassword,
    recoverPasswordPost,
    // Portal Password Recovery
    forgotPassword,
    forgotPasswordPost
} from '../controllers/loginController.js'

loginRouter.get('/login', login)

loginRouter.post('/login', loginPost)

loginRouter.get('/logout', logout)

// Main Password Recovery
loginRouter.get('/recoverPassword', recoverPassword)

loginRouter.post('/recoverPassword', recoverPasswordPost)

// Portal Password Recovery
loginRouter.get('/forgotPassword/:portal', forgotPassword)

loginRouter.post('/forgotPassword', forgotPasswordPost)




export default loginRouter