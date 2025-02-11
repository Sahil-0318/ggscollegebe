import mongoose from 'mongoose'

const ugRegularPart3UserSchema = mongoose.Schema({
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
    isFormFilled:{
        type : Boolean,
        default : false
    }
    
})

export default mongoose.model("ugRegularPart3User", ugRegularPart3UserSchema)