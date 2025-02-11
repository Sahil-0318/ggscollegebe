import mongoose from 'mongoose'

const ugRegularSem1AdmissionPortalSchema = mongoose.Schema({
    course:{
        type : String,
        required : true
    },
    referenceNumber:{
        type : String,
        required : true
    },
    mobileNumber :{
        type : Number,
        required : true
    },
    userId : {
        type : String,
        required : true
    },
    password: {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    },
    isPaid:{
        type : Boolean,
        default : false
    }
    
})

export default mongoose.model("ugRegularSem1AdmissionPortal", ugRegularSem1AdmissionPortalSchema)