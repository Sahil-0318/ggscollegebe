import mongoose from 'mongoose'

const bca3UserSchema  = mongoose.Schema({
    fullName:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    mobileNumber :{
        type : Number,
        required : true
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
    isPaid:{
        type : Boolean,
        default : false
    }
    
})

const bca3UserModel = mongoose.model("bca3UserModel", bca3UserSchema)
export default bca3UserModel