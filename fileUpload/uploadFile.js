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
      throw new Error("Invalid file input");
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
          (err, result) => (err ? reject(err) : resolve(result))
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
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(compressedPdf);
      });
    }

    else {
      throw new Error('Unsupported file type');
    }
  } catch (err) {
    console.error('File upload error:', err);
    throw err;
  }
};

