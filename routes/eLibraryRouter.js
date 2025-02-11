import express from "express"
import { allBook, book } from "../controllers/eLibraryController.js"
import {userAuth} from '../middlewares/userMiddleware.js'

const eLibraryRouter = express.Router()

eLibraryRouter.get("/books", userAuth, allBook)
eLibraryRouter.get('/books/:filename',  userAuth, book)


export default eLibraryRouter