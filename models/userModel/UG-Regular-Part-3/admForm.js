import mongoose from 'mongoose'

const ugRegularPart3AdmissionFormSchema = mongoose.Schema({
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
    course : {
        type : String
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
    religion:{
        type : String,
        required : true
    },
    category:{
        type : String,
        required : true
    },
    bloodGroup:{
        type : String,
        required : true
    },
    physicallyChallenged:{
        type : String,
        required : true
    },
    maritalStatus:{
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
    paper1:{
        type : String,
        required : true
    },
    paper2:{
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
        type : String
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

export default mongoose.model("ugRegularPart3AdmissionForm", ugRegularPart3AdmissionFormSchema)