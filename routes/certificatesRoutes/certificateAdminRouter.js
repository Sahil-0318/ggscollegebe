import express from 'express'
const certificateAdminRouter = express.Router()
import { adminAuth } from '../../middlewares/adminMiddleware.js'

import {
    // CLC
    clclist, downloadclc, downloadCCInCLC, clcEdit, clcEditPost,
    // Character Certificate
    cclist, downloadcc, ccEdit, ccEditPost,
    // TC
    tclist, downloadtc,
    // Bonafied
    bonafiedlist, downloadbonafied
} from "../../controllers/certificateController/certificateAdminController.js"

// Character certificate
certificateAdminRouter.get("/clcListAdmin", adminAuth, clclist )
certificateAdminRouter.get("/clcListAdmin/:id", adminAuth, downloadclc )
certificateAdminRouter.get("/downloadCCInCLC/:id", adminAuth, downloadCCInCLC )
certificateAdminRouter.get("/clcEdit/:id", adminAuth, clcEdit )
certificateAdminRouter.post("/clcEdit/:id", adminAuth, clcEditPost )

// Character certificate
certificateAdminRouter.get("/cclist", adminAuth, cclist )
certificateAdminRouter.get("/cc/:id", adminAuth, downloadcc )
certificateAdminRouter.get("/ccEdit/:id", adminAuth, ccEdit )
certificateAdminRouter.post("/ccEdit/:id", adminAuth, ccEditPost )

// TC
certificateAdminRouter.get("/tclist", adminAuth, tclist )
certificateAdminRouter.get("/tc/:id", adminAuth, downloadtc )

// Bonafied
certificateAdminRouter.get("/bonafiedlist", adminAuth, bonafiedlist )
certificateAdminRouter.get("/bonafied/:id", adminAuth, downloadbonafied )


export default certificateAdminRouter