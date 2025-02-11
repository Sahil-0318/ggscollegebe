import User from '../models/userModel/userSchema.js'
import clcSchema from '../models/userModel/clcSchema.js'
import AdmissionForm from '../models/userModel/admissionFormSchema.js'
import Notice from '../models/adminModel/noticeSchema.js'
import path from "path"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { writeFileSync, readFileSync } from "fs"
import nodemailer from 'nodemailer'
import Csv from 'json2csv'
const CsvParser = Csv.Parser
import FileUpload from '../fileUpload/fileUpload.js'
import FileDelete from '../fileUpload/fileDelete.js'
import noticeUpload from "../fileUpload/noticeUpload.js"

// UG Regular Sem 1
import ugRegularSem1AdmissionForm from "../models/userModel/ugRegularSem1AdmissionFormSchema.js"
import ugRegularSem1AdmissionPortal from "../models/userModel/ugRegularSem1AdmissionPortalSchema.js"

// UG Regular Sem 3
import ugRegularSem3User from "../models/userModel/UG-Regular-Sem-3/user.js"
import ugRegularSem3AdmissionForm from "../models/userModel/UG-Regular-Sem-3/admForm.js"

// BCA 3 List
import bca3FormModel from "../models/userModel/BCA-3/form.js"
import bca3UserModel from "../models/userModel/BCA-3/user.js"

// UG Regular Part 3
import ugRegularPart3User from "../models/userModel/UG-Regular-Part-3/user.js"
import ugRegularPart3AdmissionForm from "../models/userModel/UG-Regular-Part-3/admForm.js"

// BCA 1 List
import bca1UserModel from "../models/userModel/BCA-1/user.js"
import bca1FormModel from "../models/userModel/BCA-1/form.js"

// BCA 1 List
import bca2UserModel from "../models/userModel/BCA-2/user.js"
import bca2FormModel from "../models/userModel/BCA-2/form.js"

// Inter Exam Form List
import InterExamFormList from "../models/adminModel/interExamFormList.js"
import interExamForm from "../models/userModel/interExamFormSchema.js"

// UG Regular Sem 4
import ugRegularSem4User from "../models/userModel/UG-Regular-Sem-4/user.js"
import ugRegularSem4AdmissionForm from "../models/userModel/UG-Regular-Sem-4/admForm.js"



const adminPage = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const maleStudents = await AdmissionForm.find({ gender: 'Male', isPaid: "true" })
    const femaleStudents = await AdmissionForm.find({ gender: 'Female', isPaid: "true" })
    let NoOfMaleStudents = maleStudents.length
    let NoOfFemaleStudents = femaleStudents.length
    let totalStudents = NoOfMaleStudents + NoOfFemaleStudents
    let studentsNumber = {
      NoOfMaleStudents,
      NoOfFemaleStudents,
      totalStudents
    }

    const noOfStudents = {
      labels: ['Male', 'Female'],
      datasets: [{
        backgroundColor: [
          "rgba(0, 156, 255, .7)",
          "rgba(0, 15, 255, .6)"
        ],
        data: [NoOfMaleStudents, NoOfFemaleStudents]
      }]
    };

    const genStu = await AdmissionForm.find({ isPaid: "true", category: "General" })
    let noOfGenStu = genStu.length
    const bc2Stu = await AdmissionForm.find({ isPaid: "true", category: "BC-2" })
    let noOfBc2Stu = bc2Stu.length
    const bc1Stu = await AdmissionForm.find({ isPaid: "true", category: "BC-1" })
    let noOfBc1Stu = bc1Stu.length
    const scStu = await AdmissionForm.find({ isPaid: "true", category: "SC" })
    let noOfScStu = scStu.length
    const stStu = await AdmissionForm.find({ isPaid: "true", category: "ST" })
    let noOfstStu = stStu.length

    const category = {
      labels: ["General", "BC-2", "BC-1", "SC", "ST"],
      datasets: [{
        backgroundColor: [
          "rgba(0, 156, 255, .7)",
          "rgba(0, 156, 255, .6)",
          "rgba(0, 156, 255, .5)",
          "rgba(0, 156, 255, .4)",
          "rgba(0, 156, 255, .3)"
        ],
        data: [noOfGenStu, noOfBc2Stu, noOfBc1Stu, noOfScStu, noOfstStu]
      }]
    }


    return res.render('adminPage', { studentsNumber, user, noOfStudents, category })
  } catch (error) {
    res.status(401)
  }
}

const admissionFormList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({})
    // console.log(allUser);
    res.render('admissionFormList', { list: AdmissionList, status: "All", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const paidAdmissionFormList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({ isPaid: "true" })
    // console.log(AdmissionList.length);
    res.render('admissionFormList', { list: AdmissionList, status: "Paid", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const unpaidAdmissionFormList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({ isPaid: "false" })
    // console.log(allUser);
    res.render('admissionFormList', { list: AdmissionList, status: "Unpaid", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const genBC2Category = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({ isPaid: "true", admFee: "3000" })
    // console.log(AdmissionList);
    res.render('admissionFormList', { list: AdmissionList, status: "General/BC-2", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const bc1SCSTCategory = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({ isPaid: "true", admFee: "2830" })
    // console.log(allUser);
    res.render('admissionFormList', { list: AdmissionList, status: "BC-1/SC/ST", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const scienceStu = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({ isPaid: "true", course: "I.Sc" })
    // console.log(allUser);
    res.render('admissionFormList', { list: AdmissionList, status: "I.Sc Students", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const artsStu = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({ isPaid: "true", course: "I.A" })
    // console.log(allUser);
    res.render('admissionFormList', { list: AdmissionList, status: "I.A Students", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const findStuInAdmForm = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let { findStuName, findStuRefNo } = req.body
    if (findStuName !== '' && findStuRefNo === "") {
      // console.log(findStuName.toUpperCase());
      // console.log('Without Ref No');
      let AdmissionList = await AdmissionForm.find({ fullName: findStuName.toUpperCase() })
      res.render('admissionFormList', { list: AdmissionList, status: "Found", noOfForms: AdmissionList.length, user })

    } else if (findStuName === '' && findStuRefNo !== "") {
      // console.log(findStuName);
      // console.log('Without Name');
      let AdmissionList = await AdmissionForm.find({ refNo: findStuRefNo })
      res.render('admissionFormList', { list: AdmissionList, status: "Found", noOfForms: AdmissionList.length, user })

    } else if (findStuName !== '' && findStuRefNo !== "") {
      // console.log(findStuName);
      // console.log('With Both');
      let AdmissionList = await AdmissionForm.find({ fullName: findStuName.toUpperCase(), refNo: findStuRefNo })
      res.render('admissionFormList', { list: AdmissionList, status: "Found", noOfForms: AdmissionList.length, user })

    } else {
      const AdmissionList = await AdmissionForm.find({})
      res.render('admissionFormList', { list: AdmissionList, formAlert: "Please, Enter Student Name or Ref No", user })
      // res.render('admissionFormList', { formAlert: "Please, Enter Student Name or Ref No", user })
    }

  } catch (error) {
    res.status(401)
  }
}

const datewiseAdmForm = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let { findAdmDateFrom, findAdmDateTo } = req.body

    let AdmissionList = await AdmissionForm.find({ "createdAt": { $lt: new Date(findAdmDateTo), $gt: new Date(findAdmDateFrom) }, isPaid: "true" })

    res.render('admissionFormList', { list: AdmissionList, status: "Found", noOfForms: AdmissionList.length, user })

  } catch (error) {
    res.status(401)
  }
}

const downloadExcel = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let users = []
    const userData = await AdmissionForm.find({ isPaid: true })
    userData.forEach((admUser) => {
      const { fullName, rollNumber, session, aadharNumber, dOB, gender, nationality, category, religion, fatherName, motherName, parmanentAddress, parmanentAddressPin, presentAddress, presentAddressPin, mobileNumber, email, course, admissionPhoto, studentSign, admNumber, slipNo, admFee, refNo, paymentSS } = admUser

      users.push({
        'Full Name': fullName,
        'Roll No.': rollNumber,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Nationality': nationality,
        'Category': category,
        'Religion': religion,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Parmanent Address': parmanentAddress,
        'Parmanent Address Pin': parmanentAddressPin,
        'Present Address': presentAddress,
        'Present Address Pin': presentAddressPin,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Course': course,
        "Student's Photo": admissionPhoto,
        "Student's Sign": studentSign,
        "Admission Number": admNumber,
        "Slip No.": slipNo,
        "Admission Fee": admFee,
        "Reference No.": refNo,
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=InterAdmissionList.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}

const notice = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })

    let notices = await Notice.find()
    res.render('notice', { notices, user })


  } catch (error) {
    res.status(401)
  }
}

const noticePost = async (req, res) => {
  try {
    const { noticeTitle } = req.body
    // const photoUpload = await FileUpload(req.file.path)
    const photoUpload = await noticeUpload(req.file.path)
    const noticePDF = photoUpload.secure_url
    const notice = new Notice({
      noticeTitle,
      noticePDF
    })

    await notice.save()

    res.redirect('/notice')


  } catch (error) {
    res.status(401)
  }
}

const editNotice = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { id } = req.params
    const editNotice = await Notice.findOne({ _id: id })
    res.render('editNotice', { editNotice, user })


  } catch (error) {
    res.status(401)
  }
}

const editNoticePost = async (req, res) => {
  try {
    const { id } = req.params
    const foundNotice = await Notice.findOne({ _id: id })
    const { noticeTitle } = req.body
    // const photoUpload = await FileUpload(req.file.path)
    const photoUpload = await noticeUpload(req.file.path)
    const noticePDF = photoUpload.secure_url

    await Notice.findOneAndUpdate({ _id: id }, { $set: { noticeTitle, noticePDF } })
    await FileDelete(foundNotice.noticePDF)
    res.redirect('/notice')


  } catch (error) {
    res.status(401)
  }
}

const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params
    const deletedNotice = await Notice.findOneAndDelete({ _id: id })
    await FileDelete(deletedNotice.noticePDF)
    res.redirect('/notice')


  } catch (error) {
    res.status(401)
  }
}

const clcList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const clcList = await clcSchema.find({ status: 'Pending', isPaid: "true" })
    // console.log(clcList);
    res.render('clcList', { clcList, status: "Pending", noOfForms: clcList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const clcApprovedId = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findOne({ _id: req.id })
    const foundClc = await clcSchema.findOneAndUpdate({ _id: id }, { $set: { status: "Approved" } })
    // console.log(foundClc);
    res.redirect('/clcList')
  } catch (error) {
    res.status(401)
  }
}

const clcRejectId = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findOne({ _id: req.id })
    const foundClc = await clcSchema.findOneAndUpdate({ _id: id }, { $set: { status: "Rejected" } })
    // console.log(foundClc);
    res.redirect('/clcList')
  } catch (error) {
    res.status(401)
  }
}

const clcApproved = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findOne({ _id: req.id })
    const clcList = await clcSchema.find({ status: "Approved" })
    // console.log(clcList);
    res.render('clcList', { clcList, status: "Approved", noOfForms: clcList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const clcRejected = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findOne({ _id: req.id })
    const clcList = await clcSchema.find({ status: "Rejected" })
    // console.log(clcList);
    res.render('clcList', { clcList, status: "Rejected", noOfForms: clcList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const approvedByAdmin = async (req, res) => {
  try {

    let reg = req.body.registrationNumber

    const checked = await Clc.findOneAndUpdate({ registrationNumber: reg }, { isApprove: true })
    // console.log(checked);
    const email = checked.email
    const trimmedFname = checked.fName;

    //Create pdf

    const document = await PDFDocument.load(readFileSync("./certificateForm.pdf"));

    const courierBoldFont = await document.embedFont(StandardFonts.Courier);
    const firstPage = document.getPage(0);

    // firstPage.moveTo(72, 570);
    // firstPage.drawText(new Date().toUTCString(), {
    //   font: courierBoldFont,
    //   size: 12,
    // });

    firstPage.moveTo(110, 600);
    firstPage.drawText(`${trimmedFname}${checked.lName}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(110, 585);
    firstPage.drawText(`${checked.collegeClass}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(160, 537);
    firstPage.drawText(`${checked.dOB}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(160, 505);
    firstPage.drawText(`${checked.fatherName}`, {
      font: courierBoldFont,
      size: 10,
    });

    firstPage.moveTo(163, 488);
    firstPage.drawText(`${checked.subTaken}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(420, 600);
    firstPage.drawText(`${checked.classRoll}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(380, 585);
    firstPage.drawText(`${checked.session}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(433, 553);
    firstPage.drawText(`${checked.uniRollNumber}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(421, 537);
    firstPage.drawText(`${checked.registrationNumber}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(428, 505);
    firstPage.drawText(`${checked.yOPUniEx}`, {
      font: courierBoldFont,
      size: 16,
    });

    // writeFileSync(checked.registrationNumber + ".pdf", await document.save());
    writeFileSync("RegNo_" + checked.registrationNumber + "_CLC.pdf", await document.save());


    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      // port: 587,
      port: 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Certificates',
      text: 'Yout CLC approved... 🎉',
      attachments: [{
        filename: "RegNo_" + checked.registrationNumber + "_CLC.pdf",
        path: path.join("RegNo_" + checked.registrationNumber + "_CLC.pdf")
      }]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });


    // console.log(reg);
    res.status(201).redirect('/clcList');

  } catch (err) {
    res.status(400).send(err);

  }
}



// UG Regular Sem 1 List
const ugRegularSem1List = async (req, res) => {
  const filterQueries = req.query;
  try {
    // Find the user based on request ID
    const user = await User.findOne({ _id: req.id });

    // Initialize the query object
    const query = {};
    let status = "All"

    // Construct the query object based on filterQueries
    if (filterQueries.isPaid && filterQueries.isPaid !== 'all') {
      query.isPaid = filterQueries.isPaid === 'true';
      if (query.isPaid == true) {
        status = "Paid"
      } else {
        status = "Unpaid"
      }
    }
    if (filterQueries.category && filterQueries.category !== 'all') {
      query.category = filterQueries.category;
      status += " " + query.category
    }
    if (filterQueries.gender && filterQueries.gender !== 'all') {
      query.gender = filterQueries.gender;
      status += " " + query.gender
    }

    // Find students based on the constructed query
    const ugRegularSem1AdmissionList = await ugRegularSem1AdmissionForm.find(query)
    // console.log(ugRegularSem1AdmissionList);
    res.render('ugRegularSem1List', { list: ugRegularSem1AdmissionList, status, noOfForms: ugRegularSem1AdmissionList.length, user })
  } catch (error) {
    console.log(error);
  }
}

const findStuInUGRegSem1Adm = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let { findStuRefNo } = req.body

    if (findStuRefNo !== '') {
      let foundStudent = await ugRegularSem1AdmissionForm.find({ referenceNumber: findStuRefNo })
      res.render('ugRegularSem1List', { list: foundStudent, status: "Found", noOfForms: foundStudent.length, user })

    } else if (findStuRefNo === '') {
      const foundStudent = await ugRegularSem1AdmissionForm.find({ isPaid: true })
      res.render('ugRegularSem1List', { list: foundStudent, status: "All", formAlert: "Please, Enter Ref No", noOfForms: foundStudent.length, user })
    }

  } catch (error) {
    console.log(error);
  }
}

const ugRegSem1StuView = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundStudent = await ugRegularSem1AdmissionForm.findOne({ _id: stuId })
    const foundStudentID = await ugRegularSem1AdmissionPortal.findOne({ _id: foundStudent.appliedBy })

    res.render('studentView', { foundStudent, foundStudentID, user })
  } catch (error) {
    console.log(error)
  }
}

const ugRegSem1StuEdit = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params
    const foundStudent = await ugRegularSem1AdmissionForm.findOne({ _id: stuId })
    const foundStudentID = await ugRegularSem1AdmissionPortal.findOne({ _id: foundStudent.appliedBy })
    res.render("ugRegularSem1StudentEdit", { user, foundStudent, foundStudentID })
  } catch (error) {
    console.log(error)
  }
}

const ugRegSem1StuEditPost = async (req, res) => {
  try {
    let { studentName, fatherName, motherName, guardianName, referenceNumber, ppuConfidentialNumber, applicantId, course, email, paper1, paper2, paper3, paper4, paper5, paper6, dOB, gender, category, religion, familyAnnualIncome, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } = req.body
    const { editId } = req.params

    if (gender === "MALE") {
      if (course === "Bachelor of Science" || paper1 === "Psychology") {
        if (category === "GENERAL" || category === "BC-2") {
          admissionFee = 3455
        } else if (category === "BC-1") {
          admissionFee = 2855
        } else {
          admissionFee = 1200
        }
      } else {
        if (category === "GENERAL" || category === "BC-2") {
          admissionFee = 2855
        } else if (category === "BC-1") {
          admissionFee = 2255
        } else {
          admissionFee = 600
        }
      }

    } else {
      if (course === "Bachelor of Science" || paper1 === "Psychology") {
        admissionFee = 1200
      } else {
        admissionFee = 600
      }
    }

    await ugRegularSem1AdmissionForm.findOneAndUpdate({ _id: editId }, { $set: { studentName, fatherName, motherName, guardianName, referenceNumber, ppuConfidentialNumber, applicantId, email, paper1, paper2, paper3, paper4, paper5, paper6, dOB, gender, category, religion, familyAnnualIncome, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } })

    const foundUserLogin = await ugRegularSem1AdmissionForm.findOne({ _id: editId })
    await ugRegularSem1AdmissionPortal.findOneAndUpdate({ _id: foundUserLogin.appliedBy }, { $set: { course, referenceNumber, mobileNumber } })

    res.redirect('/ugRegularSem1List')
  } catch (error) {
    console.log(error)
  }
}

const datewiseUgRegSem1List = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let { course, findAdmDateFrom, findAdmDateTo } = req.body
    console.log(course)

    const changedate = (date) => {
      let originalDate = date;
      // Split the date string
      let parts = originalDate.split("-");
      // Rearrange and join the parts
      let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      return formattedDate
    }

    let results = ""
    let status = ""

    // subject query function
    let subjectQuery = (subject) => {
      let query = {
        dateAndTimeOfPayment: {
          $gte: changedate(findAdmDateFrom) + " 00:00:00",
          $lte: changedate(findAdmDateTo) + " 23:59:59"
        },
        isPaid: true,
        paper1: subject
      };
      return query
    }


    // drop down list query
    if (course === "All courses") {
      let query = {
        dateAndTimeOfPayment: {
          $gte: changedate(findAdmDateFrom) + " 00:00:00",
          $lte: changedate(findAdmDateTo) + " 23:59:59"
        },
        isPaid: true
      };

      results = await ugRegularSem1AdmissionForm.find(query)
      status = "All"
    } else if (course === "Bachelor of Arts") {

      let EconomicsResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Economics"))
      let HistoryResult = await ugRegularSem1AdmissionForm.find(subjectQuery("History"))
      let PoliticalScienceResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Political Science"))
      let PsychologyResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Psychology"))
      let SociologyResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Sociology"))
      let EnglishResult = await ugRegularSem1AdmissionForm.find(subjectQuery("English"))
      let HindiResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Hindi"))
      let UrduResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Urdu"))
      let PhilosophyResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Philosophy"))

      results = [...EconomicsResult, ...HistoryResult, ...PoliticalScienceResult, ...PsychologyResult, ...SociologyResult, ...EnglishResult, ...HindiResult, ...UrduResult, ...PhilosophyResult]
      status = "Bachelor of Arts"

    } else if (course === "Bachelor of Science") {

      let PhysicsResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Physics"))
      let ChemistryResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Chemistry"))
      let ZoologyResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Zoology"))
      let BotanyResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Botany"))
      let MathematicsResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Mathematics"))

      results = [...PhysicsResult, ...ChemistryResult, ...ZoologyResult, ...BotanyResult, ...MathematicsResult]
      status = "Bachelor of Science"
    } else if (course === "Economics") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Economics"))
      status = "Economics"
    } else if (course === "History") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("History"))
      status = "History"

    } else if (course === "Political Science") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Political Science"))
      status = "Political Science"

    } else if (course === "Psychology") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Psychology"))
      status = "Psychology"

    } else if (course === "Sociology") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Sociology"))
      status = "Sociology"

    } else if (course === "English") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("English"))
      status = "English"

    } else if (course === "Hindi") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Hindi"))
      status = "Hindi"

    } else if (course === "Urdu") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Urdu"))
      status = "Urdu"

    } else if (course === "Philosophy") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Philosophy"))
      status = "Philosophy"

    } else if (course === "Physics") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Physics"))
      status = "Physics"

    } else if (course === "Chemistry") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Chemistry"))
      status = "Chemistry"

    } else if (course === "Zoology") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Zoology"))
      status = "Zoology"

    } else if (course === "Botany") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Botany"))
      status = "Botany"

    } else if (course === "Mathematics") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Mathematics"))
      status = "Mathematics"
    }
    console.log(results.length);

    res.render('ugRegularSem1List', { course, findAdmDateFrom, findAdmDateTo, list: results, status, noOfForms: results.length, user })

  } catch (error) {
    console.log(error)
  }
}

const UG_Reg_Sem_I_Adm_List = async (req, res) => {
  try {
    let users = []
    const userData = await ugRegularSem1AdmissionForm.find({ isPaid: true })

    console.log(userData.length)

    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, referenceNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, ppuConfidentialNumber, studentPhoto, studentSign, session, collegeRollNo, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"

      } else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"

      } else {
        course = "Bachelor of Science"

      }

      users.push({
        'Student Name': studentName,
        'College Roll No.': collegeRollNo.slice(2),
        'Reference Number': referenceNumber,
        'PPU Confidential Number': ppuConfidentialNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        'VAC-1': paper6,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_I_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}

const UG_Reg_Sem_I_BA_Adm_List = async (req, res) => {
  try {
    let users = []
    const economicsStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Economics" })
    const historyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "History" })
    const politicalScienceStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Political Science" })
    const psychologyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Psychology" })
    const sociologyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Sociology" })
    const englishStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "English" })
    const hindiStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Hindi" })
    const urduStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Urdu" })
    const philosophyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Philosophy" })

    console.log(economicsStudents.length, historyStudents.length, politicalScienceStudents.length, psychologyStudents.length, sociologyStudents.length)

    const userData = [...economicsStudents, ...historyStudents, ...politicalScienceStudents, ...psychologyStudents, ...sociologyStudents, ...englishStudents, ...hindiStudents, ...urduStudents, ...philosophyStudents].sort((a, b) => a.collegeRollNo.slice(2) - b.collegeRollNo.slice(2))

    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, referenceNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, ppuConfidentialNumber, studentPhoto, studentSign, session, collegeRollNo, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"

      } else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"

      } else {
        course = "Bachelor of Science"

      }

      users.push({
        'Student Name': studentName,
        'College Roll No.': collegeRollNo.slice(2),
        'Reference Number': referenceNumber,
        'PPU Confidential Number': ppuConfidentialNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        'VAC-1': paper6,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_I_BA_SS_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}

const UG_Reg_Sem_I_BA_SS_Adm_List = async (req, res) => {
  try {
    let users = []
    const economicsStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Economics" })
    const historyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "History" })
    const politicalScienceStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Political Science" })
    const psychologyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Psychology" })
    const sociologyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Sociology" })

    console.log(economicsStudents.length, historyStudents.length, politicalScienceStudents.length, psychologyStudents.length, sociologyStudents.length)

    const userData = [...economicsStudents, ...historyStudents, ...politicalScienceStudents, ...psychologyStudents, ...sociologyStudents].sort((a, b) => a.collegeRollNo.slice(2) - b.collegeRollNo.slice(2))

    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, referenceNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, ppuConfidentialNumber, studentPhoto, studentSign, session, collegeRollNo, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"

      } else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"

      } else {
        course = "Bachelor of Science"

      }

      users.push({
        'Student Name': studentName,
        'College Roll No.': collegeRollNo.slice(2),
        'Reference Number': referenceNumber,
        'PPU Confidential Number': ppuConfidentialNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        'VAC-1': paper6,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_I_BA_SS_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}

const UG_Reg_Sem_I_BA_Hum_Adm_List = async (req, res) => {
  try {
    let users = []
    const englishStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "English" })
    const hindiStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Hindi" })
    const urduStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Urdu" })
    const philosophyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Philosophy" })

    console.log(englishStudents.length, hindiStudents.length, urduStudents.length, philosophyStudents.length)

    const userData = [...englishStudents, ...hindiStudents, ...urduStudents, ...philosophyStudents].sort((a, b) => a.collegeRollNo.slice(2) - b.collegeRollNo.slice(2))

    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, referenceNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, ppuConfidentialNumber, studentPhoto, studentSign, session, collegeRollNo, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"

      } else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"

      } else {
        course = "Bachelor of Science"

      }

      users.push({
        'Student Name': studentName,
        'College Roll No.': collegeRollNo.slice(2),
        'Reference Number': referenceNumber,
        'PPU Confidential Number': ppuConfidentialNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        'VAC-1': paper6,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_I_BA_Hum_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}

const UG_Reg_Sem_I_BSc_Adm_List = async (req, res) => {
  try {
    let users = []
    const physicsStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Physics" })
    const chemistryStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Chemistry" })
    const zoologyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Zoology" })
    const botanyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Botany" })
    const mathematicsStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1: "Mathematics" })
    console.log(physicsStudents.length, chemistryStudents.length, zoologyStudents.length, botanyStudents.length, mathematicsStudents.length)

    const userData = [...physicsStudents, ...chemistryStudents, ...zoologyStudents, ...botanyStudents, ...mathematicsStudents].sort((a, b) => a.collegeRollNo.slice(2) - b.collegeRollNo.slice(2))

    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, referenceNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, ppuConfidentialNumber, studentPhoto, studentSign, session, collegeRollNo, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"

      } else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"

      } else {
        course = "Bachelor of Science"

      }

      users.push({
        'Student Name': studentName,
        'College Roll No.': collegeRollNo.slice(2),
        'Reference Number': referenceNumber,
        'PPU Confidential Number': ppuConfidentialNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        'VAC-1': paper6,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_I_BSc_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}

const ugRegSem1Password = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const userIdAndPasswordList = await ugRegularSem1AdmissionPortal.find({})
    res.render("ugRegSem1PasswordList", { list: userIdAndPasswordList, status: "All", noOfForms: userIdAndPasswordList.length, user })
  } catch (error) {
    console.log(error)
  }

}

const editUserId = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { id } = req.params

    const foundStudent = await ugRegularSem1AdmissionPortal.findOne({ _id: id })
    const selectedValue = foundStudent.course
    console.log(selectedValue)
    // const foundStudentID = await ugRegularSem1AdmissionPortal.findOne({ _id: foundStudent.appliedBy })
    res.render("editUserIdForm", { selectedValue, foundStudent, user })

  } catch (error) {
    console.log(error)
  }
}

const editUserIdPost = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { editId } = req.params
    const { course, referenceNumber, mobileNumber, userId, password } = req.body
    // console.log(editId, course, mobNo)

    await ugRegularSem1AdmissionPortal.findOneAndUpdate({ _id: editId }, { $set: { course, referenceNumber, mobileNumber, userId, password } })

    res.redirect('/ugRegSem1Password')

  } catch (error) {
    console.log(error)
  }
}

const findUserId = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { findStuRefNo } = req.body

    if (findStuRefNo !== '') {
      let foundStudent = await ugRegularSem1AdmissionPortal.find({ referenceNumber: findStuRefNo })
      res.render("ugRegSem1PasswordList", { list: foundStudent, status: "Found", noOfForms: foundStudent.length, user })

    } else if (findStuRefNo === '') {
      const foundStudent = await ugRegularSem1AdmissionPortal.find({})
      res.render("ugRegSem1PasswordList", { list: foundStudent, status: "All", formAlert: "Please, Enter Ref No", noOfForms: foundStudent.length, user })
    }

  } catch (error) {
    console.log(error)
  }
}


// UG Regular Sem 3 List
const ugRegularSem3List = async (req, res) => {
  const filterQueries = req.query;
  try {
    // Find the user based on request ID
    const user = await User.findOne({ _id: req.id });

    // Initialize the query object
    const query = {};
    let status = "All"

    // Construct the query object based on filterQueries
    if (filterQueries.isPaid && filterQueries.isPaid !== 'all') {
      query.isPaid = filterQueries.isPaid === 'true';
      if (query.isPaid == true) {
        status = "Paid"
      } else {
        status = "Unpaid"
      }
    }
    if (filterQueries.category && filterQueries.category !== 'all') {
      query.category = filterQueries.category;
      status += " " + query.category
    }
    if (filterQueries.gender && filterQueries.gender !== 'all') {
      query.gender = filterQueries.gender;
      status += " " + query.gender
    }

    // Find students based on the constructed query
    const ugRegularSem1AdmissionList = await ugRegularSem3AdmissionForm.find(query)

    // console.log(ugRegularSem1AdmissionList);
    res.render('ugRegularSem3List', { list: ugRegularSem1AdmissionList, status, noOfForms: ugRegularSem1AdmissionList.length, user })
  } catch (error) {
    console.log(error);
  }
}


const findStuInUGRegSem3Adm = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let { findStuMobileNo } = req.body

    if (findStuMobileNo !== '') {
      let foundStudent = await ugRegularSem3AdmissionForm.find({ mobileNumber: findStuMobileNo })
      res.render('ugRegularSem3List', { list: foundStudent, status: "Found", noOfForms: foundStudent.length, user })

    } else if (findStuMobileNo === '') {
      const foundStudent = await ugRegularSem3AdmissionForm.find({ isPaid: true })
      res.render('ugRegularSem3List', { list: foundStudent, status: "All", formAlert: "Please, Enter Mobile No", noOfForms: foundStudent.length, user })
    }

  } catch (error) {
    console.log(error);
  }
}


const ugRegSem3StuView = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundStudent = await ugRegularSem3AdmissionForm.findOne({ _id: stuId })
    const foundStudentID = await ugRegularSem3User.findOne({ _id: foundStudent.appliedBy })

    res.render('ugRegularSem3StudentView', { foundStudent, foundStudentID, user })
  } catch (error) {
    console.log(error)
  }
}


const ugRegSem3StuEdit = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params
    const foundStudent = await ugRegularSem3AdmissionForm.findOne({ _id: stuId })
    const foundStudentID = await ugRegularSem3User.findOne({ _id: foundStudent.appliedBy })
    res.render("ugRegularSem3StudentEdit", { user, foundStudent, foundStudentID })
  } catch (error) {
    console.log(error)
  }
}


const ugRegSem3StuEditPost = async (req, res) => {
  try {
    let { studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, course, email, paper1, paper2, paper3, paper4, paper5, dOB, gender, category, religion, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } = req.body
    const { editId } = req.params

    if (gender === "MALE") {
      if (course === "Bachelor of Science" || paper1 === "Psychology") {
        if (category === "GENERAL" || category === "BC-2") {
          admissionFee = 2755
        } else if (category === "BC-1") {
          admissionFee = 2155
        } else {
          admissionFee = 1350
        }
      } else {
        if (category === "GENERAL" || category === "BC-2") {
          admissionFee = 2155
        } else if (category === "BC-1") {
          admissionFee = 1555
        } else {
          admissionFee = 750
        }
      }

    } else {
      if (course === "Bachelor of Science" || paper1 === "Psychology") {
        admissionFee = 1350
      } else {
        admissionFee = 750
      }
    }

    await ugRegularSem3AdmissionForm.findOneAndUpdate({ _id: editId }, { $set: { studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, email, paper1, paper2, paper3, paper4, paper5, dOB, gender, category, religion, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } })

    const foundUserLogin = await ugRegularSem3AdmissionForm.findOne({ _id: editId })
    await ugRegularSem3User.findOneAndUpdate({ _id: foundUserLogin.appliedBy }, { $set: { fullName: studentName, course, email, mobileNumber } })

    res.redirect('/ugRegularSem3List')
  } catch (error) {
    console.log(error)
  }
}


const UG_Reg_Sem_III_Adm_List = async (req, res) => {
  try {
    const userData = await ugRegularSem3AdmissionForm.find({ isPaid: true })

    console.log(userData.length)

    const users = userData.map(admUser => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser;

      let course = "";
      if (["Economics", "History", "Political Science", "Psychology", "Sociology"].includes(paper1)) {
        course = "Bachelor of Arts (Social Science Subjects)";
      } else if (["English", "Hindi", "Urdu", "Philosophy"].includes(paper1)) {
        course = "Bachelor of Arts (Humanities Subjects)";
      } else {
        course = "Bachelor of Science";
      }

      return {
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Religion': religion,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `Add - ${address}, District - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=UG_Reg_Sem_III_BA_Adm_List.csv");

    res.status(200).end(csvData);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Server Error');
  }
};


const UG_Reg_Sem_III_BA_Adm_List = async (req, res) => {
  try {
    const subjects = ["Economics", "History", "Political Science", "Psychology", "Sociology", "English", "Hindi", "Urdu", "Philosophy"];
    const promises = subjects.map(subject => ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: subject }));
    const studentsBySubject = await Promise.all(promises);

    const userData = studentsBySubject.flat().sort((a, b) => a.collegeRollNumber - b.collegeRollNumber);

    const users = userData.map(admUser => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser;

      let course = "";
      if (["Economics", "History", "Political Science", "Psychology", "Sociology"].includes(paper1)) {
        course = "Bachelor of Arts (Social Science Subjects)";
      } else if (["English", "Hindi", "Urdu", "Philosophy"].includes(paper1)) {
        course = "Bachelor of Arts (Humanities Subjects)";
      } else {
        course = "Bachelor of Science";
      }

      return {
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Religion': religion,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `Add - ${address}, District - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=UG_Reg_Sem_III_BA_Adm_List.csv");

    res.status(200).end(csvData);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Server Error');
  }
};


const UG_Reg_Sem_III_BA_SS_Adm_List = async (req, res) => {
  try {
    let users = []
    const economicsStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "Economics" })
    const historyStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "History" })
    const politicalScienceStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "Political Science" })
    const psychologyStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "Psychology" })
    const sociologyStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "Sociology" })

    console.log(economicsStudents.length, historyStudents.length, politicalScienceStudents.length, psychologyStudents.length, sociologyStudents.length)

    const userData = [...economicsStudents, ...historyStudents, ...politicalScienceStudents, ...psychologyStudents, ...sociologyStudents].sort((a, b) => a.collegeRollNumber - b.collegeRollNumber)


    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"

      } else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"

      } else {
        course = "Bachelor of Science"

      }

      users.push({
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Religion': religion,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `Add - ${address}, District - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_III_BA_SS_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}


const UG_Reg_Sem_III_BA_Hum_Adm_List = async (req, res) => {
  try {
    let users = []
    const englishStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "English" })
    const hindiStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "Hindi" })
    const urduStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "Urdu" })
    const philosophyStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "Philosophy" })

    console.log(englishStudents.length, hindiStudents.length, urduStudents.length, philosophyStudents.length)

    const userData = [...englishStudents, ...hindiStudents, ...urduStudents, ...philosophyStudents].sort((a, b) => a.collegeRollNumber - b.collegeRollNumber)


    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"

      } else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"

      } else {
        course = "Bachelor of Science"

      }

      users.push({
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Religion': religion,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_III_BA_Hum_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}


const UG_Reg_Sem_III_BSc_Adm_List = async (req, res) => {
  try {
    let users = []
    const physicsStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "Physics" })
    const chemistryStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "Chemistry" })
    const zoologyStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "Zoology" })
    const botanyStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "Botany" })
    const mathematicsStudents = await ugRegularSem3AdmissionForm.find({ isPaid: true, paper1: "Mathematics" })
    console.log(physicsStudents.length, chemistryStudents.length, zoologyStudents.length, botanyStudents.length, mathematicsStudents.length)

    const userData = [...physicsStudents, ...chemistryStudents, ...zoologyStudents, ...botanyStudents, ...mathematicsStudents].sort((a, b) => a.collegeRollNumber - b.collegeRollNumber)


    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"

      } else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"

      } else {
        course = "Bachelor of Science"

      }

      users.push({
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Religion': religion,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_III_BSc_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}

// BCA Part 3
const bca3List = async (req, res) => {
  const filterQueries = req.query;
  try {
    // Find the user based on request ID
    const user = await User.findOne({ _id: req.id });

    // Initialize the query object
    const query = {};
    let status = "All"

    // Construct the query object based on filterQueries
    if (filterQueries.isPaid && filterQueries.isPaid !== 'all') {
      query.isPaid = filterQueries.isPaid === 'true';
      if (query.isPaid == true) {
        status = "Paid"
      } else {
        status = "Unpaid"
      }
    }
    if (filterQueries.category && filterQueries.category !== 'all') {
      query.category = filterQueries.category;
      status += " " + query.category
    }
    if (filterQueries.gender && filterQueries.gender !== 'all') {
      query.gender = filterQueries.gender;
      status += " " + query.gender
    }

    // Find students based on the constructed query
    const bca3AdmissionList = await bca3FormModel.find(query)
    // console.log(bca3AdmissionList);
    res.render('bca3List', { list: bca3AdmissionList, status, noOfForms: bca3AdmissionList.length, user })
  } catch (error) {
    console.log("Error in get bca3List", error);
  }
}


const findStuInbca3Adm = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let { findStuMobileNo } = req.body
    if (findStuMobileNo !== '') {
      let foundStudent = await bca3FormModel.find({ mobileNumber: findStuMobileNo })
      res.render('bca3List', { list: foundStudent, status: "Found", noOfForms: foundStudent.length, user })

    } else if (findStuMobileNo === '') {
      const foundStudent = await bca3FormModel.find({ isPaid: true })
      res.render('bca3List', { list: foundStudent, status: "All", formAlert: "Please, Enter Mobile No", noOfForms: foundStudent.length, user })
    }
  } catch (error) {
    console.log("Error in post findStuInbca3Adm", error)
  }
}


const bca3StuView = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundStudent = await bca3FormModel.findOne({ _id: stuId })

    res.render('bca3StudentView', { foundStudent, user })
  } catch (error) {
    console.log("Error in get bca3StuView", error)
  }
}


const bca3StuEdit = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params
    const foundStudent = await bca3FormModel.findOne({ _id: stuId })
    res.render("bca3StudentEdit", { user, foundStudent })
  } catch (error) {
    console.log("Error in get bca3StuEdit", error)
  }
}


const bca3StuEditPost = async (req, res) => {
  try {
    const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } = req.body
    const { editId } = req.params

    await bca3FormModel.findOneAndUpdate({ _id: editId }, { $set: { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } })

    const foundUserLogin = await bca3FormModel.findOne({ _id: editId })
    await bca3UserModel.findOneAndUpdate({ _id: foundUserLogin.appliedBy }, { $set: { fullName: studentName, email, mobileNumber } })

    res.redirect('/bca3List')
  } catch (error) {
    console.log("Error in post bca3StuEditPost", error)

  }
}


const BCA_Adm_List = async (req, res) => {
  try {
    const studentsBySubject = await bca3FormModel.find({ isPaid: true })

    const userData = studentsBySubject.sort((a, b) => a.collegeRollNumber - b.collegeRollNumber);

    const users = userData.map(admUser => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, subject, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser;

      return {
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': "BCA",
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Subject': subject,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=BCA_Adm_List.csv");

    res.status(200).end(csvData);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Server Error');
  }
}


// UG Regular Part 3
const ugRegularPart3List = async (req, res) => {
  const filterQueries = req.query;
  try {
    // Find the user based on request ID
    const user = await User.findOne({ _id: req.id });

    // Initialize the query object
    const query = {};
    let status = "All"

    // Construct the query object based on filterQueries
    if (filterQueries.isPaid && filterQueries.isPaid !== 'all') {
      query.isPaid = filterQueries.isPaid === 'true';
      if (query.isPaid == true) {
        status = "Paid"
      } else {
        status = "Unpaid"
      }
    }
    if (filterQueries.category && filterQueries.category !== 'all') {
      query.category = filterQueries.category;
      status += " " + query.category
    }
    if (filterQueries.gender && filterQueries.gender !== 'all') {
      query.gender = filterQueries.gender;
      status += " " + query.gender
    }

    // Find students based on the constructed query
    const ugRegularPart3AdmissionList = await ugRegularPart3AdmissionForm.find(query);



    // Render the template with the filtered list
    res.render('ugRegularPart3List', {
      list: ugRegularPart3AdmissionList,
      noOfForms: ugRegularPart3AdmissionList.length,
      user,
      status
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
}


const findStuInUGRegPart3Adm = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let { findStuMobileNo } = req.body

    if (findStuMobileNo !== '') {
      let foundStudent = await ugRegularPart3AdmissionForm.find({ mobileNumber: findStuMobileNo })
      res.render('ugRegularPart3List', { list: foundStudent, status: "Found", noOfForms: foundStudent.length, user })

    } else if (findStuMobileNo === '') {
      const foundStudent = await ugRegularPart3AdmissionForm.find({ isPaid: true })
      res.render('ugRegularPart3List', { list: foundStudent, status: "All", formAlert: "Please, Enter Mobile No", noOfForms: foundStudent.length, user })
    }

  } catch (error) {
    console.log(error);
  }
}


const ugRegPart3StuView = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundStudent = await ugRegularPart3AdmissionForm.findOne({ _id: stuId })
    const foundStudentID = await ugRegularPart3User.findOne({ _id: foundStudent.appliedBy })

    res.render('ugRegularPart3StudentView', { foundStudent, foundStudentID, user })
  } catch (error) {
    console.log(error)
  }
}


const ugRegPart3StuEdit = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params
    const foundStudent = await ugRegularPart3AdmissionForm.findOne({ _id: stuId })
    const foundStudentID = await ugRegularPart3User.findOne({ _id: foundStudent.appliedBy })
    res.render("ugRegularPart3StudentEdit", { user, foundStudent, foundStudentID })
  } catch (error) {
    console.log(error)
  }
}


const ugRegPart3StuEditPost = async (req, res) => {
  try {
    let { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, course, email, paper1, paper2, dOB, gender, category, religion, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } = req.body
    const { editId } = req.params

    if (gender === "MALE") {
      if (category === "GENERAL" || category === "BC-2") {
        admissionFee = 3330
      } else if (category === "BC-1") {
        admissionFee = 3160
      } else {
        admissionFee = 1100
      }

    } else {
      admissionFee = 1100
    }

    await ugRegularPart3AdmissionForm.findOneAndUpdate({ _id: editId }, { $set: { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, course, email, paper1, paper2, dOB, gender, category, religion, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } })

    const foundUserLogin = await ugRegularPart3AdmissionForm.findOne({ _id: editId })
    await ugRegularPart3User.findOneAndUpdate({ _id: foundUserLogin.appliedBy }, { $set: { fullName: studentName, course, email, mobileNumber } })

    res.redirect('/ugRegularPart3List')
  } catch (error) {
    console.log(error)
  }
}


const UG_Reg_Part_III_Adm_List = async (req, res) => {
  try {
    const userData = await ugRegularPart3AdmissionForm.find({ isPaid: true })

    console.log(userData.length)

    const users = userData.map(admUser => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, course, email, dOB, gender, religion, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser;

      return {
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Religion': religion,
        'MJC-1': paper1,
        'MIC-1': paper2,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=UG_Reg_Part_III_Adm_List.csv");

    res.status(200).end(csvData);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Server Error');
  }
}


const UG_Reg_Part_III_BA_Adm_List = async (req, res) => {
  try {
    const subjects = ["Economics", "History", "Political Science", "Psychology", "Sociology", "English", "Hindi", "Urdu", "Philosophy"];
    const promises = subjects.map(subject => ugRegularPart3AdmissionForm.find({ isPaid: true, paper1: subject }));
    const studentsBySubject = await Promise.all(promises);

    const userData = studentsBySubject.flat().sort((a, b) => a.collegeRollNumber - b.collegeRollNumber);

    const users = userData.map(admUser => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, course, email, dOB, gender, religion, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser;

      return {
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Religion': religion,
        'MJC-1': paper1,
        'MIC-1': paper2,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=UG_Reg_Part_III_BA_Adm_List.csv");

    res.status(200).end(csvData);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Server Error');
  }
}


const UG_Reg_Part_III_BSc_Adm_List = async (req, res) => {
  try {
    const subjects = ["Physics", "Chemistry", "Zoology", "Botany", "Mathematics"];
    const promises = subjects.map(subject => ugRegularPart3AdmissionForm.find({ isPaid: true, paper1: subject }));
    const studentsBySubject = await Promise.all(promises);

    const userData = studentsBySubject.flat().sort((a, b) => a.collegeRollNumber - b.collegeRollNumber);

    const users = userData.map(admUser => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, course, email, dOB, gender, religion, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser;
      console.log(course)

      return {
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Religion': religion,
        'MJC-1': paper1,
        'MIC-1': paper2,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=UG_Reg_Part_III_BSc_Adm_List.csv");

    res.status(200).end(csvData);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Server Error');
  }
}


const oldClcList = async (req, res) => {
  try {
    let users = []

    const userData = await clcSchema.find()

    userData.forEach((admUser) => {
      const { _id, fullName, fatherName, motherName, aadharNumber, parmanentAddress, dOB, course, session, dOAdm, classRollNumber, yearOfExam, resultDivision, regNumber, uniRollNumber, remark, serialNo, studentId, isPaid, isIssued, isCharIssued, clcFee, paymentSS, refNo, clcFeePayDate, dOLC, dOCC, certificateType, status, appliedBy, createdAt, updatedAt, __v } = admUser

      users.push({
        _id, fullName, fatherName, motherName, aadharNumber, parmanentAddress, dOB, course, session, dOAdm, classRollNumber, yearOfExam, resultDivision, regNumber, uniRollNumber, remark, serialNo, studentId, isPaid, isIssued, isCharIssued, clcFee, paymentSS, refNo, clcFeePayDate, dOLC, dOCC, certificateType, status, appliedBy, createdAt, updatedAt, __v
      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_I_BSc_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}


// BCA Part 1
const bca1List = async (req, res) => {
  const filterQueries = req.query;
  // console.log(filterQueries)
  try {
    // Find the user based on request ID
    const user = await User.findOne({ _id: req.id });

    // Initialize the query object
    const query = {};
    let status = "All"

    if (filterQueries.mobileNumber && filterQueries.mobileNumber !== '') {
      query.mobileNumber = filterQueries.mobileNumber;
      status = "Found"
    }

    // Construct the query object based on filterQueries
    if (filterQueries.collegeRollNumber && filterQueries.collegeRollNumber !== 'all') {
      if (filterQueries.collegeRollNumber === "Haven't Roll No") {
        query.collegeRollNumber = 'NA';
        status = "Found"
      } 
    }
    if (filterQueries.category && filterQueries.category !== 'all') {
      query.category = filterQueries.category;
      status += " " + query.category
    }
    if (filterQueries.gender && filterQueries.gender !== 'all') {
      query.gender = filterQueries.gender;
      status += " " + query.gender
    }

    // console.log(query)

    // Find students based on the constructed query
    const bca1AdmissionList = await bca1FormModel.find(query)
    // console.log(bca1AdmissionList);
    res.render('bca1List', { list: bca1AdmissionList, status, noOfForms: bca1AdmissionList.length, user })
  } catch (error) {
    console.log("Error in get bca1List", error);
  }
}


const bca1StuView = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundStudent = await bca1FormModel.findOne({ _id: stuId })

    res.render('bca1StudentView', { foundStudent, user })
  } catch (error) {
    console.log("Error in get bca1StuView", error)
  }
}


const bca1StuEdit = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params
    const foundStudent = await bca1FormModel.findOne({ _id: stuId })
    res.render("bca1StudentEdit", { user, foundStudent })
  } catch (error) {
    console.log("Error in get bca1StuEdit", error)
  }
}


const bca1StuEditPost = async (req, res) => {
  try {
    const { fullName, fatherName, motherName, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee } = req.body
    const { editId } = req.params

    await bca1FormModel.findOneAndUpdate({ _id: editId }, { $set: { fullName, fatherName, motherName, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee } })

    const foundUserLogin = await bca1FormModel.findOne({ _id: editId })
    await bca1UserModel.findOneAndUpdate({ _id: foundUserLogin.appliedBy }, { $set: { fullName, email, mobileNumber } })

    res.redirect('/bca1List')
  } catch (error) {
    console.log("Error in post bca1StuEditPost", error)

  }
}


const BCA_Adm_List_Part_1 = async (req, res) => {
  try {
    const studentsBySubject = await bca1FormModel.find({ collegeRollNumber: { $ne: "NA" } })
    // console.log(studentsBySubject)

    const userData = studentsBySubject.sort((a, b) => a.collegeRollNumber - b.collegeRollNumber);

    const users = userData.map(admUser => {
      const { fullName, appNo, fatherName, motherName, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, subject, subsidiary1, subsidiary2, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser;

      return {
        'Student Name': fullName,
        'Application Number': appNo,
        'College Roll No.': collegeRollNumber,
        'Course': "BCA",
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Subject': subject,
        'Subsidiary 1': subsidiary1,
        'Subsidiary 2': subsidiary2,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment,
        "Payment SS": paymentSS
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=BCA_Adm_List_Part_1.csv");

    res.status(200).end(csvData);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Server Error');
  }
}


// BCA Part 2
const bca2List = async (req, res) => {
  const filterQueries = req.query;
  try {
    // Find the user based on request ID
    const user = await User.findOne({ _id: req.id });

    // Initialize the query object
    const query = {};
    let status = "All"

    // Construct the query object based on filterQueries
    if (filterQueries.mobileNumber && filterQueries.mobileNumber !== '') {
      query.mobileNumber = filterQueries.mobileNumber;
      status = "Found"
    }

    if (filterQueries.isPaid && filterQueries.isPaid !== 'all') {
      query.isPaid = filterQueries.isPaid === 'true';
      if (query.isPaid == true) {
        status = "Paid"
      } else {
        status = "Unpaid"
      }
    }
    if (filterQueries.category && filterQueries.category !== 'all') {
      query.category = filterQueries.category;
      status += " " + query.category
    }
    if (filterQueries.gender && filterQueries.gender !== 'all') {
      query.gender = filterQueries.gender;
      status += " " + query.gender
    }

    // Find students based on the constructed query
    const bca2AdmissionList = await bca2FormModel.find(query)
    // console.log(bca3AdmissionList);
    res.render('bca2List', { list: bca2AdmissionList, status, noOfForms: bca2AdmissionList.length, user })
  } catch (error) {
    console.log("Error in get bca2List", error);
  }
}


const bca2StuView = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundStudent = await bca2FormModel.findOne({ _id: stuId })

    res.render('bca2StudentView', { foundStudent, user })
  } catch (error) {
    console.log("Error in get bca2StuView", error)
  }
}


const bca2StuEdit = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params
    const foundStudent = await bca2FormModel.findOne({ _id: stuId })
    res.render("bca2StudentEdit", { user, foundStudent })
  } catch (error) {
    console.log("Error in get bca2StuEdit", error)
  }
}


const bca2StuEditPost = async (req, res) => {
  try {
    const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } = req.body
    const { editId } = req.params

    await bca2FormModel.findOneAndUpdate({ _id: editId }, { $set: { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } })

    const foundUserLogin = await bca2FormModel.findOne({ _id: editId })
    await bca2UserModel.findOneAndUpdate({ _id: foundUserLogin.appliedBy }, { $set: { fullName: studentName, email, mobileNumber } })

    res.redirect('/bca2List')
  } catch (error) {
    console.log("Error in post bca2StuEditPost", error)

  }
}


const BCA_Adm_List_Part_2 = async (req, res) => {
  try {
    const studentsBySubject = await bca2FormModel.find({ isPaid: true })

    const userData = studentsBySubject.sort((a, b) => a.collegeRollNumber - b.collegeRollNumber);

    const users = userData.map(admUser => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, subject, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser;

      return {
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': "BCA",
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Subject': subject,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=BCA_Adm_List_Part_2.csv");

    res.status(200).end(csvData);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Server Error');
  }
}

// Inter Exam Form List
const interExamFormList = async (req, res) => {
  const filterQueries = req.query;
  try {
    // Find the user based on request ID
    const user = await User.findOne({ _id: req.id });

    // Initialize the query object
    const query = {};
    let status = "All"

    // Construct the query object based on filterQueries
    if (filterQueries.isPaid && filterQueries.isPaid !== 'all') {
      query.isPaid = filterQueries.isPaid === 'true';
      if (query.isPaid == true) {
        status = "Paid"
      } else {
        status = "Unpaid"
      }
    }
    if (filterQueries.studentCategory && filterQueries.studentCategory !== 'all') {
      query.studentCategory = filterQueries.studentCategory;
      status += " " + query.studentCategory
    }
    if (filterQueries.faculty && filterQueries.faculty !== 'all') {
      query.faculty = filterQueries.faculty;
      status += " " + query.faculty
    }
    if (filterQueries.registrationNoAndYear) {
      query.registrationNoAndYear = filterQueries.registrationNoAndYear + " and 2024";
      status = 'Found'
    }

    // Find students based on the constructed query
    const interExamFormList = await interExamForm.find(query);


    // Render the template with the filtered list
    res.render('interExamFormList', {
      list: interExamFormList,
      noOfForms: interExamFormList.length,
      user,
      status
    });
  } catch (error) {
    console.log("Error in get interExamFormList", error);
  }
}


const interExamFormExcelList = async (req, res) => {
  const { studentCategory, faculty} = req.params
  try {

    const query = {};
    query.studentCategory = studentCategory
    query.isPaid = true

    if (faculty !== "All") {
      query.faculty = faculty
    }

    const userData = await interExamForm.find(query)

    const users = userData.map(examForm => {
      const { registrationNoAndYear, BSEBUniqueId, studentCategory, collegeCode, collegeName, districtName, studentName, fatherName, motherName, dOB, matricPassingBoardName, matricBoardRollCode, matricBoardRollNumber, matricBoardPassingYear, gender, casteCategory, differentlyAbled, nationality, religion, aadharNumber, qualifyingCategoryRollCode, qualifyingCategoryRollNumber, qualifyingCategoryPassingYear, qualifyingCategoryInstitutionArea, qualifyingCategoryInstitutionSubDivision, qualifyingCategoryMobileNumber, qualifyingCategoryEmail, qualifyingCategoryStudentName, qualifyingCategoryFatherName, qualifyingCategoryMotherName, qualifyingCategoryAddress, qualifyingCategoryMaritalStatus, qualifyingCategoryStudentBankAccountNumber, qualifyingCategoryIFSCCode, qualifyingCategoryBankAndBranchName, qualifyingCategoryTwoIdentificationMarks, qualifyingCategoryMediumOfExam, compulsorySubject1, compulsorySubject2, electiveSubject1, electiveSubject2, electiveSubject3, additionalSubject, faculty, admFee } = examForm;

      return {
        'Registration Number': registrationNoAndYear.split(" ")[0],
        'BSEB Unique Id': BSEBUniqueId,
        'Faculty': faculty,
        'Student Category': studentCategory,
        'Student Name': studentName,
        'FatherName': fatherName,
        'MotherName': motherName,
        'Date of Birth': dOB,
        'Compulsory Subject 1': compulsorySubject1,
        'Compulsory Subject 2': compulsorySubject2,
        'Elective Subject 1': electiveSubject1,
        'Elective Subject 2': electiveSubject2,
        'Elective Subject 3': electiveSubject3,
        'Additional Subject': additionalSubject,
        'College Code': collegeCode,
        'College Name': collegeName,
        'District Name': districtName,
        'Matric Passing Board Name': matricPassingBoardName,
        'Matric Board Roll Code': matricBoardRollCode,
        'Matric Board Roll Number': matricBoardRollNumber,
        'Matric Board Passing Year': matricBoardPassingYear,
        'Gender': gender,
        'Caste Category': casteCategory,
        'Differently Abled': differentlyAbled,
        'Nationality': nationality,
        'Religion': religion,
        'Aadhar Number': aadharNumber,
        'Qualifying Category Roll Code': qualifyingCategoryRollCode,
        'Qualifying Category Roll Number': qualifyingCategoryRollNumber,
        'Qualifying Category Passing Year': qualifyingCategoryPassingYear,
        'Institution Area': qualifyingCategoryInstitutionArea,
        'Institution Sub-Division': qualifyingCategoryInstitutionSubDivision,
        'Mobile Number': qualifyingCategoryMobileNumber,
        'Email': qualifyingCategoryEmail,
        'Admission Fee': admFee,
        'Student Name in Hindi': qualifyingCategoryStudentName,
        'Father Name in Hindi': qualifyingCategoryFatherName,
        'Mother Name in Hindi': qualifyingCategoryMotherName,
        'Address': qualifyingCategoryAddress,
        'Marital Status': qualifyingCategoryMaritalStatus,
        'Student Bank Account Number': qualifyingCategoryStudentBankAccountNumber,
        'IFSC Code': qualifyingCategoryIFSCCode,
        'Bank and Branch Name': qualifyingCategoryBankAndBranchName,
        'Two Identification Marks': qualifyingCategoryTwoIdentificationMarks,
        'Medium of Exam': qualifyingCategoryMediumOfExam
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=Inter-Exam-Form-List-${studentCategory}-${faculty}.csv`);

    res.status(200).end(csvData);
  } catch (error) {
    console.error('Error generating Inter Exam Form CSV:', error);
    res.status(500).send(`Server Error - <b>${studentCategory} students</b> list not available`);
  }
}


// UG Regular Sem 4 Form List
const ugRegularSem4List = async (req, res) => {
  const filterQueries = req.query;
  try {
    // Find the user based on request ID
    const user = await User.findOne({ _id: req.id });

    // Initialize the query object
    const query = {};
    let status = "All"

    // Construct the query object based on filterQueries
    if (filterQueries.isPaid && filterQueries.isPaid !== 'all') {
      query.isPaid = filterQueries.isPaid === 'true';
      if (query.isPaid == true) {
        status = "Paid"
      } else {
        status = "Unpaid"
      }
    }
    if (filterQueries.category && filterQueries.category !== 'all') {
      query.category = filterQueries.category;
      status += " " + query.category
    }
    if (filterQueries.gender && filterQueries.gender !== 'all') {
      query.gender = filterQueries.gender;
      status += " " + query.gender
    }

    // Find students based on the constructed query
    const ugRegularSem4AdmissionList = await ugRegularSem4AdmissionForm.find(query)

    // console.log(ugRegularSem4AdmissionList);
    res.render('ugRegularSem4List', { list: ugRegularSem4AdmissionList, status, noOfForms: ugRegularSem4AdmissionList.length, user })
  } catch (error) {
    console.log(error);
  }
}


const findStuInUGRegSem4Adm = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let { findStuMobileNo } = req.body

    if (findStuMobileNo !== '') {
      let foundStudent = await ugRegularSem4AdmissionForm.find({ mobileNumber: findStuMobileNo })
      res.render('ugRegularSem4List', { list: foundStudent, status: "Found", noOfForms: foundStudent.length, user })

    } else if (findStuMobileNo === '') {
      const foundStudent = await ugRegularSem4AdmissionForm.find({ isPaid: true })
      res.render('ugRegularSem3List', { list: foundStudent, status: "All", formAlert: "Please, Enter Mobile No", noOfForms: foundStudent.length, user })
    }

  } catch (error) {
    console.log(error);
  }
}


const ugRegSem4StuView = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundStudent = await ugRegularSem4AdmissionForm.findOne({ _id: stuId })
    const foundStudentID = await ugRegularSem4User.findOne({ _id: foundStudent.appliedBy })

    res.render('ugRegularSem4StudentView', { foundStudent, foundStudentID, user })
  } catch (error) {
    console.log(error)
  }
}


const ugRegSem4StuEdit = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params
    const foundStudent = await ugRegularSem4AdmissionForm.findOne({ _id: stuId })
    const foundStudentID = await ugRegularSem4User.findOne({ _id: foundStudent.appliedBy })
    res.render("ugRegularSem4StudentEdit", { user, foundStudent, foundStudentID })
  } catch (error) {
    console.log(error)
  }
}


const ugRegSem4StuEditPost = async (req, res) => {
  try {
    let { studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, course, email, paper1, paper2, paper3, dOB, gender, category, religion, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } = req.body
    const { editId } = req.params

    if (admissionFee === "3005" || admissionFee === "2405" || admissionFee === "1600" || admissionFee === "1805" || admissionFee === "1000") {
      if (gender === "MALE") {
        if (course === "Bachelor of Science" || paper1 === "Psychology") {
          if (category === "GENERAL" || category === "BC-2") {
            admissionFee = 3005
          } else if (category === "BC-1") {
            admissionFee = 2405
          } else {
            admissionFee = 1600
          }
        } else {
          if (category === "GENERAL" || category === "BC-2") {
            admissionFee = 2405
          } else if (category === "BC-1") {
            admissionFee = 1805
          } else {
            admissionFee = 1000
          }
        }
  
      } else {
        if (course === "Bachelor of Science" || paper1 === "Psychology") {
          admissionFee = 1600
        } else {
          admissionFee = 1000
        }
      }
    } else {
      if (gender === "MALE") {
        if (course === "Bachelor of Science" || paper1 === "Psychology") {
          if (category === "GENERAL" || category === "BC-2") {
            admissionFee = 2905
          } else if (category === "BC-1") {
            admissionFee = 2305
          } else {
            admissionFee = 1500
          }
        } else {
          if (category === "GENERAL" || category === "BC-2") {
            admissionFee = 2305
          } else if (category === "BC-1") {
            admissionFee = 1705
          } else {
            admissionFee = 900
          }
        }
  
      } else {
        if (course === "Bachelor of Science" || paper1 === "Psychology") {
          admissionFee = 1500
        } else {
          admissionFee = 900
        }
      }
    }

    await ugRegularSem4AdmissionForm.findOneAndUpdate({ _id: editId }, { $set: { studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, email, paper1, paper2, paper3, dOB, gender, category, religion, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } })

    const foundUserLogin = await ugRegularSem4AdmissionForm.findOne({ _id: editId })
    await ugRegularSem4User.findOneAndUpdate({ _id: foundUserLogin.appliedBy }, { $set: { fullName: studentName, course, email, mobileNumber } })

    res.redirect('/ugRegularSem4List')
  } catch (error) {
    console.log(error)
  }
}


const UG_Reg_Sem_IV_Adm_List = async (req, res) => {
  try {
    const userData = await ugRegularSem4AdmissionForm.find({ isPaid: true })

    console.log(userData.length)

    const users = userData.map(admUser => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser;

      let course = "";
      if (["Economics", "History", "Political Science", "Psychology", "Sociology"].includes(paper1)) {
        course = "Bachelor of Arts (Social Science Subjects)";
      } else if (["English", "Hindi", "Urdu", "Philosophy"].includes(paper1)) {
        course = "Bachelor of Arts (Humanities Subjects)";
      } else {
        course = "Bachelor of Science";
      }

      return {
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Religion': religion,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `Add - ${address}, District - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=UG_Reg_Sem_IV_BA_Adm_List.csv");

    res.status(200).end(csvData);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Server Error');
  }
};


const UG_Reg_Sem_IV_BA_Adm_List = async (req, res) => {
  try {
    const subjects = ["Economics", "History", "Political Science", "Psychology", "Sociology", "English", "Hindi", "Urdu", "Philosophy"];
    const promises = subjects.map(subject => ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: subject }));
    const studentsBySubject = await Promise.all(promises);

    const userData = studentsBySubject.flat().sort((a, b) => a.collegeRollNumber - b.collegeRollNumber);

    const users = userData.map(admUser => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser;

      let course = "";
      if (["Economics", "History", "Political Science", "Psychology", "Sociology"].includes(paper1)) {
        course = "Bachelor of Arts (Social Science Subjects)";
      } else if (["English", "Hindi", "Urdu", "Philosophy"].includes(paper1)) {
        course = "Bachelor of Arts (Humanities Subjects)";
      } else {
        course = "Bachelor of Science";
      }

      return {
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Religion': religion,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `Add - ${address}, District - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=UG_Reg_Sem_IV_BA_Adm_List.csv");

    res.status(200).end(csvData);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Server Error');
  }
};


const UG_Reg_Sem_IV_BA_SS_Adm_List = async (req, res) => {
  try {
    let users = []
    const economicsStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "Economics" })
    const historyStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "History" })
    const politicalScienceStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "Political Science" })
    const psychologyStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "Psychology" })
    const sociologyStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "Sociology" })

    console.log(economicsStudents.length, historyStudents.length, politicalScienceStudents.length, psychologyStudents.length, sociologyStudents.length)

    const userData = [...economicsStudents, ...historyStudents, ...politicalScienceStudents, ...psychologyStudents, ...sociologyStudents].sort((a, b) => a.collegeRollNumber - b.collegeRollNumber)


    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"

      } else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"

      } else {
        course = "Bachelor of Science"

      }

      users.push({
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Religion': religion,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `Add - ${address}, District - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_IV_BA_SS_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}


const UG_Reg_Sem_IV_BA_Hum_Adm_List = async (req, res) => {
  try {
    let users = []
    const englishStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "English" })
    const hindiStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "Hindi" })
    const urduStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "Urdu" })
    const philosophyStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "Philosophy" })

    console.log(englishStudents.length, hindiStudents.length, urduStudents.length, philosophyStudents.length)

    const userData = [...englishStudents, ...hindiStudents, ...urduStudents, ...philosophyStudents].sort((a, b) => a.collegeRollNumber - b.collegeRollNumber)


    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"

      } else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"

      } else {
        course = "Bachelor of Science"

      }

      users.push({
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Religion': religion,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_IV_BA_Hum_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}


const UG_Reg_Sem_IV_BSc_Adm_List = async (req, res) => {
  try {
    let users = []
    const physicsStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "Physics" })
    const chemistryStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "Chemistry" })
    const zoologyStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "Zoology" })
    const botanyStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "Botany" })
    const mathematicsStudents = await ugRegularSem4AdmissionForm.find({ isPaid: true, paper1: "Mathematics" })
    console.log(physicsStudents.length, chemistryStudents.length, zoologyStudents.length, botanyStudents.length, mathematicsStudents.length)

    const userData = [...physicsStudents, ...chemistryStudents, ...zoologyStudents, ...botanyStudents, ...mathematicsStudents].sort((a, b) => a.collegeRollNumber - b.collegeRollNumber)


    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"

      } else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"

      } else {
        course = "Bachelor of Science"

      }

      users.push({
        'Student Name': studentName,
        'Uni. Reg. Number': uniRegNumber,
        'Uni. Roll Number': uniRollNumber,
        'College Roll No.': collegeRollNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'Religion': religion,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_IV_BSc_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}


const ugRegSem4Password = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const userIdAndPasswordList = await ugRegularSem4User.find({})
    res.render("ugRegSem4PasswordList", { list: userIdAndPasswordList, status: "All", noOfForms: userIdAndPasswordList.length, user })
  } catch (error) {
    console.log(error)
  }

}


const ugRegSem4PasswordPost = async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber
    const user = await User.findOne({ _id: req.id })

    if (mobileNumber !== '') {
      let foundMobileNumber = await ugRegularSem4User.find({ mobileNumber })
      res.render("ugRegSem4PasswordList", { list: foundMobileNumber, status: "Found", noOfForms: foundMobileNumber.length, user })

    } else if (mobileNumber === '') {
      const foundMobileNumber = await ugRegularSem4User.find({})
      res.render("ugRegSem4PasswordList", { list: foundMobileNumber, status: "All", formAlert: "Please, Enter Mobile No", noOfForms: foundMobileNumber.length, user })
    }
  } catch (error) {
    console.log(error)
  }

}


export {
  adminPage,
  admissionFormList,
  paidAdmissionFormList,
  unpaidAdmissionFormList,
  genBC2Category,
  bc1SCSTCategory,
  scienceStu,
  artsStu,
  clcList,
  clcApprovedId,
  clcRejectId,
  clcApproved,
  clcRejected,
  approvedByAdmin,
  findStuInAdmForm,
  datewiseAdmForm,
  downloadExcel,
  notice,
  noticePost,
  editNotice,
  editNoticePost,
  deleteNotice,

  //ug regular sem 1 list
  ugRegularSem1List,
  findStuInUGRegSem1Adm,
  ugRegSem1StuView,
  ugRegSem1StuEdit,
  ugRegSem1StuEditPost,
  datewiseUgRegSem1List,
  UG_Reg_Sem_I_Adm_List,
  UG_Reg_Sem_I_BA_Adm_List,
  UG_Reg_Sem_I_BA_SS_Adm_List,
  UG_Reg_Sem_I_BA_Hum_Adm_List,
  UG_Reg_Sem_I_BSc_Adm_List,
  ugRegSem1Password,
  editUserId,
  editUserIdPost,
  findUserId,

  //ug regular sem 3 list
  ugRegularSem3List,
  findStuInUGRegSem3Adm,
  ugRegSem3StuView,
  ugRegSem3StuEdit,
  ugRegSem3StuEditPost,
  UG_Reg_Sem_III_Adm_List,
  UG_Reg_Sem_III_BA_Adm_List,
  UG_Reg_Sem_III_BA_SS_Adm_List,
  UG_Reg_Sem_III_BA_Hum_Adm_List,
  UG_Reg_Sem_III_BSc_Adm_List,

  //BCA Part 3
  bca3List,
  findStuInbca3Adm,
  bca3StuView,
  bca3StuEdit,
  bca3StuEditPost,
  BCA_Adm_List,

  // UG Regualr Part 3
  ugRegularPart3List,
  findStuInUGRegPart3Adm,
  ugRegPart3StuView,
  ugRegPart3StuEdit,
  ugRegPart3StuEditPost,
  UG_Reg_Part_III_Adm_List,
  UG_Reg_Part_III_BA_Adm_List,
  UG_Reg_Part_III_BSc_Adm_List,
  oldClcList,

  //BCA Part 1
  bca1List,
  bca1StuView,
  bca1StuEdit,
  bca1StuEditPost,
  BCA_Adm_List_Part_1,

  //BCA Part 2
  bca2List,
  bca2StuView,
  bca2StuEdit,
  bca2StuEditPost,
  BCA_Adm_List_Part_2,

  // Inter Exam Form List
  interExamFormList,
  interExamFormExcelList,

  // UG Regular Sem 4
  ugRegularSem4List,
  findStuInUGRegSem4Adm,
  ugRegSem4StuView,
  ugRegSem4StuEdit,
  ugRegSem4StuEditPost,
  UG_Reg_Sem_IV_Adm_List,
  UG_Reg_Sem_IV_BA_Adm_List,
  UG_Reg_Sem_IV_BA_SS_Adm_List,
  UG_Reg_Sem_IV_BA_Hum_Adm_List,
  UG_Reg_Sem_IV_BSc_Adm_List,
  ugRegSem4Password,
  ugRegSem4PasswordPost
}