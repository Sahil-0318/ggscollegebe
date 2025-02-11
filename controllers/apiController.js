import notice from '../models/adminModel/noticeSchema.js'

const noticeAPI = async (req, res) =>{
    try {
        const notices = await notice.find()
        res.status(200).json({
            success : true,
            notices
        })
    } catch (error) {
        console.log("Error in notice API", error)
    }
}

export {noticeAPI}