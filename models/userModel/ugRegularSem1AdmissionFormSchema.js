import mongoose from 'mongoose'

const ugRegularSem1AdmissionFormSchema = mongoose.Schema({
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
    guardianName:{
        type : String,
        required : true
    },
    referenceNumber:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    applicantId:{
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
    familyAnnualIncome:{
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
    whatsAppNumber:{
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
    paper3:{
        type : String,
        required : true
    },
    paper4:{
        type : String,
        required : true
    },
    paper5:{
        type : String,
        required : true
    },
    paper6:{
        type : String,
        required : true
    },
    examName:{
        type : String,
        required : true
    },
    examBoard:{
        type : String,
        required : true
    },
    examYear:{
        type : Number,
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
    ppuConfidentialNumber :{
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
        default : "2024-28"
    },
    paymentSS :{
        type : String
    },
    receiptNo :{
        type : String
    },
    collegeRollNo :{
        type : String
    },
    isVerified : {
        type : Boolean,
        default : false
    }
    
})

export default mongoose.model("ugRegularSem1AdmissionForm", ugRegularSem1AdmissionFormSchema)