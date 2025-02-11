import mongoose from 'mongoose';
import fs from 'fs'
import csv from 'csv-parser'

const uploadBCA1Meritlist = async (filePath) => {
    try {
        // Define a Mongoose schema (adjust this according to your CSV data structure)
        const Schema = mongoose.Schema;
        const DataSchema = new Schema({
            appNo: {
                type: String
            },
            candidateName: {
                type: String
            },
            fatherName: {
                type: String
            },
            mobileNo: {
                type: Number
            },
            email: {
                type: String
            },
            gender: {
                type: String
            },
            dOB: {
                type: String
            }
        }, { strict: false });
        const DataModel = mongoose.model('Data1', DataSchema, 'bca1MeritList1'); // Replace 'yourcollection' with your actual collection name
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
        console.log("Error in uploadBCA1Meritlist", error)
    }
}

export default uploadBCA1Meritlist