import mongoose from 'mongoose'

const bca1UserSchema  = mongoose.Schema({
    fullName:{
        type : String,
        required : true
    },
    fatherName: {
        type: String
    },
    email:{
        type : String,
        required : true
    },
    mobileNumber :{
        type : Number,
        required : true
    },
    appNo:{
        type : String
    },
    gender: {
        type: String
    },
    dOB: {
        type: String
    },
    userId : {
        type : String
    },
    password: {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    },
    isFormFilled:{
        type : Boolean,
        default : false
    }
    
})

const bca1UserModel = mongoose.model("bca1UserModel", bca1UserSchema)
export default bca1UserModel