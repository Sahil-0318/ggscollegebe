import mongoose from 'mongoose'

const DataSchema4 = mongoose.Schema({
    srNo: {
        type: Number
    },
    type: {
        type: String
    },
    ovrRnk: {
        type: Number
    },
    catRnk: {
        type: Number
    },
    resRnk: {
        type: Number
    },
    pref: {
        type: Number
    },
    appNo: {
        type: String
    },
    candidateName: {
        type: String
    },
    vert: {
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
    domicile: {
        type: String
    },
    mobileNo: {
        type: Number
    },
    email: {
        type: String
    },
    board: {
        type: String
    },
    twelthRoll: {
        type: Number
    },
    twelthStream: {
        type: String
    },
    twelthPer: {
        type: Number
    },
    meritIndex: {
        type: Number
    },
    majorSubject: {
        type: String
    }
}, { strict: false });

const ugRegularSem1MeritList4 = mongoose.model('Data4', DataSchema4, 'ugRegularSem1MeritList4');
export default ugRegularSem1MeritList4

