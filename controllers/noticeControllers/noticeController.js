import Notice from '../../models/noticeModel.js';
import Admin from '../../models/userModels/adminModels.js';
import { noticeUpload } from '../../fileUpload/uploadFile.js';

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