import Admin from "../../models/userModels/adminModels.js";

export const adminDashboard = async (req, res) => {
    try {
        const existingAdmin = await Admin.findById(req.id);
        // console.log(existingAdmin)

        if (existingAdmin === null) {
            req.flash("flashMessage", ["Please Login to Access This Page !!", "alert-danger"])
            return res.redirect(`/admin/login`);
        }

        res.render("admin/dashboard", { message: req.flash("flashMessage"), existingAdmin, title: "Admin Dashboard | SGGS College" })
    } catch (error) {
        console.error("Error in Controllers >> adminControllers >> dashboardController >> adminDashboard :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/admin/dashboard`);
    }
}