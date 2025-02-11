import mongoose from 'mongoose'

const ugRegularSem3UserSchema = mongoose.Schema({
    course:{
        type : String,
        required : true
    },
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

export default mongoose.model("ugRegularSem3User", ugRegularSem3UserSchema)