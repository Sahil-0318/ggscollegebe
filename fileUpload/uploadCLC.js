import mongoose from 'mongoose';
import fs from 'fs'
import csv from 'csv-parser'

const clcList = async (filePath) => {
    try {
        // Define a Mongoose schema (adjust this according to your CSV data structure)
        const Schema = mongoose.Schema;
        const DataSchema = new Schema({
            _id:{
                type: mongoose.Schema.Types.ObjectId
            },
            fullName:{
                type : String
            },
            fatherName: {
                type : String
            },
            motherName: {
                type : String
            },
            aadharNumber: {
                type : Number
            },
            parmanentAddress: {
                type : String
            },
            dOB: {
                type : String
            },
            course: {
                type : String
            },
            session: {
                type : String
            },
            dOAdm: {
                type : String
            },
            classRollNumber: {
                type : Number
            },
            yearOfExam: {
                type : String
            },
            resultDivision:{
                type : String
            },
            regNumber :{
                type: String
            },
            uniRollNumber: {
                type : String
            },
            remark:{
                type: String
            },
            serialNo:{
                type : Number
            },
            studentId:{
                type: String
            },
            appliedBy: {
                type : String
            },
            isFormFilled :{
                type: Boolean
            },
            // ===================================== normal =====================================================
            normalClcFee:{
                type: Number
            },
            isNormalPaid :{
                type: Boolean
            },
            isNormalIssued :{
                type: Boolean
            },
            normalPaymentRefNo:{
                type : String
            },
            normalPaymentSS: {
                type : String
            },
            normalPaidAt: {
                type : String
            },
            
            
        
            // ====================================== Urgent ===========================================
            urgentClcFee:{
                type: Number
            },
            isUrgentPaid :{
                type: Boolean
            },
            isUrgentIssued :{
                type: Boolean
            },
            urgentPaymentRefNo:{
                type : String
            },
            urgentPaymentSS: {
                type : String
            },
            urgentPaidAt: {
                type : String
            },
            
            
        
            //============================= Duplicate ==================================
            duplicateClcFee:{
                type: Number
            },
            isDuplicatePaid :{
                type: Boolean
            },
            isDuplicateIssued :{
                type: Boolean
            },
            duplicatePaymentRefNo:{
                type : String
            },
            duplicatePaymentSS: {
                type : String
            },
            duplicatePaidAt: {
                type : String
            },
    
            
            __v: {
                type : Number
            },
            normalPaymentReceipt:{
                type : String
            },
            urgentPaymentReceipt:{
                type : String
            },
            duplicatePaymentReceipt:{
                type : String
            },
            normalIssuedAt: {
                type : String
            },
            urgentIssuedAt: {
                type : String
            },
            duplicateIssuedAt: {
                type : String
            }
        }, { strict: false });
        const DataModel = mongoose.model('Data10', DataSchema, 'newclcs'); // Replace 'yourcollection' with your actual collection name
        // ====================================================================================

        // importing csv file to mongodb atlas
        // Function to read CSV and import to MongoDB
        async function importCsvToMongoDB(filePath) {
            const jsonData = [];

            // Read the CSV file
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    jsonData.push(row);
                })
                .on('end', async () => {
                    try {
                        // Insert the JSON data into MongoDB
                        await DataModel.insertMany(jsonData);
                        console.log('Data imported successfully');
                    } catch (err) {
                        console.error('Error importing data:', err);
                    } finally {
                        // Close the MongoDB connection
                        mongoose.connection.close();
                    }
                });
        }
        // =========================================================================================

        // importing csv file to mongodb atlas
        // Path to your CSV file
        // const filePath = 'bca1meritlist1'; // Replace with the path to your CSV file
        importCsvToMongoDB(filePath);
        // ===========================================================================================
    } catch (error) {
        console.log("Error in clcList Upload", error)
    }
}

export default clcList