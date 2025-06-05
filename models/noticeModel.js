import mongoose from 'mongoose'

const noticeSchema = mongoose.Schema({
    noticeType:{
        type : String,
        enum: ['News', 'Exam', 'Admission'],
        required : true
    },
    noticeTitle:{
        type : String,
        required : true
    },
    noticeMedia:{
        type : String,
        required : true
    }
    
}, {timestamps:true})

const Notice =  mongoose.model("notice", noticeSchema)
export default Notice