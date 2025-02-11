import mongoose from 'mongoose'

const admissionFormPPSchema = mongoose.Schema({
    fullName:{
        type : String,
        required : true
    },
    rollNumber:{
        type : Number,
        required : true
    },
    session:{
        type : String,
        required : true
    },
    aadharNumber:{
        type : Number,
        required : true
    },
    dOB:{
        type : String,
        required : true
    },
    gender:{
        type : String,
        required : true
    },
    nationality:{
        type : String,
        required : true
    },
    category:{
        type : String,
        required : true
    },
    religion:{
        type : String,
        required : true
    },
    fatherName:{
        type : String,
        required : true
    },
    motherName:{
        type : String,
        required : true
    },
    parmanentAddress:{
        type : String,
        required : true
    },
    parmanentAddressPin:{
        type : Number,
        required : true
    },
    presentAddress:{
        type : String,
        required : true
    },
    presentAddressPin:{
        type : Number,
        required : true
    },
    mobileNumber:{
        type : Number,
        required : true
    },
    email: {
        type : String,
        required : true
    },
    course:{
        type : String,
        required : true
    },
    admissionPhoto: {
        type : String,
        required : true
    },
    studentSign: {
        type : String,
        required : true
    },
    appliedBy: {
        type : String,
        required : true
    },
    admNumber:{
        type : Number,
        // required : true
    },
    slipNo:{
        type : String,
        // required : true
    },
    isPaid :{
        type: Boolean,
        default: false
    },
    refNo:{
        type : String,
        default: "Not Paid"
    },
    admFee:{
        type : Number
    },
    paymentSS: {
        type : String,
        default: "NA"
    },
    paidAt: {
        type : String,
        default: "NA"
    },
}, {timestamps:true})

export default mongoose.model("AdmissionFormPP", admissionFormPPSchema)