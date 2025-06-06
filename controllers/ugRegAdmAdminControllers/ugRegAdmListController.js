import Admin from "../../models/userModels/adminModels.js";
import Students from "../../models/userModels/studentModels.js";

export const ugRegAdmissionList = async (req, res) => {
    const { courseSession } = req.params;
    const fullSession = '20' + courseSession.match(/\d{2}-\d{2}/)?.[0].replace('-', '-20');

    if (!fullSession) {
        req.flash("flashMessage", ["Invalid course session format", "alert-danger"]);
        return res.redirect('/admin/dashboard');
    }

    try {
        const existingAdmin = await Admin.findById(req.id);
        // console.log(existingAdmin)

        if (existingAdmin === null) {
            req.flash("flashMessage", ["Please Login to Access This Page !!", "alert-danger"])
            return res.redirect(`/admin/login`);
        }

        let students = await Students.find({ session: fullSession }).sort({ createdAt: -1 })
        // console.log(students)

        res.render("admin/ugRegAdmList", {
            message: req.flash("flashMessage"),
            existingAdmin,
            students,
            fullSession,
            courseSession,
            title: `UG Reg (${fullSession}) Admission List | SGGS College`
        });
    } catch (error) {
        console.error("Error in Controllers >> ugRegAdmAdminControllers >> ugReg25_29_Controller >> ugRegAdmissionList :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/admin/${courseSession}`);
    }
};


export const studentDetail = async (req, res) => {
    const { courseSession, studentId } = req.params;
    const fullSession = '20' + courseSession.match(/\d{2}-\d{2}/)?.[0].replace('-', '-20');

    if (!fullSession) {
        req.flash("flashMessage", ["Invalid course session format", "alert-danger"]);
        return res.redirect('/admin/dashboard');
    }

    try {
        const existingAdmin = await Admin.findById(req.id);
        // console.log(existingAdmin)

        if (existingAdmin === null) {
            req.flash("flashMessage", ["Please Login to Access This Page !!", "alert-danger"])
            return res.redirect(`/admin/login`);
        }

        let student = await Students.findById(studentId).select('-userId -password')
        // console.log(student)

        res.render("admin/studentDetail", {
            message: req.flash("flashMessage"),
            existingAdmin,
            student,
            fullSession,
            courseSession,
            title: `UG Reg (${fullSession}) Student Detail | SGGS College`
        });
    } catch (error) {
        console.error("Error in Controllers >> ugRegAdmAdminControllers >> ugReg25_29_Controller >> studentDetail :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/admin/${courseSession}`);
    }
};


export const studentDetailUpdate = async (req, res) => {
    const { courseSession, studentId } = req.params;
    const fullSession = '20' + courseSession.match(/\d{2}-\d{2}/)?.[0].replace('-', '-20');

    if (!fullSession) {
        req.flash("flashMessage", ["Invalid course session format", "alert-danger"]);
        return res.redirect('/admin/dashboard');
    }

    try {
        const existingAdmin = await Admin.findById(req.id);
        // console.log(existingAdmin)

        if (existingAdmin === null) {
            req.flash("flashMessage", ["Please Login to Access This Page !!", "alert-danger"])
            return res.redirect(`/admin/login`);
        }

        let student = await Students.findById(studentId).select('-userId -password')
        // console.log(student)

        res.render("admin/studentDetailUpadte", {
            message: req.flash("flashMessage"),
            existingAdmin,
            student,
            fullSession,
            courseSession,
            title: `Update UG Reg (${fullSession}) Student Detail | SGGS College`
        });
    } catch (error) {
        console.error("Error in Controllers >> ugRegAdmAdminControllers >> ugReg25_29_Controller >> studentDetailUpdate :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/admin/${courseSession}/student-detail/${studentId}`);
    }
};