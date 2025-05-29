import mongoose from "mongoose";
const studentSchema = mongoose.Schema({
    session: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    referenceNumber: {
        type: String,
        default: null
    },
    studentName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dOB: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    fatherName: {
        type: String,
        default: null
    },
    majorSubject: {
        type: String
    },

    // Semester detail references (ObjectId links to other schemas)
    sem1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ugregsem1admform',
        default: null,
            
    },
    sem2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ugregsem2admform',
        default: null,
        required: false
    },
    sem3: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ugregsem3admform',
        default: null,
        required: false
    },
    sem4: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ugregsem4admform',
        default: null,
        required: false
    },
    sem5: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ugregsem5admform',
        default: null,
        required: false
    },
    sem6: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ugregsem6admform',
        default: null,
        required: false
    },
    sem7: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ugregsem7admform',
        default: null,
        required: false
    },
    sem8: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ugregsem8admform',
        default: null,
        required: false
    }
})

const Students = mongoose.model("student", studentSchema)
export default Students