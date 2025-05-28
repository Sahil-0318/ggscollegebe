import mongoose from 'mongoose'

const ugRegMeritList1Schema = mongoose.Schema({
    referenceNumber: {
        type: String
    },
    studentName: {
        type: String
    },
    gender: {
        type: String
    },
    dOB: {
        type: String
    },
    fatherName: {
        type: String
    },
    majorSubject: {
        type: String
    }
});

const UgRegMeritList1 = mongoose.model('ugRegMeritList1', ugRegMeritList1Schema);

export default UgRegMeritList1

