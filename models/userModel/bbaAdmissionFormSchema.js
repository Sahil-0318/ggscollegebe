import mongoose from 'mongoose'

const bbaAdmissionFormSchema = mongoose.Schema({
    fullName:{
        type : String,
        required : true
    },
    uniRollNumber:{
        type : Number,
        required : true
    },
    uniRegNumber:{
        type : Number,
        required : true
    },
    collRollNumber:{
        type : Number,
        required : true
    },
    session:{
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
    email: {
        type : String,
        required : true
    },
    course:{
        type : String,
        required : true
    },
    twelthBoard:{
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
    address:{
        type : String,
        required : true
    },
    addressPin:{
        type : Number,
        required : true
    },
    studentPhoto: {
        type : String,
        required : true
    },
    appliedBy: {
        type : String,
        required : true
    },
    admNo:{
        type : Number
    },
    receiptNo:{
        type : String
    },
    isPaid :{
        type: Boolean,
        default: false
    },
    admDate: {
        type : String,
        default: "NA"
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
    }
    
}, {timestamps:true})

export default mongoose.model("BBAadmissionForm", bbaAdmissionFormSchema)