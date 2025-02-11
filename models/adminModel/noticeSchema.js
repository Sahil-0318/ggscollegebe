import mongoose from 'mongoose'

const noticeSchema = mongoose.Schema({
    noticeTitle:{
        type : String,
        required : true
    },
    noticePDF:{
        type : String,
        required : true
    }
    
}, {timestamps:true})

export default mongoose.model("Notice", noticeSchema)