import jwt from "jsonwebtoken";
import Students from "../models/userModels/studentModels.js";
import Admin from "../models/userModels/adminModels.js";

export const studentAuth = async (req, res, next) => {
    try {
        const token = req.cookies.uid;
        if (!token) {
            req.flash("flashMessage", ["Please, login to access this page", "alert-danger"]);
            return res.redirect(`/student/login`);
        }

        const { id } = jwt.verify(token, process.env.SECRET_KEY);
        const student = await Students.findById(id);

        if (!student) {
            req.flash("flashMessage", ["Invalid token or user not found", "alert-danger"]);
            return res.redirect(`/student/login`);
        }

        req.id = student._id;
        req.courseSession = student.session;
        next();

    } catch (error) {
        console.error(" Student Auth Middleware Error:", error.message);
        req.flash("flashMessage", ["Authentication failed. Please login again.", "alert-danger"]);
        return res.redirect(`/student/login`);
    }
};

export const adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.uid;
        if (!token) {
            req.flash("flashMessage", ["Please, login to access this page", "alert-danger"]);
            return res.redirect(`/admin/login`);
        }

        const { id } = jwt.verify(token, process.env.SECRET_KEY);
        const admin = await Admin.findById(id);

        if (!admin) {
            req.flash("flashMessage", ["Invalid token or user not found", "alert-danger"]);
            return res.redirect(`/admin/login`);
        }

        req.id = admin._id;
        req.fullName = admin.fullName
        req.userId = admin.userId
        req.role = admin.role
        next();

    } catch (error) {
        console.error("❌ Admin Auth Middleware Error:", error.message);
        req.flash("flashMessage", ["Authentication failed. Please login again.", "alert-danger"]);
        return res.redirect(`/admin/login`);
    }
};