import mongoose from "mongoose";

const CCSchema = mongoose.Schema({
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
    courseName: {
        type : String,
        required : true
    },
    session:{
        type : String,
        required : true
    },
    collegeRollNumber: {
        type : Number,
        required : true
    },
    appliedBy: {
        type : String,
        required : true
    },
    isFormFilled :{
        type: Boolean,
        default: false
    },
    serialNo:{
        type : Number
    },
    studentId:{
        type: String
    },
    feeAmount:{
        type : Number,
        default: 50
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
    issuedAt: {
        type : String,
        default: "NA"
    },
}, {timestamps:true})

const CC = mongoose.model("cc", CCSchema)
export default CC