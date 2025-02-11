import mongoose from "mongoose";

const tcSchema = mongoose.Schema({
    fullName:{
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
    aadharNumber:{
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
    dOB:{
        type : String,
        required : true
    },
    session:{
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
    collegeClass: {
        type : String,
        required : true
    },
    lastPassedClass: {
        type : String,
        required : true
    },
    collegeRollNumber:{
        type : Number,
        required : true
    },
    collegeFrom:{
        type : Number,
        required : true
    },
    collegeTo:{
        type : Number,
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
        default: 600
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

const TC = mongoose.model("tc", tcSchema)
export default TC