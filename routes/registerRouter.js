import express from 'express'
const registerRouter = express.Router()

import {
    register,
    registerPost
} from '../controllers/registerController.js'

registerRouter.get('/register', register)

registerRouter.post('/register', registerPost)


export default registerRouter