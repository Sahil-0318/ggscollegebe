import express from 'express'
const adminRouter = express.Router()
import { adminAuth } from '../middlewares/adminMiddleware.js'
import multer from 'multer'

import {
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

    // ug regular sem 1 list
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

    // ug regular sem 3 list
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

    // UG Regular Part 3
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

    // UG Regular Sem 4 List
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
    from '../controllers/adminController.js'

const storage = multer.diskStorage({})

const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})

adminRouter.get('/adminPage', adminAuth, adminPage)

adminRouter.get('/admissionFormList', adminAuth, admissionFormList)

adminRouter.get('/paidAdmissionFormList', adminAuth, paidAdmissionFormList)

adminRouter.get('/unpaidAdmissionFormList', adminAuth, unpaidAdmissionFormList)

adminRouter.get('/genBC2Category', adminAuth, genBC2Category)

adminRouter.get('/bc1SCSTCategory', adminAuth, bc1SCSTCategory)

adminRouter.get('/scienceStu', adminAuth, scienceStu)

adminRouter.get('/artsStu', adminAuth, artsStu)

adminRouter.get('/clcList', adminAuth, clcList)

adminRouter.get('/clcApproved/:id', adminAuth, clcApprovedId)

adminRouter.get('/clcReject/:id', adminAuth, clcRejectId)

adminRouter.get('/clcApproved', adminAuth, clcApproved)

adminRouter.get('/clcRejected', adminAuth, clcRejected)

adminRouter.post('/approvedByAdmin', approvedByAdmin)

adminRouter.post('/findStuInAdmForm', adminAuth, findStuInAdmForm)

adminRouter.post('/datewiseAdmForm', adminAuth, datewiseAdmForm)

adminRouter.get('/download-excel', adminAuth, downloadExcel)

adminRouter.get('/notice', adminAuth, notice)

adminRouter.post('/notice', upload.single('noticePDF'), adminAuth, noticePost)

adminRouter.get('/edit-notice/:id', adminAuth, editNotice)

adminRouter.post('/edit-notice/:id', upload.single('noticePDF'), adminAuth, editNoticePost)

adminRouter.get('/delete-notice/:id', adminAuth, deleteNotice)

//UG Regular Sem -1 List

adminRouter.get('/ugRegularSem1List', adminAuth, ugRegularSem1List)

adminRouter.post('/ugRegularSem1List', adminAuth, findStuInUGRegSem1Adm)

adminRouter.get('/student-view/:stuId', adminAuth, ugRegSem1StuView)

adminRouter.get('/ugRegularSem1StudentEdit/:stuId', adminAuth, ugRegSem1StuEdit)

adminRouter.post('/ugRegularSem1StudentEditPost/:editId', adminAuth, ugRegSem1StuEditPost)

adminRouter.post('/datewiseUgRegSem1List', adminAuth, datewiseUgRegSem1List)

adminRouter.get('/UG_Reg_Sem_I_Adm_List', adminAuth, UG_Reg_Sem_I_Adm_List)

adminRouter.get('/UG_Reg_Sem_I_BA_Adm_List', adminAuth, UG_Reg_Sem_I_BA_Adm_List)

adminRouter.get('/UG_Reg_Sem_I_BA_SS_Adm_List', adminAuth, UG_Reg_Sem_I_BA_SS_Adm_List)

adminRouter.get('/UG_Reg_Sem_I_BA_Hum_Adm_List', adminAuth, UG_Reg_Sem_I_BA_Hum_Adm_List)

adminRouter.get('/UG_Reg_Sem_I_BSc_Adm_List', adminAuth, UG_Reg_Sem_I_BSc_Adm_List)

adminRouter.get('/ugRegSem1Password', adminAuth, ugRegSem1Password)

adminRouter.get('/editUserId/:id', adminAuth, editUserId)

adminRouter.post('/editUserIdForm/:editId', adminAuth, editUserIdPost)

adminRouter.post('/findUserId', adminAuth, findUserId)

// UG Regular Sem - 3 List
adminRouter.get('/ugRegularSem3List', adminAuth, ugRegularSem3List)

adminRouter.post('/ugRegularSem3List', adminAuth, findStuInUGRegSem3Adm)

adminRouter.get('/ugRegularSem3StudentView/:stuId', adminAuth, ugRegSem3StuView)

adminRouter.get('/ugRegularSem3StudentEdit/:stuId', adminAuth, ugRegSem3StuEdit)

adminRouter.post('/ugRegularSem3StudentEditPost/:editId', adminAuth, ugRegSem3StuEditPost)

adminRouter.get('/UG_Reg_Sem_III_Adm_List', adminAuth, UG_Reg_Sem_III_Adm_List)

adminRouter.get('/UG_Reg_Sem_III_BA_Adm_List', adminAuth, UG_Reg_Sem_III_BA_Adm_List)

adminRouter.get('/UG_Reg_Sem_III_BA_SS_Adm_List', adminAuth, UG_Reg_Sem_III_BA_SS_Adm_List)

adminRouter.get('/UG_Reg_Sem_III_BA_Hum_Adm_List', adminAuth, UG_Reg_Sem_III_BA_Hum_Adm_List)

adminRouter.get('/UG_Reg_Sem_III_BSc_Adm_List', adminAuth, UG_Reg_Sem_III_BSc_Adm_List)

// BCA Part 3 List
adminRouter.get('/bca3List', adminAuth, bca3List)

adminRouter.post('/bca3List', adminAuth, findStuInbca3Adm)

adminRouter.get('/bca3StudentView/:stuId', adminAuth, bca3StuView)

adminRouter.get('/bca3StudentEdit/:stuId', adminAuth, bca3StuEdit)

adminRouter.post('/bca3StudentEditPost/:editId', adminAuth, bca3StuEditPost)

adminRouter.get('/BCA_Adm_List', adminAuth, BCA_Adm_List)

// UG Regular Part 3
adminRouter.get('/ugRegularPart3List', adminAuth, ugRegularPart3List)

adminRouter.post('/ugRegularPart3List', adminAuth, findStuInUGRegPart3Adm)

adminRouter.get('/ugRegularPart3StudentView/:stuId', adminAuth, ugRegPart3StuView)

adminRouter.get('/ugRegularPart3StudentEdit/:stuId', adminAuth, ugRegPart3StuEdit)

adminRouter.post('/ugRegularPart3StudentEditPost/:editId', adminAuth, ugRegPart3StuEditPost)

adminRouter.get('/UG_Reg_Part_III_Adm_List', adminAuth, UG_Reg_Part_III_Adm_List)

adminRouter.get('/UG_Reg_Part_III_BA_Adm_List', adminAuth, UG_Reg_Part_III_BA_Adm_List)

adminRouter.get('/UG_Reg_Part_III_BSc_Adm_List', adminAuth, UG_Reg_Part_III_BSc_Adm_List)

adminRouter.get('/oldClcList', adminAuth, oldClcList)

// BCA Part 1 List
adminRouter.get('/bca1List', adminAuth, bca1List)

adminRouter.get('/bca1StudentView/:stuId', adminAuth, bca1StuView)

adminRouter.get('/bca1StudentEdit/:stuId', adminAuth, bca1StuEdit)

adminRouter.post('/bca1StudentEditPost/:editId', adminAuth, bca1StuEditPost)

adminRouter.get('/BCA_Adm_List_Part_1', adminAuth, BCA_Adm_List_Part_1)

// BCA Part 2 List
adminRouter.get('/bca2List', adminAuth, bca2List)

adminRouter.get('/bca2StudentView/:stuId', adminAuth, bca2StuView)

adminRouter.get('/bca2StudentEdit/:stuId', adminAuth, bca2StuEdit)

adminRouter.post('/bca2StudentEditPost/:editId', adminAuth, bca2StuEditPost)

adminRouter.get('/BCA_Adm_List_Part_2', adminAuth, BCA_Adm_List_Part_2)


// Inter Exam Form List (2023 - 25)
adminRouter.get('/interExamFormList', adminAuth, interExamFormList)

adminRouter.get('/interExamFormExcelList/:studentCategory/:faculty', adminAuth, interExamFormExcelList)

// UG Regular Sem 4 Form List (2023 - 25)
adminRouter.get('/ugRegularSem4List', adminAuth, ugRegularSem4List)

adminRouter.post('/ugRegularSem4List', adminAuth, findStuInUGRegSem4Adm)

adminRouter.get('/ugRegularSem4StudentView/:stuId', adminAuth, ugRegSem4StuView)

adminRouter.get('/ugRegularSem4StudentEdit/:stuId', adminAuth, ugRegSem4StuEdit)

adminRouter.post('/ugRegularSem4StudentEditPost/:editId', adminAuth, ugRegSem4StuEditPost)

adminRouter.get('/UG_Reg_Sem_IV_Adm_List', adminAuth, UG_Reg_Sem_IV_Adm_List)

adminRouter.get('/UG_Reg_Sem_IV_BA_Adm_List', adminAuth, UG_Reg_Sem_IV_BA_Adm_List)

adminRouter.get('/UG_Reg_Sem_IV_BA_SS_Adm_List', adminAuth, UG_Reg_Sem_IV_BA_SS_Adm_List)

adminRouter.get('/UG_Reg_Sem_IV_BA_Hum_Adm_List', adminAuth, UG_Reg_Sem_IV_BA_Hum_Adm_List)

adminRouter.get('/UG_Reg_Sem_IV_BSc_Adm_List', adminAuth, UG_Reg_Sem_IV_BSc_Adm_List)

adminRouter.get('/ugRegSem4Password', adminAuth, ugRegSem4Password)

adminRouter.post('/ugRegSem4Password', adminAuth, ugRegSem4PasswordPost)


export default adminRouter