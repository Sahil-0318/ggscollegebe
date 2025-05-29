import express from 'express'
const recoverCredentialRoute = express.Router()

import { recoverCredential, recoverCredentialPost } from '../../controllers/authControllers/recoverCredentialController.js'

recoverCredentialRoute.get('/:course/recoverCredential', recoverCredential )
recoverCredentialRoute.post('/:course/recoverCredential', recoverCredentialPost )

export default recoverCredentialRoute