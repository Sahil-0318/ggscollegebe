import Students from "../../models/userModels/studentModels.js";
import UgRegSemAdmPortal from "../../models/portalModel/ugRegSemAdmPortal.js";

export const dashboard = async (req, res) => {
    const courseSession = req.params.courseSession;
    const fullSession = '20' + req.params.courseSession.match(/\d{2}-\d{2}/)[0].replace('-', '-20');
    try {
        const semPortal = await UgRegSemAdmPortal.findOne({ session: fullSession });
        const existingStudent = await Students.findOne({ session: fullSession, _id: req.id });

        if (existingStudent === null) {
            req.flash("flashMessage", ["Please Login to Access This Page !!", "alert-danger"])
            return res.redirect(`/student/login`);
        }

        res.render("student/dashboard", { message: req.flash("flashMessage"), courseSession, semPortal, existingStudent, title: "Student Dashboard | SGGS College" })
    } catch (error) {
        console.error("Error in Controllers >> studentControllers >> dashboardController >> dashboard :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/student/${courseSession}/dashboard`);
    }
}