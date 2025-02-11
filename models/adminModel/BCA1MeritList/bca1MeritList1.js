import mongoose from 'mongoose'

const DataSchema1 = mongoose.Schema({
    appNo: {
        type: String
    },
    candidateName: {
        type: String
    },
    fatherName: {
        type: String
    },
    mobileNo: {
        type: Number
    },
    email: {
        type: String
    },
    gender: {
        type: String
    },
    dOB: {
        type: String
    }
}, { strict: false });

const bca1MeritList1 = mongoose.model('Data1', DataSchema1, 'bca1MeritList1');
export default bca1MeritList1

