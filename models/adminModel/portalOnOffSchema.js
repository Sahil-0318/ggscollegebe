import mongoose from "mongoose";

const portalOnOffSchema = mongoose.Schema({
    portal : {
        type : String
    },
    isOn : {
        type : Boolean,
        default : true
    }
})

const PortalOnOff = mongoose.model("portalOnOff", portalOnOffSchema)
export default PortalOnOff