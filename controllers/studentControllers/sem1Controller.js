import Students from "../../models/userModels/studentModels.js";
import UgRegSemAdmPortal from "../../models/portalModel/ugRegSemAdmPortal.js";
import UgRegSem1AdmForm from "../../models/ugRegSemAdmForm/sem1.js";
import UgRegSem2AdmForm from "../../models/ugRegSemAdmForm/sem2.js";
import { uploadFile } from "../../fileUpload/uploadFile.js";

export const admForm = async (req, res) => {
    const courseSession = req.params.courseSession;
    const fullSession = '20' + req.params.courseSession.match(/\d{2}-\d{2}/)[0].replace('-', '-20');
    try {
        const semPortal = await UgRegSemAdmPortal.findOne({ session: fullSession });
        const existingStudent = await Students.findById(req.id).populate("sem1").populate("sem2");
        // console.log(existingStudent)
        res.render("student/sem1AdmForm", { message: req.flash("flashMessage"), courseSession, semPortal, existingStudent, title: "Admission Form | SGGS College" })
    } catch (error) {
        console.error("Error in Controllers >> studentControllers >> sem1Controller >> admForm :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/student/${courseSession}/admForm`);
    }
}

export const admFormPost = async (req, res) => {
    const courseSession = req.params.courseSession;
    const fullSession = '20' + req.params.courseSession.match(/\d{2}-\d{2}/)[0].replace('-', '-20');

    try {
        const {
            studentName, fatherName, motherName, guardianName, referenceNumber, email,
            applicantId, dOB, gender, familyAnnualIncome, religion, category, bloodGroup,
            physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber,
            address, district, policeStation, state, pinCode, paper1, paper2, paper3,
            paper4, paper5, paper6, examName, examBoard, examYear, examResult,
            obtMarks, fullMarks, obtPercent, ppuConfidentialNumber
        } = req.body;

        const existingStudent = await Students.findById(req.id);
        if (!existingStudent) throw new Error("Student not found");

        const isScience = ["Physics", "Chemistry", "Zoology", "Botany", "Mathematics"].includes(paper1);
        const streamPrefix = isScience ? "BS" : "BA";

        const lastRoll = await UgRegSem1AdmForm
            .findOne({ collegeRollNo: { $regex: `^${streamPrefix}\\d+$` } })
            .sort({ collegeRollNo: -1 })
            .lean();

        const lastNumber = lastRoll?.collegeRollNo ? parseInt(lastRoll.collegeRollNo.slice(2)) : 0;
        const collegeRollNo = `${streamPrefix}${lastNumber + 1}`;

        const studentMedia = req.files;
        const photoUpload = await uploadFile(studentMedia.studentPhoto[0]);
        const signUpload = await uploadFile(studentMedia.studentSign[0]);

        // Calculate admission fee
        let admissionFee = 0;
        const course = existingStudent.course;
        const isPsychology = paper1 === "Psychology";
        const isScienceCourse = course === "Bachelor of Science" || isPsychology;

        if (gender === "Male") {
            if (isScienceCourse) {
                admissionFee = category === "GENERAL" || category === "BC-2" ? 3455
                    : category === "BC-1" ? 2855 : 1200;
            } else {
                admissionFee = category === "GENERAL" || category === "BC-2" ? 2855
                    : category === "BC-1" ? 2255 : 600;
            }
        } else {
            admissionFee = isScienceCourse ? 1200 : 600;
        }

        const newAdmissionForm = new UgRegSem1AdmForm({
            studentName, fatherName, motherName, guardianName, referenceNumber, email, applicantId,
            dOB, gender, familyAnnualIncome, religion, category, bloodGroup, physicallyChallenged,
            maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district,
            policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6,
            examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent,
            ppuConfidentialNumber, session: fullSession, studentPhoto: photoUpload.secure_url,
            studentSign: signUpload.secure_url, appliedBy: existingStudent._id,
            admissionFee, collegeRollNo
        });

        const savedForm = await newAdmissionForm.save();

        existingStudent.sem1 = savedForm._id;
        await existingStudent.save();

        req.flash("flashMessage", ["Form filled successfully, Pay Admission fee.", "alert-success"]);
        return res.redirect(`/student/${courseSession}/checkoutPage/${savedForm._id}`);

    } catch (error) {
        console.error("Error in admFormPost:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/student/${courseSession}/admForm`);
    }
};

export const checkoutPage = async (req, res) => {
    const courseSession = req.params.courseSession;
    const formId = req.params.formId;
    const fullSession = '20' + req.params.courseSession.match(/\d{2}-\d{2}/)[0].replace('-', '-20');
    try {
        const semPortal = await UgRegSemAdmPortal.findOne({ session: fullSession });
        const existingStudent = await Students.findById(req.id).populate("sem1");
        if (!existingStudent || !existingStudent.sem1) {
            req.flash("flashMessage", ["Admission form not found or not filled.", "alert-danger"]);
            return res.redirect(`/student/${courseSession}/admForm`);
        }
        // console.log(existingStudent)
        res.render("student/checkoutPage", { message: req.flash("flashMessage"), courseSession, semPortal, existingStudent, title: "Admission Checkout Page | SGGS College" })
    } catch (error) {
        console.error("Error in Controllers >> studentControllers >> sem1Controller >> checkoutPage :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/student/${courseSession}/admForm`);
    }
};

export const checkoutPagePost = async (req, res) => {
    const { courseSession, formId } = req.params;
    
    try {
        const { paymentId } = req.body;
        
    // Construct full session if needed (you can remove this if unused)
    const fullSession = '20' + courseSession.match(/\d{2}-\d{2}/)?.[0].replace('-', '-20');
    
    // Check for duplicate payment ID
    const existingPaymentId = await UgRegSem1AdmForm.findOne({ paymentId });
    if (existingPaymentId) {
        req.flash("flashMessage", ["Payment ID already exists.", "alert-danger"]);
      return res.redirect(`/student/${courseSession}/checkoutPage/${formId}`);
    }
    
    // Fetch existing form
    const existingForm = await UgRegSem1AdmForm.findById(formId);
    if (!existingForm) {
      req.flash("flashMessage", ["Admission form not found.", "alert-danger"]);
      return res.redirect(`/student/${courseSession}/admForm`);
    }
    
    // Prevent duplicate payment
    if (existingForm.paymentId) {
      req.flash("flashMessage", ["Payment already made for this form.", "alert-danger"]);
      return res.redirect(`/student/${courseSession}/admForm`);
    }
    
    // Handle uploaded screenshot
    const studentMedia = req.files;
    if (!studentMedia?.paymentScreenshot?.[0]) {
        req.flash("flashMessage", ["Payment screenshot is required.", "alert-danger"]);
        return res.redirect(`/student/${courseSession}/checkoutPage/${formId}`);
    }
    
    const paymentScreenshotUpload = await uploadFile(studentMedia.paymentScreenshot[0]);
    
    // Save payment details
    existingForm.paymentId = paymentId;
    existingForm.isPaid = true;
    existingForm.receiptNo = `SGGS-${existingForm.collegeRollNo.replace(/\D+/g, '')}-${Date.now()}`;
    existingForm.paymentScreenshot = paymentScreenshotUpload.secure_url;
    await existingForm.save();
    
    req.flash("flashMessage", ["Payment successful.", "alert-success"]);
    return res.redirect(`/student/${courseSession}/admForm`);
    
} catch (error) {
    console.error("Error in checkoutPagePost:", error);
    req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
    return res.redirect(`/student/${courseSession}/checkoutPage/${formId}`);
}
};

export const admFormCopy = async (req, res) => {
    const courseSession = req.params.courseSession;
    const fullSession = '20' + req.params.courseSession.match(/\d{2}-\d{2}/)[0].replace('-', '-20');
    try {
        const semPortal = await UgRegSemAdmPortal.findOne({ session: fullSession });
        const existingStudent = await Students.findById(req.id).populate("sem1");
        if (!existingStudent || !existingStudent.sem1) {
            req.flash("flashMessage", ["Admission form not found or not filled.", "alert-danger"]);
            return res.redirect(`/student/${courseSession}/admForm`);
        }
        // console.log(existingStudent)
        res.render("student/sem1AdmFormCopy", { message: req.flash("flashMessage"), courseSession, semPortal, existingStudent, title: "Admission Form Copy | SGGS College" })
    } catch (error) {
        console.error("Error in Controllers >> studentControllers >> sem1Controller >> admFormCopy :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/student/${courseSession}/admForm`);
    }
};

export const receiptCopy = async (req, res) => {
    const courseSession = req.params.courseSession;
    const fullSession = '20' + req.params.courseSession.match(/\d{2}-\d{2}/)[0].replace('-', '-20');
    try {
        const semPortal = await UgRegSemAdmPortal.findOne({ session: fullSession });
        const existingStudent = await Students.findById(req.id).populate("sem1");
        if (!existingStudent || !existingStudent.sem1) {
            req.flash("flashMessage", ["Admission form not found or not filled.", "alert-danger"]);
            return res.redirect(`/student/${courseSession}/admForm`);
        }
        // console.log(existingStudent)
        res.render("student/sem1ReceiptCopy", { message: req.flash("flashMessage"), courseSession, semPortal, existingStudent, title: "Receipt Copy | SGGS College" })
    } catch (error) {
        console.error("Error in Controllers >> studentControllers >> sem1Controller >> receiptCopy :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/student/${courseSession}/admForm`);
    }
};