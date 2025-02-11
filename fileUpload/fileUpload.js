import cloudinary from 'cloudinary'
import sharp from 'sharp';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_USER_SECRET,
  secure: true,
});

const uploadFile = async (filePath) => {
  try {
    // Resize and compress the image using sharp
    const processedImage = await sharp(filePath)
      .resize({ width: 500 })
      .jpeg({ quality: 70 })
      .toBuffer();

    // Upload the processed image to Cloudinary
    // Return a promise that will be resolved or rejected based on the Cloudinary upload result
    return new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream({
        resource_type: 'image',
        format: 'jpg',
      }, (error, result) => {
        if (error) {
          reject(new Error('Cloudinary upload failed'));
        } else {
          resolve(result);
        }
      });

      // Pipe the processed image buffer to the Cloudinary upload stream
      stream.end(processedImage);
    });
  } catch (error) {
    console.log('Upload error', error.message);
    console.log('Upload error', error);

  }
};

export default uploadFile