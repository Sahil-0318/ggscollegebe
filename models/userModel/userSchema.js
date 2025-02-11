import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName:{
        type : String,
        required : true
    },
    gender:{
        type : String,
        required : true
    },
    dOB:{
        type : String,
        required : true
    },
    mobileNumber:{
        type : Number,
        required : true,
        unique : true
    },
    email: {
        type : String,
        required : true,
        unique : true
    },
    userName: {
        type : String,
        required : true
    },
    password: {
        type : String,
        required : true
    },
    isAdmin :{
        type: Boolean,
        default: false
    },
    isSuperAdmin :{
        type: Boolean,
        default: false
    },
    isRecordRoom :{
        type: Boolean,
        default: false
    }
},{timestamps:true})

export default mongoose.model("User", userSchema)