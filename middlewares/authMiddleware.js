import jwt from "jsonwebtoken";
import Students from "../models/userModels/studentModels.js";

export const studentAuth = async (req, res, next) => {
    const courseSession = req.params.courseSession;

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
        console.error("❌ Auth Middleware Error:", error.message);
        req.flash("flashMessage", ["Authentication failed. Please login again.", "alert-danger"]);
        return res.redirect(`/student/login`);
    }
};
