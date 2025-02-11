// import bca3UserModel from "./user.js";
import mongoose from "mongoose";

const bca3FormSchema = mongoose.Schema({
    studentName:{
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
    uniRegNumber:{
        type : String,
        required : true
    },
    uniRollNumber:{
        type : String,
        required : true
    },
    collegeRollNumber:{
        type : String,
        required : true
    },
    email:{
        type : String,
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
    category:{
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
    address:{
        type : String,
        required : true
    },
    district:{
        type : String,
        required : true
    },
    policeStation:{
        type : String,
        required : true
    },
    state:{
        type : String,
        required : true
    },
    pinCode:{
        type : Number,
        required : true
    },
    subject:{
        type : String,
        required : true
    },
    examResult:{
        type : String,
        required : true
    },
    obtMarks:{
        type : String,
        required : true
    },
    fullMarks:{
        type : String,
        required : true
    },
    obtPercent:{
        type : String,
        required : true
    },
    studentPhoto: {
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
    admissionFee : {
        type : Number,
        default : 15500
    },
    isPaid :{
        type : Boolean,
        default : false
    },
    paymentId :{
        type : Number
    },
    dateAndTimeOfPayment : {
        type : String
    },
    session :{
        type : String,
        default : "2022-25"
    },
    paymentSS :{
        type : String
    },
    receiptNo :{
        type : String
    },
    isVerified : {
        type : Boolean,
        default : false
    }
    
})
const bca3FormModel = mongoose.model("bca3FormModel", bca3FormSchema)
export default bca3FormModel