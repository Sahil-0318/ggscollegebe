import mongoose from "mongoose";

const miscellaneousFeeSchema = mongoose.Schema({
    fullName:{
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
    courseName: {
        type : String,
        required : true
    },
    isFormFilled :{
        type: Boolean,
        default: false
    },
    appliedBy: {
        type : String,
        required : true
    },

    // marksheet
    marksheetFeeAmount:{
        type : Number,
        default: 100
    },
    marksheetReceiptNo:{
        type : String
    },
    isMarksheetPaid :{
        type: Boolean,
        default: false
    },
    marksheetPaymentRefNo:{
        type : String,
        default: "NA"
    },
    marksheetPaymentSS: {
        type : String,
        default: "NA"
    },
    marksheetPaymentDate: {
        type : String,
        default: "NA"
    },

    // Original Passing Certificate(Inter)  (OPCI)
    opciFeeAmount:{
        type : Number,
        default: 50
    },
    opciReceiptNo:{
        type : String
    },
    isOpciPaid :{
        type: Boolean,
        default: false
    },
    opciPaymentRefNo:{
        type : String,
        default: "NA"
    },
    opciPaymentSS: {
        type : String,
        default: "NA"
    },
    opciPaymentDate: {
        type : String,
        default: "NA"
    },

    // Forwading (Degree / Migration) (FDM)
    fdmFeeAmount:{
        type : Number,
        default: 100
    },
    fdmReceiptNo:{
        type : String
    },
    isFdmPaid :{
        type: Boolean,
        default: false
    },
    fdmPaymentRefNo:{
        type : String,
        default: "NA"
    },
    fdmPaymentSS: {
        type : String,
        default: "NA"
    },
    fdmPaymentDate: {
        type : String,
        default: "NA"
    },

    // Registration Forwading (RF)
    rfFeeAmount:{
        type : Number,
        default: 200
    },
    rfReceiptNo:{
        type : String
    },
    isRfPaid :{
        type: Boolean,
        default: false
    },
    rfPaymentRefNo:{
        type : String,
        default: "NA"
    },
    rfPaymentSS: {
        type : String,
        default: "NA"
    },
    rfPaymentDate: {
        type : String,
        default: "NA"
    },

    // Document verification (Private) (DVP)
    dvpFeeAmount:{
        type : Number,
        default: 200
    },
    dvpReceiptNo:{
        type : String
    },
    isDvpPaid :{
        type: Boolean,
        default: false
    },
    dvpPaymentRefNo:{
        type : String,
        default: "NA"
    },
    dvpPaymentSS: {
        type : String,
        default: "NA"
    },
    dvpPaymentDate: {
        type : String,
        default: "NA"
    },

    // Miscellaneous
    miscellaneousFeeAmount:{
        type : Number,
        default: 100
    },
    miscellaneousReceiptNo:{
        type : String
    },
    isMiscellaneousPaid :{
        type: Boolean,
        default: false
    },
    miscellaneousPaymentRefNo:{
        type : String,
        default: "NA"
    },
    miscellaneousPaymentSS: {
        type : String,
        default: "NA"
    },
    miscellaneousPaymentDate: {
        type : String,
        default: "NA"
    },
})

const MiscellaneousFee = mongoose.model("miscellaneousFee", miscellaneousFeeSchema)
export default MiscellaneousFee