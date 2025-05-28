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
})

const UgRegSemAdmPortal = mongoose.model("UgRegSemAdmPortal", ugRegSemAdmPortalSchema)
export default UgRegSemAdmPortal