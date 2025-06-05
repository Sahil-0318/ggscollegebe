import cloudinary from 'cloudinary';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_USER_SECRET,
  secure: true,
});

export const uploadFile = async (file) => {
  try {
    if (!file || !file.buffer || !file.mimetype) {
      throw new Error("Invalid file input: missing buffer or mimetype");
    }

    const mimetype = file.mimetype;

    if (mimetype.startsWith('image/')) {
      const processedImage = await sharp(file.buffer)
        .resize({ width: 500 })
        .jpeg({ quality: 70 })
        .toBuffer();

      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { resource_type: 'image', format: 'jpg' },
          (err, result) => {
            if (err) {
              console.error('Cloudinary image upload error:', err);
              return reject(new Error('Image upload failed'));
            }
            // Optional: console.log('Image uploaded:', result.secure_url);
            resolve(result);
          }
        );
        stream.end(processedImage);
      });
    }

    else if (mimetype === 'application/pdf') {
      const pdfDoc = await PDFDocument.load(file.buffer);
      const compressedPdf = await pdfDoc.save({ useObjectStreams: false });

      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { resource_type: 'raw', format: 'pdf' },
          (err, result) => {
            if (err) {
              console.error('Cloudinary PDF upload error:', err);
              return reject(new Error('PDF upload failed'));
            }
            // Optional: console.log('PDF uploaded:', result.secure_url);
            resolve(result);
          }
        );
        stream.end(compressedPdf);
      });
    }

    else {
      throw new Error('Unsupported file type');
    }
  } catch (err) {
    console.error('File upload error:', err);
    throw err;  // Let controller handle the error
  }
};


export const noticeUpload = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error('Notice Uploading Error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(file.buffer); // file.buffer is available only with memoryStorage
  });
};



  