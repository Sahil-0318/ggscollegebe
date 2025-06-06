import Notice from '../../models/noticeModel.js';

export const notices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 }); // optional sorting

        return res.status(200).json({
            status: 200,
            message: "Notices fetched successfully",
            data: notices
        });
    } catch (error) {
        console.error("❌ Error in notice controller >> notices:", error.message);
        return res.status(500).json({
            status: 500,
            message: "Something went wrong while fetching notices",
            error: error.message
        });
    }
};


export const newsNotices = async (req, res) => {
    try {
        let type = "News"
        const notices = await Notice.find({noticeType : type}).sort({ createdAt: -1 }); // optional sorting

        return res.status(200).json({
            status: 200,
            message: "News notices fetched successfully",
            data: notices
        });
    } catch (error) {
        console.error("❌ Error in notice controller >> newsNotices:", error.message);
        return res.status(500).json({
            status: 500,
            message: "Something went wrong while fetching notices",
            error: error.message
        });
    }
};


export const examNotices = async (req, res) => {
    try {
        let type = "Exam"
        const notices = await Notice.find({noticeType : type}).sort({ createdAt: -1 }); // optional sorting

        return res.status(200).json({
            status: 200,
            message: "News notices fetched successfully",
            data: notices
        });
    } catch (error) {
        console.error("❌ Error in notice controller >> examNotices:", error.message);
        return res.status(500).json({
            status: 500,
            message: "Something went wrong while fetching notices",
            error: error.message
        });
    }
};


export const admissionNotices = async (req, res) => {
    try {
        let type = "Admission"
        const notices = await Notice.find({noticeType : type}).sort({ createdAt: -1 }); // optional sorting

        return res.status(200).json({
            status: 200,
            message: "News notices fetched successfully",
            data: notices
        });
    } catch (error) {
        console.error("❌ Error in notice controller >> admissionNotices:", error.message);
        return res.status(500).json({
            status: 500,
            message: "Something went wrong while fetching notices",
            error: error.message
        });
    }
};
