import mongoose from "mongoose";

const bonafiedSchema = mongoose.Schema({
    fullName:{
        type : String,
        required : true
    },
    sonDaughter:{
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
    collegeRollNumber:{
        type : Number,
        required : true
    },
    uniRegNumber:{
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
    course: {
        type : String,
        required : true
    },
    courseName: {
        type : String,
        required : true
    },
    honoursName: {
        type : String
    },
    partSem: {
        type : String
    },
    partSemName: {
        type : String
    },
    courseSession:{
        type : String,
        required : true
    },
    gender:{
        type : String,
        required : true
    },
    marksheetPhoto:{
        type : String,
    },
    studentPhoto:{
        type : String,
    },
    lastAdmissionReceipt:{
        type : String,
    },
    appliedBy: {
        type : String,
        required : true
    },
    isFormFilled :{
        type: Boolean,
        default: false
    },
    feeAmount:{
        type : Number,
        default: 100
    },
    paymentReceipt:{
        type : String
    },
    isPaid :{
        type: Boolean,
        default: false
    },
    paymentRefNo:{
        type : String,
        default: "NA"
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

const Bonafied = mongoose.model("bonafied", bonafiedSchema)
export default Bonafied