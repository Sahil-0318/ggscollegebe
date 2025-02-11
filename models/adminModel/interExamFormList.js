import mongoose from 'mongoose'

const interExamFormListSchema = mongoose.Schema({
    registrationNumber: {
        type: String
    },
    fullName: {
        type: String
    },
    fatherName: {
        type: String
    },
    faculty: {
        type: String
    },
    studentType: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    userID: {
        type: String
    },
    password: {
        type: String
    },
    registered: {
        type: Boolean,
        default: false
    }
}, { strict: false });

const InterExamFormList = mongoose.model('Data25', interExamFormListSchema, 'interexamformlists' );
export default InterExamFormList

