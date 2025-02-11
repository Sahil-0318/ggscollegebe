import User from '../models/userModel/userSchema.js'
import PortalOnOff from '../models/adminModel/portalOnOffSchema.js'

const ugRegularSem1Potal202428 = async (req, res) => {
    try {
        let queries = req.query
        const user = await User.findOne({ _id: req.id })

        if (queries.isOn === "true") {
            await PortalOnOff.findOneAndUpdate({portal : "ugRegularSem1_24-28"}, { $set : {isOn : false} })
        }  

        if (queries.isOn === "false") {
            await PortalOnOff.findOneAndUpdate({portal : "ugRegularSem1_24-28"}, { $set : {isOn : true} })
        }

        const portal = await PortalOnOff.findOne({portal : "ugRegularSem1_24-28"})
        res.render('portalOnOff', { url : "ugRegularSem1Potal202428", session : "UG Regular Sem 1 (2024 - 28)", user, portal : portal.isOn })
    } catch (error) {
        console.log("Error in UG Regular Sem 3 Potal 2024-28 Get Method =====>", error)
    }
}

const ugRegularPart3Potal202225 = async (req, res) => {
    try {
        let queries = req.query
        const user = await User.findOne({ _id: req.id })

        if (queries.isOn === "true") {
            await PortalOnOff.findOneAndUpdate({portal : "ugRegularPart3_22-25"}, { $set : {isOn : false} })
        }  

        if (queries.isOn === "false") {
            await PortalOnOff.findOneAndUpdate({portal : "ugRegularPart3_22-25"}, { $set : {isOn : true} })
        }

        const portal = await PortalOnOff.findOne({portal : "ugRegularPart3_22-25"})
        res.render('portalOnOff', { url : "ugRegularPart3Potal202225", session : "UG Regular Part 3 (2022 - 25)", user, portal : portal.isOn })
    } catch (error) {
        console.log("Error in UG Regular Part3 Potal 2022-25 Get Method =====>", error)
    }
}


const ugRegularPart3Potal202327 = async (req, res) => {
    try {
        let queries = req.query
        const user = await User.findOne({ _id: req.id })

        if (queries.isOn === "true") {
            await PortalOnOff.findOneAndUpdate({portal : "ugRegularSem3_23-27"}, { $set : {isOn : false} })
        }  

        if (queries.isOn === "false") {
            await PortalOnOff.findOneAndUpdate({portal : "ugRegularSem3_23-27"}, { $set : {isOn : true} })
        }

        const portal = await PortalOnOff.findOne({portal : "ugRegularSem3_23-27"})
        res.render('portalOnOff', { url : "ugRegularSem3Potal202327", session : "UG Regular Sem 3 (2023 - 27)", user, portal : portal.isOn })
    } catch (error) {
        console.log("Error in UG Regular Part3 Potal 2022-25 Get Method =====>", error)
    }
}


const bca1202427 = async (req, res) => {
    try {
        let queries = req.query
        const user = await User.findOne({ _id: req.id })

        if (queries.isOn === "true") {
            await PortalOnOff.findOneAndUpdate({portal : "bca1_24-27"}, { $set : {isOn : false} })
        }  

        if (queries.isOn === "false") {
            await PortalOnOff.findOneAndUpdate({portal : "bca1_24-27"}, { $set : {isOn : true} })
        }

        const portal = await PortalOnOff.findOne({portal : "bca1_24-27"})
        res.render('portalOnOff', { url : "bca1202427", session : "BCA Part 1 (2024 - 27)", user, portal : portal.isOn })
    } catch (error) {
        console.log("Error in BCA Part 1 Potal 2024-27 Get Method =====>", error)
    }
}


const bca3202225 = async (req, res) => {
    try {
        let queries = req.query
        const user = await User.findOne({ _id: req.id })

        if (queries.isOn === "true") {
            await PortalOnOff.findOneAndUpdate({portal : "bca3_22-25"}, { $set : {isOn : false} })
        }  

        if (queries.isOn === "false") {
            await PortalOnOff.findOneAndUpdate({portal : "bca3_22-25"}, { $set : {isOn : true} })
        }

        const portal = await PortalOnOff.findOne({portal : "bca3_22-25"})
        res.render('portalOnOff', { url : "bca3202225", session : "BCA Part 3 (2022 - 25)", user, portal : portal.isOn })
    } catch (error) {
        console.log("Error in BCA Part 3 Potal 2022-25 Get Method =====>", error)
    }
}


const bca2202326 = async (req, res) => {
    try {
        let queries = req.query
        const user = await User.findOne({ _id: req.id })

        if (queries.isOn === "true") {
            await PortalOnOff.findOneAndUpdate({portal : "bca2_23-26"}, { $set : {isOn : false} })
        }  

        if (queries.isOn === "false") {
            await PortalOnOff.findOneAndUpdate({portal : "bca2_23-26"}, { $set : {isOn : true} })
        }

        const portal = await PortalOnOff.findOne({portal : "bca2_23-26"})
        res.render('portalOnOff', { url : "bca2202326", session : "BCA Part 2 (2023 - 26)", user, portal : portal.isOn })
    } catch (error) {
        console.log("Error in BCA Part 2 Potal 2023-26 Get Method =====>", error)
    }
}


const interExamFormPortal = async (req, res) => {
    try {
        let queries = req.query
        const user = await User.findOne({ _id: req.id })

        if (queries.isOn === "true") {
            await PortalOnOff.findOneAndUpdate({portal : "interExamFormPortal"}, { $set : {isOn : false} })
        }  

        if (queries.isOn === "false") {
            await PortalOnOff.findOneAndUpdate({portal : "interExamFormPortal"}, { $set : {isOn : true} })
        }

        const portal = await PortalOnOff.findOne({portal : "interExamFormPortal"})
        res.render('portalOnOff', { url : "interExamFormPortal", session : "Intermediate Exam Form (2023 - 25)", user, portal : portal.isOn })
    } catch (error) {
        console.log("Error in interExamFormPortal Get Method =====>", error)
    }
}


const ugRegularSem43Potal202327 = async (req, res) => {
    try {
        let queries = req.query
        const user = await User.findOne({ _id: req.id })

        if (queries.isOn === "true") {
            await PortalOnOff.findOneAndUpdate({portal : "ugRegularSem4_23-27"}, { $set : {isOn : false} })
        }  

        if (queries.isOn === "false") {
            await PortalOnOff.findOneAndUpdate({portal : "ugRegularSem4_23-27"}, { $set : {isOn : true} })
        }

        const portal = await PortalOnOff.findOne({portal : "ugRegularSem4_23-27"})
        res.render('portalOnOff', { url : "ugRegularSem4Potal202327", session : "UG Regular Sem 4 (2023 - 27)", user, portal : portal.isOn })
    } catch (error) {
        console.log("Error in UG Regular Sem 4 Potal 2022-25 Get Method =====>", error)
    }
}


export {
    ugRegularSem1Potal202428,
    ugRegularPart3Potal202225,
    ugRegularPart3Potal202327,
    bca1202427,
    bca3202225,
    bca2202326,
    interExamFormPortal,
    ugRegularSem43Potal202327
}