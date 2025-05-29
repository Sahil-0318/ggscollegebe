import Students from "../../models/userModels/studentModels.js";
import UgRegSemAdmPortal from "../../models/portalModel/ugRegSemAdmPortal.js";
import UgRegSem2AdmForm from "../../models/ugRegSemAdmForm/sem2.js";
import { uploadFile } from "../../fileUpload/uploadFile.js";

export const admForm = async (req, res) => {
    const { courseSession } = req.params;
    const fullSession = '20' + req.params.courseSession.match(/\d{2}-\d{2}/)[0].replace('-', '-20');
    try {
        const semPortal = await UgRegSemAdmPortal.findOne({ session: fullSession });
        const existingStudent = await Students.findOne({ session: fullSession, _id: req.id }).populate("sem2");
        // console.log(existingStudent)

        if (existingStudent === null) {
            req.flash("flashMessage", ["Please Login to Access This Page !!", "alert-danger"])
            return res.redirect(`/student/login`);
        }
        
        res.render("student/sem2AdmForm", { message: req.flash("flashMessage"), courseSession, semester: "sem2", semPortal, existingStudent, title: `UG Reg Sem 2 (${fullSession}) Admission Form | SGGS College` })
    } catch (error) {
        console.error("Error in Controllers >> studentControllers >> sem2Controller >> admForm :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/student/${courseSession}/sem1/admForm`);
    }
}