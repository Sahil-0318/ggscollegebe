import mongoose from "mongoose";
const ugRegSemAdmPortalSchema = mongoose.Schema({
    session: {
        type: String
    },
    sem1: {
        type: Boolean
    },
    sem2: {
        type: Boolean
    },
    sem3: {
        type: Boolean
    },
    sem4: {
        type: Boolean
    },
    sem5: {
        type: Boolean
    },
    sem6: {
        type: Boolean
    },
    sem7: {
        type: Boolean
    },
    sem8: {
        type: Boolean
    },
    sem1Detail: {
        type: Boolean
    },
    sem2Detail: {
        type: Boolean
    },
    sem3Detail: {
        type: Boolean
    },
    sem4Detail: {
        type: Boolean
    },
    sem5Detail: {
        type: Boolean
    },
    sem6Detail: {
        type: Boolean
    },
    sem7Detail: {
        type: Boolean
    },
    sem8Detail: {
        type: Boolean
    },
})

const UgRegSemAdmPortal = mongoose.model("UgRegSemAdmPortal", ugRegSemAdmPortalSchema)
export default UgRegSemAdmPortal