import mongoose from 'mongoose'

const interExamFormSchema = mongoose.Schema({
    registrationNoAndYear:{
        type : String,
        required : true
    },
    BSEBUniqueId:{
        type : String,
        required : true
    },
    studentCategory:{
        type : String,
        required : true
    },
    collegeCode :{
        type : Number,
        required : true
    },
    collegeName :{
        type : String,
        required : true
    },
    districtName :{
        type : String,
        required : true
    },
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
    dOB:{
        type : String,
        required : true
    },
    matricPassingBoardName:{
        type : String,
        required : true
    },
    matricBoardRollCode:{
        type : String,
        required : true
    },
    matricBoardRollNumber:{
        type : String,
        required : true
    },
    matricBoardPassingYear:{
        type : Number,
        required : true
    },
    gender:{
        type : String,
        required : true
    },
    casteCategory:{
        type : String,
        required : true
    },
    differentlyAbled:{
        type : String,
        required : true
    },
    nationality:{
        type : String,
        required : true
    },
    religion:{
        type : String,
        required : true
    },
    aadharNumber:{
        type : Number,
        required : true
    },
    qualifyingCategoryRollCode:{
        type : String,
    },
    qualifyingCategoryRollNumber:{
        type : String,
    },
    qualifyingCategoryPassingYear:{
        type : Number,
    },
    qualifyingCategoryInstitutionArea:{
        type : String,
    },
    qualifyingCategoryInstitutionSubDivision:{
        type : String,
    },
    qualifyingCategoryMobileNumber:{
        type : Number,
    },
    qualifyingCategoryEmail:{
        type : String,
    },
    qualifyingCategoryStudentName:{
        type : String,
    },
    qualifyingCategoryFatherName:{
        type : String,
    },
    qualifyingCategoryMotherName:{
        type : String,
    },
    qualifyingCategoryAddress:{
        type : String,
    },
    qualifyingCategoryMaritalStatus:{
        type : String,
    },
    qualifyingCategoryStudentBankAccountNumber:{
        type : String,
        default : "N/A"
    },
    qualifyingCategoryIFSCCode:{
        type : String,
        default : "N/A"
    },
    qualifyingCategoryBankAndBranchName:{
        type : String,
        default : "N/A"
    },
    qualifyingCategoryTwoIdentificationMarks:{
        type : String,
    },
    qualifyingCategoryMediumOfExam:{
        type : String,
    },
    compulsorySubject1:{
        type : String,
        required : true
    },
    compulsorySubject2:{
        type : String,
        required : true
    },
    electiveSubject1:{
        type : String,
        required : true
    },
    electiveSubject2:{
        type : String,
        required : true
    },
    electiveSubject3:{
        type : String,
        required : true
    },
    additionalSubject:{
        type : String,
        default : "NA"
    },
    faculty:{
        type : String,
    },
    studentPhoto: {
        type : String,
        required : true
    },
    studentSign: {
        type : String,
        required : true
    },
    isFormFilled: {
        type : Boolean,
        default : false
    },
    appliedBy: {
        type : String,
        required : true
    },
    examFee : {
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
        default : "2023-25"
    },
    paymentSS :{
        type : String
    },
    receiptNo :{
        type : String
    }
    
})

const interExamForm = mongoose.model("interExamForm", interExamFormSchema)
export default interExamForm