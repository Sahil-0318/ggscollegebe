import Notice from '../../models/noticeModel.js';
import Admin from '../../models/userModels/adminModels.js';
import { noticeUpload } from '../../fileUpload/uploadFile.js';
import { deleteFile } from '../../fileUpload/fileDelete.js';

export const notice = async (req, res) => {
    try {
        const existingAdmin = await Admin.findById(req.id);
        // console.log(existingAdmin)

        if (existingAdmin === null) {
            req.flash("flashMessage", ["Please Login to Access This Page !!", "alert-danger"])
            return res.redirect(`/admin/login`);
        }

        let notices = await Notice.find()

        res.render("notice/notice", {
            message: req.flash("flashMessage"), existingAdmin, notices, title: "Notice | SGGS College"
        });
    } catch (error) {
        console.error("❌ Error in notice controller >> notice:", error);
        req.flash("flashMessage", ["Something went wrong!!", "alert-danger"]);
        res.redirect("/admin/notice");
    }
};

export const noticePost = async (req, res) => {
    try {
        const { noticeType, noticeTitle } = req.body
        const existingAdmin = await Admin.findById(req.id);
        // console.log(existingAdmin)

        if (existingAdmin === null) {
            req.flash("flashMessage", ["Please Login to Access This Page !!", "alert-danger"])
            return res.redirect(`/admin/login`);
        }

        // Upload notice
        const noticeFile = req.files;
        let noticeMedia;
        try {
            noticeMedia = await noticeUpload(noticeFile.noticeMedia[0]);
        } catch (uploadErr) {
            console.error('Upload error:', uploadErr);
            req.flash("flashMessage", ["Error uploading files. Please try again.", "alert-danger"]);
            return res.redirect(`/admin/notice`);
        }

        const notice = new Notice({
            noticeType,
            noticeTitle,
            noticeMedia: noticeMedia.secure_url
        })

        await notice.save()

        req.flash("flashMessage", ["Notice Uploaded Successfully", "alert-success"]);
        return res.redirect(`/admin/notice`);
    } catch (error) {
        console.error("❌ Error in notice controller >> noticePost:", error);
        req.flash("flashMessage", ["Something went wrong!!", "alert-danger"]);
        res.redirect("/admin/notice");
    }
};

export const updateNotice = async (req, res) => {
    try {
        const existingAdmin = await Admin.findById(req.id);
        // console.log(existingAdmin)

        if (existingAdmin === null) {
            req.flash("flashMessage", ["Please Login to Access This Page !!", "alert-danger"])
            return res.redirect(`/admin/login`);
        }

        let notice = await Notice.findById(req.params.noticeId)

        res.render("notice/updateNotice", {
            message: req.flash("flashMessage"), existingAdmin, notice, title: "Update Notice | SGGS College"
        });
    } catch (error) {
        console.error("❌ Error in notice controller >> notice:", error);
        req.flash("flashMessage", ["Something went wrong!!", "alert-danger"]);
        res.redirect("/admin/notice");
    }
};


export const updateNoticePost = async (req, res) => {
    try {
        const { noticeType, noticeTitle } = req.body;

        const existingAdmin = await Admin.findById(req.id);
        if (!existingAdmin) {
            req.flash("flashMessage", ["Please login to access this page!", "alert-danger"]);
            return res.redirect("/admin/login");
        }

        const notice = await Notice.findById(req.params.noticeId);
        if (!notice) {
            req.flash("flashMessage", ["Notice not found!", "alert-danger"]);
            return res.redirect("/admin/notice");
        }

        // Update notice fields
        notice.noticeType = noticeType;
        notice.noticeTitle = noticeTitle;

        // Check if new file is uploaded
        if (req.files && req.files.noticeMedia) {
            const oldMediaUrl = notice.noticeMedia;

            try {
                const uploaded = await noticeUpload(req.files.noticeMedia[0]);
                notice.noticeMedia = uploaded.secure_url;

                // Delete old media only after new one uploads successfully
                if (oldMediaUrl) {
                    try {
                        await deleteFile(oldMediaUrl);
                    } catch (deleteErr) {
                        console.error("⚠️ Error deleting old file:", deleteErr.message);
                    }
                }
            } catch (uploadErr) {
                console.error("❌ Upload error:", uploadErr.message);
                req.flash("flashMessage", ["Error uploading file. Please try again.", "alert-danger"]);
                return res.redirect("/admin/notice");
            }
        }

        await notice.save();
        req.flash("flashMessage", ["Notice updated successfully!", "alert-success"]);
        return res.redirect("/admin/notice");

    } catch (error) {
        console.error("❌ Error in notice controller >> updateNoticePost:", error.message);
        req.flash("flashMessage", ["Something went wrong!!", "alert-danger"]);
        return res.redirect("/admin/notice");
    }
};




export const deleteNotice = async (req, res) => {
    try {
        const { noticeId } = req.params
        const existingAdmin = await Admin.findById(req.id);
        // console.log(existingAdmin)

        if (existingAdmin === null) {
            req.flash("flashMessage", ["Please Login to Access This Page !!", "alert-danger"])
            return res.redirect(`/admin/login`);
        }

        let notice = await Notice.findById(noticeId)

        try {
            let deletedMedia = await deleteFile(notice.noticeMedia);
        } catch (deleteErr) {
            console.error('Delete error:', deleteErr);
            req.flash("flashMessage", ["Error deleting files. Please try again.", "alert-danger"]);
            return res.redirect(`/admin/notice`);
        }

        await Notice.findByIdAndDelete(noticeId)

        req.flash("flashMessage", ["Notice deleted successfully !!", "alert-success"]);
        res.redirect("/admin/notice");
    } catch (error) {
        console.error("❌ Error in notice controller >> deleteNotice:", error);
        req.flash("flashMessage", ["Something went wrong!!", "alert-danger"]);
        res.redirect("/admin/notice");
    }
};