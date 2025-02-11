import mongoose from 'mongoose'

const bca2UserSchema  = mongoose.Schema({
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

const bca2UserModel = mongoose.model("bca2UserModel", bca2UserSchema)
export default bca2UserModel