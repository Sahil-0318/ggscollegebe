import jwt from 'jsonwebtoken'
import User from '../models/userModel/userSchema.js'

const adminAuth = async (req, res , next)=>{
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        const user = await User.findOne({ _id: verifiedUser.id })
        if (user.isAdmin == true) {
            req.id = user._id
        }
        else {
            res.redirect('login')
        }
        next()
        
    } catch (error) {
        res.status(401).redirect('login')
    }
}

export {
    adminAuth
}