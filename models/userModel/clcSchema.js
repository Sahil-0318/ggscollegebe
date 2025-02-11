import mongoose from 'mongoose'


const clcSchema = new mongoose.Schema({
    fullName:{
        type : String,
        required : true
    },
    fatherName: {
        type : String,
        required : true,
    },
    motherName: {
        type : String,
        required : true,
    },
    aadharNumber: {
        type : Number,
        required : true,
    },
    parmanentAddress: {
        type : String,
        required : true,
    },
    dOB: {
        type : String,
        required : true,
    },
    course: {
        type : String,
        required : true,
    },
    session: {
        type : String,
        required : true,
    },
    dOAdm: {
        type : String,
        required : true,
    },
    classRollNumber: {
        type : Number,
        required : true,
    },
    yearOfExam: {
        type : String,
        required : true
    },
    resultDivision:{
        type : String,
        required : true,
    },
    regNumber :{
        type: String,
        default: false
    },
    uniRollNumber: {
        type : String,
        required : true
    },
    remark:{
        type: String,
        default: 'Good'
    },
    serialNo:{
        type : Number
    },
    studentId:{
        type: String
    },
    dOfLC:{
        type: String
    },
    isPaid :{
        type: Boolean,
        default: false
    },
    isIssued :{
        type: Boolean,
        default: false
    },
    isCharIssued :{
        type: Boolean,
        default: false
    },
    clcFee:{
        type: Number
    },
    paymentSS: {
        type : String,
        default: "NA"
    },
    refNo:{
        type : String,
        default: "Not Paid"
    },
    clcFeePayDate: {
        type : String,
        default: "NA"
    },
    dOLC: {
        type : String,
        default: "NA"
    },
    dOCC: {
        type : String,
        default: "NA"
    },
    certificateType:{
        type: String,
        default: 'clc'
    },
    status:{
        type: String,
        default: "N/A"
    },
    appliedBy: {
        type : String,
        required : true
    }
}, {timestamps:true})

export default mongoose.model("Clc", clcSchema)
