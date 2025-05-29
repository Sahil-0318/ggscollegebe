// Importing Models
import UgRegMeritList1 from "../../models/ugRegMeritList/meritList1.js";
import Students from "../../models/userModels/studentModels.js";

// Importing Utils Functions
import { generateUserId, generatePassword, sendCredentialsOnEmail } from "../../utils/util-functions.js";

// Importing Modules
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    const courseSession = req.params.courseSession;

    // Validate and extract start year (e.g., 25 from "ug-reg-25-29-admission")
    const match = courseSession.match(/^ug-reg-(\d{2})-\d{2}-admission$/);
    if (!match) {
        return res.status(404).render("auth/pageNotFound");
    }

    const startYear = parseInt(match[1]);
    if (startYear < 25) {
        return res.status(404).render("auth/pageNotFound");
    }

    // Construct full session like 2025-2029
    const fullSession = '20' + courseSession.match(/\d{2}-\d{2}/)[0].replace('-', '-20');

    try {
        res.render("auth/register", { message: req.flash("flashMessage"), courseSession, fullSession });
    } catch (error) {
        console.error("❌ Error in Controllers >> authControllers >> register:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/student/${courseSession}/register`);
    }
};


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

        try {
            await sendCredentialsOnEmail(email, userId, password);
        } catch (emailError) {
            console.error("❌ Failed to send email:", emailError);
            req.flash("flashMessage", ["Failed to send credentials to your email. Please try again.", "alert-danger"]);
            return res.redirect(`/student/${courseSession}/${semester}/register`);
        }

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
        return res.redirect(`/student/login`);

    } catch (error) {
        console.error("❌ Error in registerPost:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/student/${courseSession}/register`);
    }
};


export const login = async (req, res) => {
    try {
        res.render("auth/login", {
            message: req.flash("flashMessage")
        });
    } catch (error) {
        console.error("❌ Error in login controller:", error);
        req.flash("flashMessage", ["Something went wrong!!", "alert-danger"]);
        res.redirect("/student/login");
    }
};


export const loginPost = async (req, res) => {
    const { sessionYear, userId, password } = req.body;
    const match = sessionYear.match(/(\d{4})-(\d{4})/);

    if (!match) {
        req.flash("flashMessage", ["Invalid session format", "alert-danger"]);
        return res.redirect("/student/login");
    }

    const shortStart = match[1].slice(2); // "25"
    const shortEnd = match[2].slice(2);   // "29"
    const courseSession = `ug-reg-${shortStart}-${shortEnd}-admission`;

    try {
        const existingStudent = await Students.findOne({ session: sessionYear, userId, password })

        if (!existingStudent) {
            req.flash("flashMessage", ["Invalid credentials", "alert-danger"]);
            return res.redirect(`/student/login`);
        }

        const token = jwt.sign({
            id: existingStudent._id,
            courseSession: existingStudent.session,
            mobileNumber: existingStudent.mobileNumber,
            email: existingStudent.email
        }, process.env.SECRET_KEY,
            { expiresIn: "7d" })

        res.cookie('uid', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })

        req.flash("flashMessage", ["Login successful !!", "alert-success"]);
        return res.redirect(`/student/${courseSession}/dashboard`);
    } catch (error) {
        console.error("❌ Error in loginPost:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect("/student/login");
    }
}


export const logout = (req, res) => {
    res.clearCookie("uid");
    req.flash("flashMessage", ["Logout successfully !!", "alert-danger"]);
    return res.redirect(303, "/student/login");
};


// semester 2 to 8 register routes for before 2025-2029 sessions
// student/ug-reg-24-28-admission/sem2/register

export const semRegister = async (req, res) => {
    const { courseSession, semester } = req.params;

    try {
        // Validate courseSession format and extract starting year
        const match = courseSession.match(/^ug-reg-(\d{2})-\d{2}-admission$/);
        if (!match) {
            return res.status(404).render("auth/pageNotFound");
        }

        const startYear = parseInt(match[1], 10);
        if (startYear > 24 || semester === "sem1") {
            return res.status(404).render("auth/pageNotFound");
        }

        const fullSession = '20' + courseSession.match(/\d{2}-\d{2}/)[0].replace('-', '-20');
        const formattedSemester = semester.replace(/([a-zA-Z]+)(\d+)/, (_, prefix, num) =>
            `${prefix.charAt(0).toUpperCase() + prefix.slice(1)} ${num}`
        );

        res.render("auth/semRegister", {
            message: req.flash("flashMessage"),
            courseSession,
            semester,
            formattedSemester,
            fullSession
        });

    } catch (error) {
        console.error("❌ Error in semRegister:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        res.redirect(`/student/${courseSession}/${semester}/register`);
    }
};


export const semRegisterPost = async (req, res) => {
    const { courseSession, semester } = req.params;

    // Validate session format and extract full session (e.g., "20" + "25-29" => "2025-2029")
    const sessionMatch = courseSession.match(/\d{2}-\d{2}/);
    if (!sessionMatch) {
        return res.status(404).render("error/404");
    }
    const fullSession = '20' + sessionMatch[0].replace('-', '-20');

    try {
        const {
            course,
            majorSubject,
            studentName,
            mobileNumber,
            email,
            dOB,
            gender
        } = req.body;

        // 1️⃣ Check for existing student by mobile or email
        const existingStudent = await Students.findOne({
            $or: [{ mobileNumber }, { email }]
        });

        if (existingStudent) {
            const conflictMsg =
                existingStudent.mobileNumber === mobileNumber
                    ? "Mobile number already exists"
                    : "Email already exists";

            req.flash("flashMessage", [conflictMsg, "alert-danger"]);
            return res.redirect(`/student/${courseSession}/${semester}/register`);
        }

        // 2️⃣ Generate credentials
        const userId = generateUserId(email, mobileNumber);
        const password = generatePassword();

        // 3️⃣ Try to send credentials
        try {
            await sendCredentialsOnEmail(email, userId, password);
        } catch (emailError) {
            console.error("❌ Failed to send email:", emailError);
            req.flash("flashMessage", ["Failed to send credentials to your email. Please try again.", "alert-danger"]);
            return res.redirect(`/student/${courseSession}/${semester}/register`);
        }

        // 4️⃣ Save new student
        const newStudent = new Students({
            session: fullSession,
            course,
            majorSubject,
            studentName,
            mobileNumber,
            email,
            dOB,
            gender,
            userId,
            password
        });

        await newStudent.save();

        req.flash("flashMessage", [
            `Registration successful. Credentials sent to ${email}`,
            "alert-success"
        ]);
        return res.redirect(`/student/login`);

    } catch (error) {
        console.error("❌ Error in semRegisterPost:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/student/${courseSession}/${semester}/register`);
    }
};



