// Importing Models
import UgRegMeritList1 from "../../models/ugRegMeritList/meritList1.js";
import Students from "../../models/userModels/studentModels.js";

// Importing Utils Functions
import { generateUserId, generatePassword, sendCredentialsOnEmail } from "../../utils/util-functions.js";

// Importing Modules
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    const courseSession = req.params.courseSession;
    const fullSession = '20' + req.params.courseSession.match(/\d{2}-\d{2}/)[0].replace('-', '-20');

    try {
        res.render("auth/register", { message: req.flash("flashMessage"), courseSession, fullSession })
    } catch (error) {
        console.error("Error in Controllers >> authControllers >> authController >> register :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/student/${courseSession}/register`);
    }
}

export const registerPost = async (req, res) => {
    const courseSession = req.params.courseSession;
    const session = '20' + courseSession.match(/\d{2}-\d{2}/)?.[0].replace('-', '-20');

    try {
        const { referenceNumber, mobileNumber, email } = req.body;

        // 1️⃣ Validate reference number in merit list
        const meritRecord = await UgRegMeritList1.findOne({ referenceNumber });
        if (!meritRecord) {
            req.flash("flashMessage", ["Reference number not found", "alert-danger"]);
            return res.redirect(`/student/${courseSession}/register`);
        }

        // 2️⃣ Check if student already registered
        const existingStudent = await Students.findOne({
            $or: [{ referenceNumber }, { mobileNumber }, { email }]
        });

        if (existingStudent) {
            const conflictMsg = existingStudent.referenceNumber === referenceNumber
                ? "Already registered with this reference number"
                : existingStudent.mobileNumber === mobileNumber
                    ? "Mobile number already exists"
                    : "Email already exists";

            req.flash("flashMessage", [conflictMsg, "alert-danger"]);
            return res.redirect(`/student/${courseSession}/register`);
        }

        // 3️⃣ Determine course
        const { majorSubject, studentName, gender, dOB, fatherName } = meritRecord;
        const scienceSubjects = ["Botany", "Mathematics", "Chemistry", "Physics", "Zoology"];
        const humanitiesSubjects = ["English", "Hindi", "Urdu", "Philosophy"];

        const course = scienceSubjects.includes(majorSubject)
            ? "Bachelor of Science"
            : humanitiesSubjects.includes(majorSubject)
                ? "Bachelor of Arts (Humanities Subjects)"
                : "Bachelor of Arts (Social Science Subjects)";

        // 4️⃣ Generate credentials
        const userId = generateUserId(email, mobileNumber);
        const password = generatePassword();

        sendCredentialsOnEmail(email, userId, password);

        // 5️⃣ Save student record
        const newStudent = new Students({
            session,
            course,
            userId,
            password,
            referenceNumber,
            studentName,
            gender,
            dOB,
            email,
            mobileNumber,
            fatherName,
            majorSubject
        });

        await newStudent.save();

        req.flash("flashMessage", [`Registration successful. Credentials sent to ${email}`, "alert-success"]);
        return res.redirect(`/student/${courseSession}/login`);

    } catch (error) {
        console.error("❌ Error in registerPost:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/student/${courseSession}/register`);
    }
};


export const login = async (req, res) => {
    const courseSession = req.params.courseSession;
    const fullSession = '20' + req.params.courseSession.match(/\d{2}-\d{2}/)[0].replace('-', '-20');

    try {
        res.render("auth/login", { message: req.flash("flashMessage"), courseSession, fullSession })
    } catch (error) {
        console.error("Error in Controllers >> authControllers >> authController >> login :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/student/${courseSession}/login`);
    }
}   

export const loginPost = async (req, res) => {
    const courseSession = req.params.courseSession;
    const session = '20' + req.params.courseSession.match(/\d{2}-\d{2}/)[0].replace('-', '-20');

    try {
        let { userId, password } = req.body
        const existingStudent = await Students.findOne({ userId, password })

        if (!existingStudent) {
            req.flash("flashMessage", ["Invalid credentials", "alert-danger"]);
            return res.redirect(`/student/${courseSession}/login`);
        }

        const token = jwt.sign({
            id: existingStudent._id,
            courseSession: existingStudent.session,
            mobileNumber: existingStudent.mobileNumber,
            email: existingStudent.email
        }, process.env.SECRET_KEY,
            { expiresIn: "7d" })
        res.cookie('uid', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })

        req.flash("flashMessage", ["Login successful !!", "alert-success"]);
        return res.redirect(`/student/${courseSession}/dashboard`);
    } catch (error) {
        console.error("Error in Controllers >> authControllers >> authController >> loginPost :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/student/${courseSession}/login`);
    }
}   

export const logout = async (req, res) => {
    const courseSession = req.params.courseSession;
    res.clearCookie("uid");
    req.flash("flashMessage", ["Logout successfully !!", "alert-danger"]);
    return res.status(201).redirect(`/student/${courseSession}/login`);
}