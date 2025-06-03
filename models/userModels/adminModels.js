import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['Admin', 'Sub-admin']
    },
})

const Admin = mongoose.model("admin", adminSchema)
export default Admin