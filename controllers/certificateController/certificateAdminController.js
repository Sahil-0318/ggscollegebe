import User from '../../models/userModel/userSchema.js'
import NewClc from '../../models/certificateModels/newClc.js'
import CC from '../../models/certificateModels/cc.js'
import TC from "../../models/certificateModels/tc.js"
import Bonafied from "../../models/certificateModels/bonafied.js"

import path from "path"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { writeFileSync, readFileSync, existsSync, unlink } from "fs"

// ====================== Character Certificate ================================
export const clclist = async (req, res) => {
    const filterQueries = req.query;
    try {
        const user = await User.findOne({ _id: req.id })

        const query = {};
        // query.isNormalPaid = true
        // query.isUrgentPaid = true
        // query.isDuplicatePaid = true
        // Construct the query object based on filterQueries
        if (filterQueries.course && filterQueries.course !== 'all') {
            query.course = filterQueries.course;
        }
        if (filterQueries.fullName && filterQueries.fullName !== '') {
            query.fullName = filterQueries.fullName;
        }
        if (filterQueries.regNumber && filterQueries.regNumber !== '') {
            query.regNumber = filterQueries.regNumber;
        }

        const clclist = await NewClc.find(query)
        res.render("clcAdmin", { user, clclist })
    } catch (error) {
        console.log("Error in clc list => ", error)
    }
}


export const downloadclc = async (req, res) => {
    try {
        const { id } = req.params
        const { type } = req.query
        const user = await User.findOne({ _id: req.id })

        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        const issuedAt = `${day}-${month}-${year}`


        let foundclc = ""

        if (type === "normal") {
            foundclc = await NewClc.findOneAndUpdate({ _id: id }, { $set: { normalIssuedAt: issuedAt, isNormalIssued : true } })
        }
        if (type === "urgent") {
            foundclc = await NewClc.findOneAndUpdate({ _id: id }, { $set: { urgentIssuedAt: issuedAt, isUrgentIssued : true } })
        }
        if (type === "duplicate") {
            foundclc = await NewClc.findOneAndUpdate({ _id: id }, { $set: { duplicateIssuedAt: issuedAt, isDuplicateIssued : true } })
        }

        function reverseString(str) {
            return str.split('-').reverse().join('-');
        }
        let reversedDOB = reverseString(foundclc.dOB);
        let reversedDOAdm = reverseString(foundclc.dOAdm);

        //Create pdf
        const document = await PDFDocument.load(readFileSync("./CLC.pdf"));
        const courierBoldFont = await document.embedFont(StandardFonts.Courier);
        const firstPage = document.getPage(0);

        firstPage.moveTo(105, 629);
        firstPage.drawText(`${foundclc.serialNo}`, {
            font: courierBoldFont,
            size: 16,
        });

        firstPage.moveTo(431, 630);
        firstPage.drawText(` ${foundclc.studentId}`, {
            font: courierBoldFont,
            size: 16,
        });

        firstPage.moveTo(350, 604);
        firstPage.drawText(`${foundclc.fullName}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 576);
        firstPage.drawText(`${foundclc.fatherName}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 550);
        firstPage.drawText(`${foundclc.motherName}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 523);
        firstPage.drawText(`${foundclc.aadharNumber}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 497);
        firstPage.drawText(`${foundclc.parmanentAddress}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 471);
        firstPage.drawText(`${reversedDOB}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 444);
        firstPage.drawText(`${foundclc.course}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 417);
        firstPage.drawText(`${foundclc.session}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 390);
        firstPage.drawText(`${reversedDOAdm}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 363);
        firstPage.drawText(`${foundclc.classRollNumber}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 336);
            firstPage.drawText(`${issuedAt}`, {
                font: courierBoldFont,
                size: 12,
            });

        firstPage.moveTo(350, 310);
        firstPage.drawText(`${foundclc.yearOfExam}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 284);
        firstPage.drawText(`${foundclc.resultDivision}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 258);
        firstPage.drawText(`${foundclc.regNumber}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 231);
        firstPage.drawText(`${foundclc.uniRollNumber}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 204);
        firstPage.drawText(`${foundclc.remark}`, {
            font: courierBoldFont,
            size: 16,
        });

        firstPage.moveTo(85, 45);
        firstPage.drawText(`${issuedAt}`, {
            font: courierBoldFont,
            size: 16,
        });


        writeFileSync("RollNo_" + foundclc.uniRollNumber + "_CLC.pdf", await document.save());
        let filename = "RollNo_" + foundclc.uniRollNumber + "_CLC.pdf"

        // const filePath = path.join('D:/New BD College/BD College Site', filename);
        const filePath = path.join(filename);
        console.log(filePath);

        if (existsSync(filePath)) {
            // Send the PDF file as a download
            res.download(filePath, `RollNo_${foundclc.uniRollNumber}_CLC.pdf`, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('An error occurred');
                } else {
                    // Delete the file after 10 minutes
                    setTimeout(() => {
                        unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Error deleting file: ${err}`);
                            } else {
                                console.log(`File ${filePath} deleted`);
                            }
                        });
                    }, 2 * 1000); // 10 minutes in milliseconds
                }
            });
        } else {
            res.status(404).send('File not found');
        }

    } catch (error) {
        console.log("Error in clc download => ", error)
    }
}


export const downloadCCInCLC = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ _id: req.id })

        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        const issuedAt = `${day}-${month}-${year}`
        // console.log(issuedAt)

        let foundcc = await NewClc.findOne({ _id: id })
        //Create pdf
        const document = await PDFDocument.load(readFileSync("./Character.pdf"));
        const courierBoldFont = await document.embedFont(StandardFonts.Courier);
        const firstPage = document.getPage(0);

        firstPage.moveTo(100, 350);
        firstPage.drawText(`${foundcc.serialNo}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(580, 350);
        firstPage.drawText(` ${foundcc.studentId}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(305, 310);
        firstPage.drawText(`${foundcc.fullName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(272, 270);
        firstPage.drawText(`${foundcc.fatherName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(160, 230);
        firstPage.drawText(`${foundcc.motherName}`, {
            font: courierBoldFont,
            size: 18,
        });


        firstPage.moveTo(248, 192);
        firstPage.drawText(`${foundcc.course}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(600, 192);
        firstPage.drawText(`${foundcc.session}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(200, 152);
        firstPage.drawText(`${foundcc.classRollNumber}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(76, 75);
        firstPage.drawText(`: ${issuedAt}`, {
            font: courierBoldFont,
            size: 16,
        });


        writeFileSync("RollNo_" + foundcc.classRollNumber + "_Char.pdf", await document.save());
        let filename = "RollNo_" + foundcc.classRollNumber + "_Char.pdf"

        const filePath = path.join(filename);
        console.log(filePath);

        if (existsSync(filePath)) {
            // Send the PDF file as a download
            res.download(filePath, `RollNo_${foundcc.classRollNumber}_Char.pdf`, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('An error occurred');
                } else {
                    // Delete the file after 10 minutes
                    setTimeout(() => {
                        unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Error deleting file: ${err}`);
                            } else {
                                console.log(`File ${filePath} deleted`);
                            }
                        });
                    }, 2 * 1000); // 10 minutes in milliseconds
                }
            });
        } else {
            res.status(404).send('File not found');
        }


    } catch (error) {
        console.log("Error in downloadCCInCLC => ", error)
    }
}


export const clcEdit = async (req, res) => {
    try {
        const { id } = req.params 
        const user = await User.findOne({ _id: req.id })
        const clc = await NewClc.findOne({_id : id})
        res.render("clcEditForm", { user, clc})
    } catch (error) {
        console.log("Error in clcEdit => ", error)
    }
}


export const clcEditPost = async (req, res) => {
    try {
        const { id } = req.params 
        const { fullName, fatherName, motherName, aadharNumber, parmanentAddress, dOB, course, session, dOAdm, classRollNumber, yearOfExam, resultDivision, regNumber, uniRollNumber } = req.body
        const user = await User.findOne({ _id: req.id })
        const clc = await NewClc.findOneAndUpdate({_id : id}, {$set : {
            fullName: fullName.trim(), fatherName: fatherName.trim(), motherName: motherName.trim(), aadharNumber, parmanentAddress: parmanentAddress.trim(), dOB, course, session, dOAdm, classRollNumber: classRollNumber.trim(), yearOfExam, resultDivision, regNumber: regNumber.trim(), uniRollNumber: uniRollNumber.trim(),
        }})
        res.redirect('/clcListAdmin')
    } catch (error) {
        console.log("Error in clcEditPost => ", error)
    }
}


// ====================== Character Certificate ================================
export const cclist = async (req, res) => {
    const filterQueries = req.query;
    try {
        const user = await User.findOne({ _id: req.id })

        const query = {};
        query.isPaid = true
        // Construct the query object based on filterQueries
        if (filterQueries.courseName && filterQueries.courseName !== 'all') {
            query.courseName = filterQueries.courseName;
        }
        if (filterQueries.fullName && filterQueries.fullName !== '') {
            query.fullName = filterQueries.fullName;
        }
        if (filterQueries.collegeRollNumber && filterQueries.collegeRollNumber !== '') {
            query.collegeRollNumber = filterQueries.collegeRollNumber;
        }

        const cclist = await CC.find(query)
        res.render("ccAdmin", { user, cclist })
    } catch (error) {
        console.log("Error in cc list => ", error)
    }
}


export const downloadcc = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ _id: req.id })

        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        const issuedAt = `${day}-${month}-${year}`
        console.log(issuedAt)

        let foundcc = await CC.findOneAndUpdate({ _id: id }, { $set: { issuedAt } })
        //Create pdf
        const document = await PDFDocument.load(readFileSync("./Character.pdf"));
        const courierBoldFont = await document.embedFont(StandardFonts.Courier);
        const firstPage = document.getPage(0);

        firstPage.moveTo(100, 350);
        firstPage.drawText(`${foundcc.serialNo}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(580, 350);
        firstPage.drawText(` ${foundcc.studentId}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(305, 310);
        firstPage.drawText(`${foundcc.fullName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(272, 270);
        firstPage.drawText(`${foundcc.fatherName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(160, 230);
        firstPage.drawText(`${foundcc.motherName}`, {
            font: courierBoldFont,
            size: 18,
        });


        firstPage.moveTo(248, 192);
        firstPage.drawText(`${foundcc.courseName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(600, 192);
        firstPage.drawText(`${foundcc.session}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(200, 152);
        firstPage.drawText(`${foundcc.collegeRollNumber}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(76, 75);
        firstPage.drawText(`: ${issuedAt}`, {
            font: courierBoldFont,
            size: 16,
        });


        writeFileSync("RollNo_" + foundcc.collegeRollNumber + "_Char.pdf", await document.save());
        let filename = "RollNo_" + foundcc.collegeRollNumber + "_Char.pdf"

        const filePath = path.join(filename);
        console.log(filePath);

        if (existsSync(filePath)) {
            // Send the PDF file as a download
            res.download(filePath, `RollNo_${foundcc.collegeRollNumber}_Char.pdf`, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('An error occurred');
                } else {
                    // Delete the file after 10 minutes
                    setTimeout(() => {
                        unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Error deleting file: ${err}`);
                            } else {
                                console.log(`File ${filePath} deleted`);
                            }
                        });
                    }, 2 * 1000); // 10 minutes in milliseconds
                }
            });
        } else {
            res.status(404).send('File not found');
        }


    } catch (error) {
        console.log("Error in cc download => ", error)
    }
}


export const ccEdit = async (req, res) => {
    try {
        const { id } = req.params 
        const user = await User.findOne({ _id: req.id })
        const cc = await CC.findOne({_id : id})
        res.render("ccEditForm", { user, cc})
    } catch (error) {
        console.log("Error in ccEdit => ", error)
    }
}


export const ccEditPost = async (req, res) => {
    try {
        const { id } = req.params 
        const { fullName, fatherName, motherName, courseName, session, collegeRollNumber } = req.body
        const user = await User.findOne({ _id: req.id })
        const clc = await CC.findOneAndUpdate({_id : id}, {$set : {
            fullName: fullName.trim(), fatherName: fatherName.trim(), motherName: motherName.trim(), courseName, session: session.trim(), collegeRollNumber: collegeRollNumber.trim(),
        }})
        res.redirect('/cclist')
    } catch (error) {
        console.log("Error in ccEditPost => ", error)
    }
}


// ====================== TC Certificate ================================
export const tclist = async (req, res) => {
    const filterQueries = req.query;
    try {
        const user = await User.findOne({ _id: req.id })

        const query = {};
        query.isPaid = true
        // Construct the query object based on filterQueries
        if (filterQueries.courseName && filterQueries.courseName !== 'all') {
            query.courseName = filterQueries.courseName;
        }
        if (filterQueries.fullName && filterQueries.fullName !== '') {
            query.fullName = filterQueries.fullName;
        }
        if (filterQueries.collegeRollNumber && filterQueries.collegeRollNumber !== '') {
            query.collegeRollNumber = filterQueries.collegeRollNumber;
        }
        if (filterQueries.mobileNumber && filterQueries.mobileNumber !== '') {
            query.mobileNumber = filterQueries.mobileNumber;
        }

        const tclist = await TC.find(query)
        res.render("tcAdmin", { user, tclist })
    } catch (error) {
        console.log("Error in tc list => ", error)
    }
}


export const downloadtc = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ _id: req.id })

        return res.send("This page is under development. Please Go Back")

        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        const issuedAt = `${day}-${month}-${year}`

        let foundcc = await CC.findOneAndUpdate({ _id: id }, { $set: { issuedAt: issuedAt } })
        //Create pdf
        const document = await PDFDocument.load(readFileSync("./Character.pdf"));
        const courierBoldFont = await document.embedFont(StandardFonts.Courier);
        const firstPage = document.getPage(0);

        firstPage.moveTo(100, 350);
        firstPage.drawText(`${foundcc.serialNo}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(580, 350);
        firstPage.drawText(` ${foundcc.studentId}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(305, 310);
        firstPage.drawText(`${foundcc.fullName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(272, 270);
        firstPage.drawText(`${foundcc.fatherName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(160, 230);
        firstPage.drawText(`${foundcc.motherName}`, {
            font: courierBoldFont,
            size: 18,
        });


        firstPage.moveTo(248, 192);
        firstPage.drawText(`${foundcc.courseName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(600, 192);
        firstPage.drawText(`${foundcc.session}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(200, 152);
        firstPage.drawText(`${foundcc.collegeRollNumber}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(76, 75);
        firstPage.drawText(`: ${foundcc.issuedAt}`, {
            font: courierBoldFont,
            size: 16,
        });


        writeFileSync("RollNo_" + foundcc.collegeRollNumber + "_Char.pdf", await document.save());
        let filename = "RollNo_" + foundcc.collegeRollNumber + "_Char.pdf"

        const filePath = path.join(filename);
        console.log(filePath);

        if (existsSync(filePath)) {
            // Send the PDF file as a download
            res.download(filePath, `RollNo_${foundcc.collegeRollNumber}_Char.pdf`, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('An error occurred');
                } else {
                    // Delete the file after 10 minutes
                    setTimeout(() => {
                        unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Error deleting file: ${err}`);
                            } else {
                                console.log(`File ${filePath} deleted`);
                            }
                        });
                    }, 2 * 1000); // 10 minutes in milliseconds
                }
            });
        } else {
            res.status(404).send('File not found');
        }


    } catch (error) {
        console.log("Error in tc download => ", error)
    }
}


// =========================== Bonafied ========================================
export const bonafiedlist = async (req, res) => {
    const filterQueries = req.query;
    try {
        const user = await User.findOne({ _id: req.id })

        const query = {};
        query.isPaid = true
        // Construct the query object based on filterQueries
        if (filterQueries.courseName && filterQueries.courseName !== 'all') {
            query.courseName = filterQueries.courseName;
        }
        if (filterQueries.fullName && filterQueries.fullName !== '') {
            query.fullName = filterQueries.fullName;
        }
        if (filterQueries.uniRegNumber && filterQueries.uniRegNumber !== '') {
            query.uniRegNumber = filterQueries.uniRegNumber;
        }
        if (filterQueries.mobileNumber && filterQueries.mobileNumber !== '') {
            query.mobileNumber = filterQueries.mobileNumber;
        }

        const bonafiedlist = await Bonafied.find(query)
        res.render("bonafiedAdmin", { user, bonafiedlist })
    } catch (error) {
        console.log("Error in bonafied list => ", error)
    }
}


export const downloadbonafied = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ _id: req.id })
        return res.send("This page is under development. Please Go Back")

        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        const issuedAt = `${day}-${month}-${year}`

        let foundcc = await CC.findOneAndUpdate({ _id: id }, { $set: { issuedAt: issuedAt } })
        //Create pdf
        const document = await PDFDocument.load(readFileSync("./Character.pdf"));
        const courierBoldFont = await document.embedFont(StandardFonts.Courier);
        const firstPage = document.getPage(0);

        firstPage.moveTo(100, 350);
        firstPage.drawText(`${foundcc.serialNo}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(580, 350);
        firstPage.drawText(` ${foundcc.studentId}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(305, 310);
        firstPage.drawText(`${foundcc.fullName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(272, 270);
        firstPage.drawText(`${foundcc.fatherName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(160, 230);
        firstPage.drawText(`${foundcc.motherName}`, {
            font: courierBoldFont,
            size: 18,
        });


        firstPage.moveTo(248, 192);
        firstPage.drawText(`${foundcc.courseName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(600, 192);
        firstPage.drawText(`${foundcc.session}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(200, 152);
        firstPage.drawText(`${foundcc.collegeRollNumber}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(76, 75);
        firstPage.drawText(`: ${foundcc.issuedAt}`, {
            font: courierBoldFont,
            size: 16,
        });


        writeFileSync("RollNo_" + foundcc.collegeRollNumber + "_Char.pdf", await document.save());
        let filename = "RollNo_" + foundcc.collegeRollNumber + "_Char.pdf"

        const filePath = path.join(filename);
        console.log(filePath);

        if (existsSync(filePath)) {
            // Send the PDF file as a download
            res.download(filePath, `RollNo_${foundcc.collegeRollNumber}_Char.pdf`, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('An error occurred');
                } else {
                    // Delete the file after 10 minutes
                    setTimeout(() => {
                        unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Error deleting file: ${err}`);
                            } else {
                                console.log(`File ${filePath} deleted`);
                            }
                        });
                    }, 2 * 1000); // 10 minutes in milliseconds
                }
            });
        } else {
            res.status(404).send('File not found');
        }


    } catch (error) {
        console.log("Error in bonafied download => ", error)
    }
}