import Students from "../../models/userModels/studentModels.js";
import { generateUserId, generatePassword, sendCredentialsOnEmail } from "../../utils/util-functions.js";

export const recoverCredential = async (req, res) => {
    const { course } = req.params;
    try {
        res.render("auth/recoverCredential", {
            message: req.flash("flashMessage"),
            course,
        });
    } catch (error) {
        console.error("❌ Error rendering recoverCredential page:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        res.redirect(`/student/${course}/recoverCredential`);
    }
};

export const recoverCredentialPost = async (req, res) => {
    const { course } = req.params;
    const { mobileNumber, email } = req.body;

    if (course !== "ug-reg") {
        req.flash("flashMessage", ["Invalid course provided.", "alert-danger"]);
        return res.redirect(`/student/${course}/recoverCredential`);
    }

    try {
        const student = await Students.findOne({ mobileNumber, email });

        if (!student) {
            req.flash("flashMessage", ["Mobile No. or Email not found !!", "alert-danger"]);
            return res.redirect(`/student/${course}/recoverCredential`);
        }

        // Generate credentials
        const userId = generateUserId(email, mobileNumber);
        const password = generatePassword();

        // Send via email
        try {
            await sendCredentialsOnEmail(email, userId, password);
        } catch (emailError) {
            console.error("❌ Failed to send email:", emailError);
            req.flash("flashMessage", ["Failed to send credentials to your email. Please try again.", "alert-danger"]);
            return res.redirect(`/student/${courseSession}/${semester}/register`);
        }

        // Save updated credentials
        student.userId = userId;
        student.password = password;
        await student.save();

        req.flash("flashMessage", [`Credentials sent to ${email}`, "alert-success"]);
        return res.redirect(`/student/login`);
    } catch (error) {
        console.error("❌ Error in recoverCredentialPost:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        res.redirect(`/student/${course}/recoverCredential`);
    }
};
