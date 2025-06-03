import Admin from "../../models/userModels/adminModels.js";
// Importing Modules
import jwt from 'jsonwebtoken'

export const adminLogin = async (req, res) => {
    try {
        res.render("adminAuth/login", {
            message: req.flash("flashMessage")
        });
    } catch (error) {
        console.error("❌ Error in admin login controller:", error);
        req.flash("flashMessage", ["Something went wrong!!", "alert-danger"]);
        res.redirect("/admin/login");
    }
};

export const adminLoginPost = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ userId, password })

        if (!existingAdmin) {
            req.flash("flashMessage", ["Invalid credentials", "alert-danger"]);
            return res.redirect(`/admin/login`);
        }

        const token = jwt.sign({
            id: existingAdmin._id
        }, process.env.SECRET_KEY,
            { expiresIn: "7d" })

        res.cookie('uid', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })

        req.flash("flashMessage", ["Login successful !!", "alert-success"]);
        return res.redirect(`/admin/dashboard`);
    } catch (error) {
        console.error("❌ Error in adminLoginPost:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect("/admin/login");
    }
}

export const adminLogout = (req, res) => {
    res.clearCookie("uid");
    req.flash("flashMessage", ["Logout successfully !!", "alert-danger"]);
    return res.redirect(303, "/admin/login");
};